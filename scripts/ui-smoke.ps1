param([string]$Url = 'http://127.0.0.1:4176')

$ErrorActionPreference = 'Stop'
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$debugPort = 9337
$profileDir = Join-Path ([System.IO.Path]::GetTempPath()) ('gro4ce-ui-' + [guid]::NewGuid().ToString('N'))
$chromeProcess = $null
$socket = $null

function Send-Cdp {
  param([string]$Method, [hashtable]$Params = @{})
  $script:commandId++
  $requestId = $script:commandId
  $json = @{ id = $requestId; method = $Method; params = $Params } | ConvertTo-Json -Compress -Depth 20
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $segment = [ArraySegment[byte]]::new($bytes)
  $null = $socket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

  while ($true) {
    $buffer = New-Object byte[] 131072
    $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    $response = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $received.Count) | ConvertFrom-Json
    if ($response.id -eq $requestId) { return $response }
  }
}

function Eval-Js {
  param([string]$Expression)
  $response = Send-Cdp 'Runtime.evaluate' @{ expression = $Expression; returnByValue = $true; awaitPromise = $true }
  if ($response.result.exceptionDetails) { throw $response.result.exceptionDetails.text }
  return $response.result.result.value
}

function Assert-Ui {
  param([bool]$Condition, [string]$Message)
  if (-not $Condition) { throw "UI assertion failed: $Message" }
}

try {
  $chromeProcess = Start-Process -FilePath $chromePath -WindowStyle Hidden -PassThru -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    "--remote-debugging-port=$debugPort",
    "--user-data-dir=$profileDir",
    'about:blank'
  )

  $deadline = (Get-Date).AddSeconds(15)
  do {
    try { $tabs = Invoke-RestMethod "http://127.0.0.1:$debugPort/json"; break } catch { Start-Sleep -Milliseconds 200 }
  } while ((Get-Date) -lt $deadline)
  if (-not $tabs) { throw 'Chrome DevTools endpoint did not start.' }

  $pageTarget = $tabs | Where-Object { $_.type -eq 'page' -and $_.url -eq 'about:blank' } | Select-Object -First 1
  if (-not $pageTarget) { $pageTarget = $tabs | Where-Object { $_.type -eq 'page' } | Select-Object -First 1 }
  $socket = [System.Net.WebSockets.ClientWebSocket]::new()
  $null = $socket.ConnectAsync([uri]$pageTarget.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  $script:commandId = 0
  Send-Cdp 'Page.enable' | Out-Null
  Send-Cdp 'Runtime.enable' | Out-Null
  Send-Cdp 'Page.navigate' @{ url = $Url } | Out-Null
  Start-Sleep -Seconds 2

  Write-Output (Eval-Js 'location.href + " | " + document.body.innerText.slice(0, 120)')
  Assert-Ui ([bool](Eval-Js 'Boolean(document.querySelector(''[aria-label*="Lanka Electro Mart"]''))')) 'Lanka Electro Mart card should render.'
  Eval-Js 'document.querySelector(''[aria-label*="Lanka Electro Mart"]'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 500
  Eval-Js 'document.querySelector(''.service-detail__chat-link'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 300
  Assert-Ui ([bool](Eval-Js 'Boolean(document.querySelector(''[role="dialog"]''))')) 'Explore should open the profile modal.'
  Assert-Ui (-not [bool](Eval-Js 'document.querySelector(''#visitor-update-consent'').checked')) 'Update consent should start unchecked.'

  Eval-Js 'document.querySelector(''.profile-form__submit'').click(); true' | Out-Null
  Assert-Ui ((Eval-Js 'document.querySelectorAll(''.profile-form__error'').length') -eq 2) 'Blank form should show both required-field errors.'

  Eval-Js @'
(() => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
const name = document.querySelector('#visitor-name'); set.call(name, 'Nimal Perera'); name.dispatchEvent(new Event('input', {bubbles:true}));
const email = document.querySelector('#visitor-email'); set.call(email, 'invalid-email'); email.dispatchEvent(new Event('input', {bubbles:true}));
document.querySelector('.profile-form__submit').click(); return true; })()
'@ | Out-Null
  Assert-Ui ([bool](Eval-Js 'document.querySelector(''#visitor-email-error'').textContent.includes(''valid email'')')) 'Malformed email should be rejected.'

  Eval-Js @'
(() => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
const email = document.querySelector('#visitor-email'); set.call(email, 'nimal@example.com'); email.dispatchEvent(new Event('input', {bubbles:true}));
document.querySelector('.profile-form__submit').click(); return true; })()
'@ | Out-Null
  Start-Sleep -Milliseconds 500
  Assert-Ui ([bool](Eval-Js 'Boolean(document.querySelector(''.service-chat-panel''))')) 'Valid profile should open chat.'
  Assert-Ui ([bool](Eval-Js 'document.querySelector(''.message-bubble--agent p'').textContent.startsWith(''Hi Nimal,'' )')) 'Welcome should use the visitor first name.'
  Assert-Ui ([bool](Eval-Js 'JSON.parse(localStorage.getItem(''gro4ce.visitor-profile.v1'')).email === ''nimal@example.com''')) 'Profile should persist in localStorage.'

  Send-Cdp 'Page.reload' | Out-Null
  Start-Sleep -Seconds 2
  Eval-Js 'document.querySelector(''[aria-label*="Lanka Electro Mart"]'').click(); true' | Out-Null
  Eval-Js 'document.querySelector(''.service-detail__chat-link'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 200
  Assert-Ui ([bool](Eval-Js 'document.querySelector(''#visitor-name'').value === ''Nimal Perera'' && document.querySelector(''#visitor-email'').value === ''nimal@example.com''')) 'Returning visit should prefill the saved profile.'
  Assert-Ui (-not [bool](Eval-Js 'document.querySelector(''#visitor-update-consent'').checked')) 'Returning visit should not reuse update consent.'
  Eval-Js 'document.querySelector(''.profile-form__submit'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 250

  Eval-Js 'document.querySelector(''.chat-profile-actions button'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 200
  Eval-Js @'
(() => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
const name = document.querySelector('#visitor-name'); set.call(name, 'Nimali Perera'); name.dispatchEvent(new Event('input', {bubbles:true}));
document.querySelector('.profile-form__submit').click(); return true; })()
'@ | Out-Null
  Start-Sleep -Milliseconds 300
  Assert-Ui ([bool](Eval-Js 'JSON.parse(localStorage.getItem(''gro4ce.visitor-profile.v1'')).name === ''Nimali Perera''')) 'Editing should update the saved profile.'

  Eval-Js 'document.querySelectorAll(''.chat-profile-actions button'')[1].click(); true' | Out-Null
  Start-Sleep -Milliseconds 250
  Assert-Ui ([bool](Eval-Js 'localStorage.getItem(''gro4ce.visitor-profile.v1'') === null')) 'Clear should remove the saved profile.'
  Assert-Ui (-not [bool](Eval-Js 'Boolean(document.querySelector(''.service-chat-panel''))')) 'Clear should close the personalized chat.'

  Send-Cdp 'Emulation.setDeviceMetricsOverride' @{ width = 390; height = 844; deviceScaleFactor = 1; mobile = $true } | Out-Null
  Eval-Js 'document.querySelector(''.service-detail__chat-link'').click(); true' | Out-Null
  Start-Sleep -Milliseconds 250
  Assert-Ui ([bool](Eval-Js 'document.querySelector(''.profile-modal'').getBoundingClientRect().width <= innerWidth && document.documentElement.scrollWidth <= innerWidth')) 'Modal should fit a 390px mobile viewport.'

  [pscustomobject]@{
    modal = 'passed'
    invalidEmail = 'passed'
    consentDefaultUnchecked = 'passed'
    persistence = 'passed'
    returningVisit = 'passed'
    edit = 'passed'
    clear = 'passed'
    personalizedWelcome = 'passed'
    mobileViewport = 'passed'
  } | ConvertTo-Json
}
finally {
  if ($socket) { $socket.Dispose() }
  if ($chromeProcess -and -not $chromeProcess.HasExited) {
    Stop-Process -Id $chromeProcess.Id -Force
    Wait-Process -Id $chromeProcess.Id -ErrorAction SilentlyContinue
  }
  Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine.Contains($profileDir) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Milliseconds 500
  $resolvedProfile = [System.IO.Path]::GetFullPath($profileDir)
  $resolvedTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  if ($resolvedProfile.StartsWith($resolvedTemp) -and (Test-Path -LiteralPath $resolvedProfile)) {
    Remove-Item -LiteralPath $resolvedProfile -Recurse -Force -ErrorAction SilentlyContinue
  }
}

// n8n Code Tool body. `query` is the tool's string input.
const raw = typeof query === 'string' ? query.trim() : query;
let input;
try {
  input = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (input && typeof input.input === 'string') input = JSON.parse(input.input);
} catch {
  input = null;
}
const text = typeof raw === 'string' ? raw : '';
const number = value => Number(String(value ?? '').replace(/,/g, ''));
const principal = number(input?.principal ?? text.match(/principal["':\s=]+([\d,.]+)/i)?.[1]);
const rateValue = input?.annual_rate ?? text.match(/(?:annual_rate|rate)["':\s=]+([\d.]+)/i)?.[1];
const annualRate = number(rateValue);
const months = number(input?.tenure_months ?? text.match(/(?:tenure_months|tenure|months)["':\s=]+(\d+)/i)?.[1]);
const rateType = String(input?.rate_type || 'flat').toLowerCase();
if (!Number.isFinite(principal) || principal <= 0 || rateValue == null ||
    !Number.isFinite(annualRate) || annualRate < 0 ||
    !Number.isInteger(months) || months <= 0 || !['flat', 'reducing'].includes(rateType)) {
  return JSON.stringify({status: 'error', message: 'Provide JSON with principal > 0, annual_rate >= 0, tenure_months as a positive integer, and rate_type as flat or reducing. Do not estimate from an error.'});
}
const monthlyRate = annualRate / 1200;
const monthly = rateType === 'flat'
  ? principal * (1 + annualRate / 100 * months / 12) / months
  : annualRate === 0 ? principal / months
    : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
const round = value => Math.round((value + Number.EPSILON) * 100) / 100;
return JSON.stringify({
  status: 'success', currency: 'LKR', rate_type: rateType,
  facility_amount: principal, annual_rate: annualRate, tenure_months: months,
  monthly_installment: round(monthly), total_interest: round(monthly * months - principal),
  total_payable: round(monthly * months),
  note: 'Illustrative estimate excluding fees and insurance. Actual terms require lender confirmation.'
});

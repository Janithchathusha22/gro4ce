export const PROFILE_STORAGE_KEY = "gro4ce.visitor-profile.v1";

const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeProfile(profile = {}) {
  return {
    name: String(profile.name ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, NAME_MAX_LENGTH),
    email: String(profile.email ?? "")
      .trim()
      .toLowerCase()
      .slice(0, EMAIL_MAX_LENGTH),
  };
}

export function validateProfile(profile) {
  const normalized = normalizeProfile(profile);
  const errors = {};

  if (!normalized.name) {
    errors.name = "Please enter your name.";
  } else if (normalized.name.length < 2) {
    errors.name = "Please enter at least 2 characters.";
  }

  if (!normalized.email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  return { profile: normalized, errors, isValid: Object.keys(errors).length === 0 };
}

export function getFirstName(name) {
  return normalizeProfile({ name }).name.split(" ")[0] || "there";
}

export function loadVisitorProfile(storage = globalThis.localStorage) {
  if (!storage) return null;

  try {
    const saved = JSON.parse(storage.getItem(PROFILE_STORAGE_KEY));
    const result = validateProfile(saved);
    return result.isValid ? result.profile : null;
  } catch {
    return null;
  }
}

export function saveVisitorProfile(profile, storage = globalThis.localStorage) {
  if (!storage) return false;

  const result = validateProfile(profile);
  if (!result.isValid) return false;

  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(result.profile));
    return true;
  } catch {
    return false;
  }
}

export function clearVisitorProfile(storage = globalThis.localStorage) {
  if (!storage) return false;

  try {
    storage.removeItem(PROFILE_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createWebhookPayload({ message, sessionId, profile, updateConsent }) {
  const validation = validateProfile(profile);

  if (!validation.isValid) {
    throw new Error("A valid visitor profile is required before sending a chat message.");
  }

  return {
    channel: "website",
    session_id: sessionId,
    message,
    visitor_name: validation.profile.name,
    visitor_email: validation.profile.email,
    update_consent: Boolean(updateConsent),
  };
}

export function createWebhookRequest(webhooks, type, payload) {
  const webhookUrl = Object.prototype.hasOwnProperty.call(webhooks, type)
    ? webhooks[type]
    : "";

  if (!webhookUrl) throw new Error(`Unknown AI type: ${type}`);

  return {
    url: webhookUrl,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createWebhookPayload(payload)),
    },
  };
}

export function createPersonalizedWelcome(welcomeMessage, name) {
  const firstName = getFirstName(name);
  const message = String(welcomeMessage ?? "").trim();

  if (!message) return `Hi ${firstName}, how can I help today?`;
  if (/^hi\s*,/i.test(message)) return message.replace(/^hi\s*,/i, `Hi ${firstName},`);

  return `Hi ${firstName}, ${message.charAt(0).toLowerCase()}${message.slice(1)}`;
}

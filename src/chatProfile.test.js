import assert from "node:assert/strict";
import test from "node:test";
import {
  PROFILE_STORAGE_KEY,
  clearVisitorProfile,
  createPersonalizedWelcome,
  createWebhookRequest,
  loadVisitorProfile,
  saveVisitorProfile,
  validateProfile,
} from "./chatProfile.js";

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test("profile validation rejects missing fields and malformed email addresses", () => {
  assert.deepEqual(validateProfile({ name: "", email: "wrong" }).errors, {
    name: "Please enter your name.",
    email: "Enter a valid email address, such as name@example.com.",
  });
  assert.equal(validateProfile({ name: "Nimal Perera", email: "nimal@example.com" }).isValid, true);
});

test("profile can be saved, edited, reloaded, and cleared", () => {
  const storage = new MemoryStorage();

  assert.equal(saveVisitorProfile({ name: "  Nimal   Perera ", email: "NIMAL@EXAMPLE.COM" }, storage), true);
  assert.deepEqual(loadVisitorProfile(storage), { name: "Nimal Perera", email: "nimal@example.com" });

  assert.equal(saveVisitorProfile({ name: "Nimali Perera", email: "nimali@example.com" }, storage), true);
  assert.deepEqual(loadVisitorProfile(storage), { name: "Nimali Perera", email: "nimali@example.com" });

  assert.equal(clearVisitorProfile(storage), true);
  assert.equal(storage.getItem(PROFILE_STORAGE_KEY), null);
  assert.equal(loadVisitorProfile(storage), null);
});

test("webhook request targets only the selected service and includes the profile contract", () => {
  const webhooks = {
    lankaElectroMart: "https://example.test/electro",
    aiAcademy: "https://example.test/academy",
  };
  const request = createWebhookRequest(webhooks, "lankaElectroMart", {
    message: "Do you have SKU TV-01?",
    sessionId: "session-123",
    profile: { name: "Nimal Perera", email: "nimal@example.com" },
    updateConsent: true,
  });

  assert.equal(request.url, webhooks.lankaElectroMart);
  assert.notEqual(request.url, webhooks.aiAcademy);
  assert.deepEqual(JSON.parse(request.options.body), {
    channel: "website",
    session_id: "session-123",
    message: "Do you have SKU TV-01?",
    visitor_name: "Nimal Perera",
    visitor_email: "nimal@example.com",
    update_consent: true,
  });
});

test("update consent is explicit and false unless selected for that chat", () => {
  const request = createWebhookRequest({ service: "https://example.test/chat" }, "service", {
    message: "Hello",
    sessionId: "session-456",
    profile: { name: "Kamal Silva", email: "kamal@example.com" },
    updateConsent: false,
  });

  assert.equal(JSON.parse(request.options.body).update_consent, false);
});

test("Academy receives its confirmed top-level name field without changing other services", () => {
  const webhooks = {
    aiAcademy: "https://example.test/academy",
    personalBranding: "https://example.test/personal-branding",
  };
  const payload = {
    message: "I need a Physics tutor",
    sessionId: "student-session",
    profile: { name: "Audit Nimal", email: "audit.nimal@example.invalid" },
    updateConsent: false,
  };

  const academy = JSON.parse(createWebhookRequest(webhooks, "aiAcademy", payload).options.body);
  const branding = JSON.parse(createWebhookRequest(webhooks, "personalBranding", payload).options.body);

  assert.equal(academy.name, "Audit Nimal");
  assert.equal(academy.visitor_name, "Audit Nimal");
  assert.equal(Object.hasOwn(branding, "name"), false);
});

test("welcome uses the first name naturally once", () => {
  assert.equal(
    createPersonalizedWelcome("Welcome to Lanka Electro Mart. What product can I help you find today?", "Nimal Perera"),
    "Hi Nimal, welcome to Lanka Electro Mart. What product can I help you find today?",
  );
  assert.equal(
    createPersonalizedWelcome("Hi, I am Senela's digital partner.", "Senela Jayasuriya"),
    "Hi Senela, I am Senela's digital partner.",
  );
});

test("unknown services cannot inherit or fall through to another webhook", () => {
  assert.throws(
    () => createWebhookRequest({ known: "https://example.test/chat" }, "missing", {
      message: "Hello",
      sessionId: "session-789",
      profile: { name: "Test User", email: "test@example.com" },
      updateConsent: false,
    }),
    /Unknown AI type/,
  );
});

import { useEffect, useRef, useState } from "react";
import legalPartnersImage from "../assets/_Lanka legal partners.png";
import academyImage from "../assets/accadamic-optimized.jpg";
import electroMartImage from "../assets/elector_mart.PNG";
import salonImage from "../assets/salon.png";
import sentinelInsuranceImage from "../assets/Sentinel_Insurance.png";
import meridianFinanceImage from "../assets/Meridian_Finance.png";
import carloopImage from "../assets/carloop.jpg";
import ceylonKulubaduImage from "../assets/Ceylon Kulubadu.png";
import personalBrandingImage from "../assets/Personal_Brading AI.jpg";
import academyProfile from "../assets/AL_Academy_SL_Company_Profile.docx.pdf";
import electroMartProfile from "../assets/Lanka_Electro_Mart_Company_Profile.docx.pdf";
import legalPartnersProfile from "../assets/Lanka_Legal_Partners_Company_Profile.docx.pdf";
import salonProfile from "../assets/Lanka_Glow_Salon_Company_Profile.docx.pdf";
import "./Gro4ceHero.css";

const serviceWebhooks = {
  carloop:
    import.meta.env.VITE_CARLOOP_WEBHOOK_URL ||
    "http://localhost:5678/webhook/carloop-chat",
  ceylonKulubadu:
    import.meta.env.VITE_CEYLON_KULUBADU_WEBHOOK_URL ||
    "http://localhost:5678/webhook/ceylon-chat",
  personalBranding:
    import.meta.env.VITE_PERSONAL_BRANDING_WEBHOOK_URL ||
    "http://localhost:5678/webhook/personal-branding-chat-v6",
};

const primaryServices = [
  {
    id: "lanka-legal-partners",
    name: "Lanka legal partners",
    category: "Legal services",
    image: legalPartnersImage,
    imageWidth: 2000,
    imageHeight: 2000,
    imageFit: "legal",
    profile: legalPartnersProfile,
    downloadName: "Lanka_Legal_Partners_Company_Profile.pdf",
  },
  {
    id: "al-academy-tutor",
    name: "AL_Academy_SL_Tutor",
    category: "Education platform",
    image: academyImage,
    imageWidth: 1200,
    imageHeight: 800,
    imageFit: "cover",
    profile: academyProfile,
    downloadName: "AL_Academy_SL_Company_Profile.pdf",
  },
  {
    id: "lanka-electro-mart",
    name: "Lanka Electro Mart",
    category: "Retail services",
    image: electroMartImage,
    imageWidth: 319,
    imageHeight: 208,
    imageFit: "contain",
    profile: electroMartProfile,
    downloadName: "Lanka_Electro_Mart_Company_Profile.pdf",
  },
];

const services = [
  ...primaryServices,
  {
    id: "lanka-glow-salon",
    name: "LANKA GLOW SALON",
    category: "Hair · beauty · wellness",
    image: salonImage,
    imageWidth: 1717,
    imageHeight: 916,
    imageFit: "salon",
    profile: salonProfile,
    downloadName: "Lanka_Glow_Salon_Company_Profile.pdf",
  },
  {
    id: "sentinel-insurance",
    name: "Sentinel Insurance",
    category: "Insurance services",
    image: sentinelInsuranceImage,
    imageWidth: 1024,
    imageHeight: 1024,
    imageFit: "contain",
    profile: sentinelInsuranceImage,
    downloadName: "Sentinel_Insurance.png",
  },
  {
    id: "meridian-finance",
    name: "Meridian Finance",
    category: "Financial services",
    image: meridianFinanceImage,
    imageWidth: 1024,
    imageHeight: 1024,
    imageFit: "contain",
    profile: meridianFinanceImage,
    downloadName: "Meridian_Finance.png",
  },
  {
    id: "carloop",
    name: "Carloop",
    category: "Automotive assistant",
    image: carloopImage,
    imageWidth: 2752,
    imageHeight: 1536,
    imageFit: "cover",
    chat: true,
    webhook: serviceWebhooks.carloop,
    welcomeMessage: "Welcome to Carloop. How can I help you today?",
  },
  {
    id: "ceylon-kulubadu",
    name: "Ceylon Kulubadu",
    category: "Culinary assistant",
    image: ceylonKulubaduImage,
    imageWidth: 1536,
    imageHeight: 1024,
    imageFit: "cover",
    chat: true,
    webhook: serviceWebhooks.ceylonKulubadu,
    welcomeMessage: "Welcome to Ceylon Kulubadu. How can I help you today?",
  },
  {
    id: "personal-branding-ai",
    name: "Personal Branding AI",
    category: "Branding assistant",
    image: personalBrandingImage,
    imageWidth: 2752,
    imageHeight: 1536,
    imageFit: "cover",
    chat: true,
    webhook: serviceWebhooks.personalBranding,
    welcomeMessage: "Welcome to Personal Branding AI. How can I help you today?",
  },
];

const particles = [
  { x: "8%", y: "18%", size: "3px", delay: "-2s", duration: "12s" },
  { x: "17%", y: "72%", size: "2px", delay: "-7s", duration: "14s" },
  { x: "27%", y: "33%", size: "2px", delay: "-4s", duration: "10s" },
  { x: "73%", y: "20%", size: "3px", delay: "-9s", duration: "15s" },
  { x: "84%", y: "67%", size: "2px", delay: "-5s", duration: "11s" },
  { x: "92%", y: "38%", size: "2px", delay: "-1s", duration: "13s" },
];

function BrandMark() {
  return (
    <span className="gro4ce-brand" aria-label="Gro4ce">
      <strong className="gro4ce-brand__lead" aria-hidden="true">
        Gro
      </strong>
      <span className="gro4ce-brand__four" aria-hidden="true">
        4
      </span>
      <strong className="gro4ce-brand__trail" aria-hidden="true">
        ce
      </strong>
    </span>
  );
}

function BackgroundEffects() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <div className="hero-grid" />
      <div className="hero-glow hero-glow--left" />
      <div className="hero-glow hero-glow--right" />
      <div className="particle-field">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              "--particle-x": particle.x,
              "--particle-y": particle.y,
              "--particle-size": particle.size,
              "--particle-delay": particle.delay,
              "--particle-duration": particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v10M6.5 9.5 10 13l3.5-3.5M4 16h12" />
    </svg>
  );
}

function ContinueIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function ActivityMeter() {
  return (
    <span className="service-card__activity" aria-label="Live activity">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function createSessionReference(message) {
  let hash = 2166136261;

  for (const character of message) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return `G4C-${String((hash >>> 0) % 10000).padStart(4, "0")}`;
}

function AgentAvatar() {
  return (
    <span className="agent-avatar" aria-hidden="true">
      <svg viewBox="0 0 36 36">
        <circle cx="18" cy="14" r="5.25" />
        <path d="M9 16v-1.1C9 9.4 13 5 18 5s9 4.4 9 9.9V20" />
        <path d="M9 16.5h1.7v7H9.8A2.8 2.8 0 0 1 7 20.7v-1.4a2.8 2.8 0 0 1 2-2.8Z" />
        <path d="M27 16.5h-1.7v7h.9a2.8 2.8 0 0 0 2.8-2.8v-1.4a2.8 2.8 0 0 0-2-2.8Z" />
        <path d="M27 23c-.7 2.7-2.8 4.1-6.3 4.1h-1.4" />
        <circle cx="18.2" cy="27.1" r="1.1" />
        <path d="M11.5 31c1-4 3.3-6 6.5-6s5.5 2 6.5 6" />
      </svg>
      <i />
    </span>
  );
}

function ThinkingIndicator() {
  return (
    <span className="thinking-indicator">
      <span>Thinking</span>
      <i />
      <i />
      <i />
    </span>
  );
}

function getWebhookReply(payload) {
  const data = Array.isArray(payload) ? payload[0] : payload;

  if (typeof data === "string") return data;

  return (
    data?.output ??
    data?.text ??
    data?.message ??
    data?.response ??
    data?.answer ??
    "Your request was received, but the assistant returned an empty response."
  );
}

function ServiceChatPage({ service, onBack }) {
  const titleRef = useRef(null);
  const streamRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "welcome", role: "agent", text: service.welcomeMessage },
  ]);
  const [isSending, setIsSending] = useState(false);
  const sessionId = useRef(
    globalThis.crypto?.randomUUID?.() ?? `${service.id}-${Date.now()}`,
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    streamRef.current?.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const chatInput = input.trim();

    if (!chatInput || isSending) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text: chatInput },
    ]);
    setIsSending(true);

    try {
      if (!service.webhook) {
        throw new Error("Production webhook URL is not configured.");
      }

      const response = await fetch(service.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: sessionId.current,
          chatInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-agent`,
          role: "agent",
          text: getWebhookReply(payload),
        },
      ]);
    } catch (error) {
      const errorMessage = service.webhook
        ? `I couldn't reach the ${service.name} assistant. Please check that its workflow is active and try again.`
        : `${service.name} chat is not configured for this deployment yet.`;

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "agent",
          text: errorMessage,
          error: true,
        },
      ]);
      console.error(`${service.name} webhook error:`, error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="contact-page">
      <BackgroundEffects />

      <nav className="contact-page__nav" aria-label={`${service.name} chat navigation`}>
        <button type="button" onClick={onBack} className="contact-page__back">
          <span aria-hidden="true">←</span> Back to services
        </button>
        <span className="contact-page__brand">
          <BrandMark />
        </span>
        <span className="contact-page__secure">
          <i aria-hidden="true" /> {service.webhook ? "Connected" : "Setup required"}
        </span>
      </nav>

      <section className="conversation-panel" aria-labelledby="service-chat-title">
        <header className="conversation-panel__header">
          <div className="conversation-agent">
            <AgentAvatar />
            <span>
              <small>{service.name}</small>
              <h1 id="service-chat-title" ref={titleRef} tabIndex="-1">
                AI Assistant
              </h1>
            </span>
          </div>
          <div className="conversation-panel__status">
            <i aria-hidden="true" /> {service.webhook ? "Online" : "Configuration required"}
          </div>
        </header>

        <div className="conversation-stream" ref={streamRef}>
          <div className="conversation-date" aria-hidden="true">
            <span>Conversation opened</span>
          </div>

          {messages.map((message) => (
            <div key={message.id} className={`message-row message-row--${message.role}`}>
              {message.role === "agent" && <AgentAvatar />}
              <div
                className={`message-bubble message-bubble--${message.role}${message.error ? " is-error" : ""}`}
              >
                <span className="message-bubble__label">
                  {message.role === "user" ? "You" : service.name}
                </span>
                <p>{message.text}</p>
                <small>Just now</small>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="message-row message-row--agent">
              <AgentAvatar />
              <div className="message-bubble message-bubble--agent" role="status">
                <span className="message-bubble__label">{service.name}</span>
                <ThinkingIndicator />
              </div>
            </div>
          )}
        </div>

        <form className="chat-composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="service-chat-input">
            Message {service.name}
          </label>
          <input
            id="service-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isSending}
          />
          <button type="submit" disabled={!input.trim() || isSending}>
            Send <ContinueIcon />
          </button>
        </form>
      </section>
    </main>
  );
}

function ContactPage({ initialMessage, onBack }) {
  const titleRef = useRef(null);
  const sessionReference = createSessionReference(initialMessage);
  const [agentStage, setAgentStage] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "responded"
      : "thinking",
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (agentStage === "responded") {
      return undefined;
    }

    const replyTimer = window.setTimeout(() => {
      setAgentStage("responded");
    }, 1800);

    return () => window.clearTimeout(replyTimer);
  }, [agentStage]);

  return (
    <main className="contact-page">
      <BackgroundEffects />

      <nav className="contact-page__nav" aria-label="Contact page navigation">
        <button type="button" onClick={onBack} className="contact-page__back">
          <span aria-hidden="true">←</span>
          Back to services
        </button>
        <span className="contact-page__brand">
          <BrandMark />
        </span>
        <span className="contact-page__secure">
          <i aria-hidden="true" /> Local session
        </span>
      </nav>

      <section className="conversation-panel" aria-labelledby="contact-page-title">
        <header className="conversation-panel__header">
          <div className="conversation-agent">
            <AgentAvatar />
            <span>
              <small>Gro4ce support</small>
              <h1 id="contact-page-title" ref={titleRef} tabIndex="-1">
                AI Agent
              </h1>
            </span>
          </div>
          <div className="conversation-panel__status">
            <i aria-hidden="true" /> Automated preview
          </div>
        </header>

        <div className="conversation-stream">
          <div className="conversation-date" aria-hidden="true">
            <span>Conversation opened</span>
          </div>

          <div className="message-row message-row--user">
            <div className="message-bubble message-bubble--user">
              <span className="message-bubble__label">You</span>
              <p>{initialMessage}</p>
              <small>Entered now</small>
            </div>
          </div>

          <div className="message-row message-row--agent">
            <AgentAvatar />
            <div
              className={`message-bubble message-bubble--agent is-${agentStage}`}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="message-bubble__label">Gro4ce support</span>
              {agentStage === "thinking" ? (
                <ThinkingIndicator />
              ) : (
                <div className="agent-confirmation">
                  <span className="agent-confirmation__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m7 12 3 3 7-7" />
                    </svg>
                  </span>
                  <div className="agent-confirmation__copy">
                    <span className="agent-confirmation__status">Request acknowledged</span>
                    <strong>Thank you for contacting Gro4ce.</strong>
                    <p>
                      Your message is available in this page session. Online delivery is not
                      connected yet.
                    </p>
                    <span className="agent-confirmation__meta">
                      <i aria-hidden="true" /> Session {sessionReference}
                      <span aria-hidden="true">•</span> Just now
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="conversation-panel__footer">
          <span>
            <i aria-hidden="true" /> Local preview · no data transmitted
          </span>
          <button type="button" onClick={onBack}>
            Start again <span aria-hidden="true">↗</span>
          </button>
        </footer>
      </section>
    </main>
  );
}

function ServiceCard({ service, index, onProcess }) {
  const opensChat = Boolean(service.chat);
  const actionContent = (
    <>
      <span>Process</span>
      <span className="service-card__action-icon">
        {opensChat ? <ContinueIcon /> : <DownloadIcon />}
      </span>
    </>
  );

  return (
    <li
      className={`service-card service-card--${service.imageFit}`}
      style={{ "--card-index": index }}
    >
      <article>
        <div className={`service-card__media service-card__media--${service.imageFit}`}>
          <img
            src={service.image}
            alt={`${service.name} service`}
            width={service.imageWidth}
            height={service.imageHeight}
            loading={index < 3 ? "eager" : "lazy"}
            decoding={index < 3 ? "sync" : "async"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
          <span className="service-card__number" aria-hidden="true">
            0{index + 1}
          </span>
          <span className="service-card__availability">
            <i aria-hidden="true" />
            Available
          </span>
        </div>

        <div className="service-card__body">
          <div className="service-card__category-row">
            <span className="service-card__category">{service.category}</span>
            <ActivityMeter />
          </div>
          <h3>{service.name}</h3>

          {opensChat ? (
            <button
              type="button"
              className="service-card__action"
              onClick={() => onProcess?.(service)}
              aria-label={`Open ${service.name} chat`}
            >
              {actionContent}
            </button>
          ) : (
            <a
              className="service-card__action"
              href={service.profile}
              download={service.downloadName}
              onClick={() => onProcess?.(service)}
              aria-label={`Download ${service.name} company profile`}
            >
              {actionContent}
            </a>
          )}
        </div>
      </article>
    </li>
  );
}

function CommandPanel({ onProcess }) {
  return (
    <div className="command-panel-wrap">
      <div className="command-panel">
        <header className="command-panel__header">
          <div className="command-panel__identity">
            <span className="command-panel__kicker">AI services command center</span>
            <h2>Connected operations</h2>
          </div>

          <div className="system-status" aria-label="Nine services available">
            <span className="system-status__dot" aria-hidden="true" />
            <span>
              <small>Service status</small>
              09 Available
            </span>
          </div>
        </header>

        <div className="command-panel__meta" aria-hidden="true">
          <span>Select a service to continue</span>
          <span>Secure connection</span>
        </div>

        <ul className="service-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onProcess={onProcess}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Gro4ceHero({ onProcess, initialContactRequest = null }) {
  const [contactRequest, setContactRequest] = useState(initialContactRequest);
  const [activeService, setActiveService] = useState(null);

  const handleProcess = (service) => {
    if (service.chat) {
      setActiveService(service);
    }

    onProcess?.(service);
  };

  if (activeService) {
    return <ServiceChatPage service={activeService} onBack={() => setActiveService(null)} />;
  }

  if (contactRequest !== null) {
    return (
      <ContactPage
        initialMessage={contactRequest}
        onBack={() => setContactRequest(null)}
      />
    );
  }

  return (
    <main className="gro4ce-page">
      <section className="gro4ce-hero" aria-label="Gro4ce services">
        <CommandPanel onProcess={handleProcess} />

        <div className="hero-coordinate hero-coordinate--left" aria-hidden="true">
          06°56′N / 79°51′E
        </div>
        <div className="hero-coordinate hero-coordinate--right" aria-hidden="true">
          GRO4CE / CORE
        </div>
      </section>
    </main>
  );
}

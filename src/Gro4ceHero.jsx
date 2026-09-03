import { useEffect, useRef, useState } from "react";
import image01 from "../assets/1.jpg";
import image02 from "../assets/2.jpg";
import image03 from "../assets/3.jpg";
import image04 from "../assets/4.jpg";
import image05 from "../assets/5.jpg";
import image06 from "../assets/6.jpg";
import image07 from "../assets/7.jpg";
import image08 from "../assets/8.jpg";
import image09 from "../assets/9.jpg";
import image10 from "../assets/10.jpg";
import image11 from "../assets/11.jpg";
import "./Gro4ceHero.css";

const WEBHOOKS = {
  carloop:
    import.meta.env.VITE_CARLOOP_WEBHOOK ||
    "http://localhost:5678/webhook/carloop-chat",
  ceylonKulubadu:
    import.meta.env.VITE_CEYLON_WEBHOOK ||
    "http://localhost:5678/webhook/ceylon-chat",
  personalBranding:
    import.meta.env.VITE_PERSONAL_BRANDING_WEBHOOK ||
    "http://localhost:5678/webhook/personal-branding-chat-v6",
};

const services = [
  {
    id: "lanka-electro-mart",
    name: "Lanka Electro Mart",
    category: "Electronics retail",
    image: image01,
    accent: "#ff9d2e",
    summary: "Find the right electronics, compare models, check pricing, and locate nearby stock.",
    description: `Lanka Electro Mart is an electronics retail business offering a wide range of electrical and electronic items, from home appliances and televisions to mobile phones, kitchen equipment, and everyday gadgets. Instead of browsing an entire catalogue yourself, describe what you need to the AI agent. It can recommend suitable options for your requirement and budget, explain model differences, provide current pricing, identify the nearest branch with stock, and help prepare formal quotations for comparisons or bulk orders.`,
    capabilities: ["Product recommendations", "Model and price comparisons", "Branch stock checks", "Formal quotations"],
  },
  {
    id: "ai-academy-sl",
    name: "AI Academy SL",
    category: "Education platform",
    image: image02,
    accent: "#7eb5ff",
    summary: "Match A/L students with the right tutor, class format, schedule, and location.",
    description: `AI Academy SL is an island-wide Advanced Level tuition institute covering Science, Commerce, Arts, and Technology streams through branches in 56 main towns across Sri Lanka. The AI agent can find tutors by subject, location, class format, and preferred tutor profile, then explain their qualifications, experience, teaching style, schedules, and monthly fees. It can also clarify whether a class is physical, online, or hybrid and guide students through registration and weekly availability.`,
    capabilities: ["Tutor matching", "Schedules and monthly fees", "Online or physical class guidance", "Registration support"],
  },
  {
    id: "carloop",
    name: "CarLoop",
    category: "Vehicle marketplace",
    image: image03,
    accent: "#64e6ae",
    summary: "Search multi-brand vehicle inventory and compare the best options for your budget.",
    description: `CarLoop is a modern, multi-brand vehicle sales chain with showrooms across major Sri Lankan cities, offering hatchbacks, sedans, SUVs, vans, pickups, luxury vehicles, and limited editions. Tell the AI agent your budget, preferred brand, or ideal vehicle type and it can search inventory, compare matches by year, mileage, condition, fuel type, and price, identify the showroom holding each vehicle, share opening hours, connect you with a sales executive, and help arrange a test drive.`,
    capabilities: ["Inventory search", "Side-by-side vehicle comparisons", "Showroom and test-drive support", "New, used, and reconditioned guidance"],
    aiType: "carloop",
    welcomeMessage: "Welcome to CarLoop. Tell me what kind of vehicle you are looking for.",
  },
  {
    id: "ceylon-kulubadu",
    name: "Ceylon Kulubadu",
    category: "Wholesale spice trading",
    image: image04,
    accent: "#47d9ef",
    summary: "Plan wholesale spice orders with live pricing, stock, packaging, and sourcing guidance.",
    description: `Ceylon Kulubadu supplies authentic Sri Lankan spices including true Ceylon cinnamon, pepper, cardamom, cloves, curry powders, and essential oils sourced from the island's spice-growing regions. Designed for wholesale buyers with a minimum purchase of 5kg per product, its AI agent can explain price tiers, packaging options, current stock, collection centres, and the documentation needed to assemble local or export-ready multi-item orders.`,
    capabilities: ["Bulk price tiers", "Packaging and stock checks", "Collection-centre guidance", "Local and export order support"],
    aiType: "ceylonKulubadu",
    welcomeMessage: "Welcome to Ceylon Kulubadu. What spice or wholesale order can I help with?",
  },
  {
    id: "lanka-glow-salon",
    name: "Lanka Glow Salon",
    category: "Hair, beauty and wellness",
    image: image05,
    accent: "#ff5c45",
    summary: "Explore treatments, compare branch pricing, find specialists, and plan appointments.",
    description: `Lanka Glow Salon is a unisex hair and beauty salon chain operating across Sri Lanka's main cities. Its services include haircuts, colouring, hair treatments, bridal makeup, nail care, facials, eyelash and brow services, and spa treatments for adults and children. The AI agent can explain available services, provide indicative pricing, match customers with specialist stylists, compare standard, premium, and flagship locations, and guide appointment booking.`,
    capabilities: ["Service discovery", "Indicative treatment pricing", "Stylist matching", "Branch and appointment guidance"],
  },
  {
    id: "lanka-legal-partners",
    name: "Lanka Legal Partners",
    category: "Legal services",
    image: image06,
    accent: "#45bff2",
    summary: "Describe your legal matter and find the right lawyer, expertise, and consultation path.",
    description: `Lanka Legal Partners is a full-service law firm with more than one hundred lawyers practising across Sri Lanka. It covers corporate and commercial law, criminal defence, family law, property disputes, labour matters, and more. The AI agent can interpret a client's situation, match it with an appropriate lawyer by expertise, court experience, and seniority, explain qualifications and availability, and guide the client through consultation scheduling and fees.`,
    capabilities: ["Legal matter triage", "Lawyer matching", "Qualifications and availability", "Consultation scheduling"],
  },
  {
    id: "meridian-finance",
    name: "Meridian Finance PLC",
    category: "Finance and leasing",
    image: image07,
    accent: "#b596ff",
    summary: "Compare finance products, understand rates and documents, and estimate repayments.",
    description: `Meridian Finance PLC is a licensed leasing and finance company offering vehicle leasing, hire purchase, personal and business loans, gold loans, home mortgages, fixed deposits, and savings accounts through branches across Sri Lanka. Its AI agent can explain relevant products, interest rates, tenure, down payments, processing fees, and application documents, estimate monthly instalments, compare leasing with hire purchase, and direct customers to an appropriate branch.`,
    capabilities: ["Product comparison", "Rates, tenure, and fee guidance", "Instalment estimates", "Application and branch support"],
  },
  {
    id: "sentinel-insurance",
    name: "Sentinel Insurance PLC",
    category: "Insurance services",
    image: image08,
    accent: "#8ce53f",
    summary: "Understand cover, exclusions, premiums, claims, and the policy that fits your needs.",
    description: `Sentinel Insurance PLC provides life and general insurance, including term and whole-life cover, health and medical insurance, motor insurance, home and business property cover, travel insurance, and specialised policies for businesses and farmers. The AI agent can recommend suitable cover, explain inclusions and exclusions, outline indicative premiums and coverage, direct customers to the correct claims desk, and identify the best branch for further support.`,
    capabilities: ["Policy recommendations", "Cover and exclusion explanations", "Premium guidance", "Claims and branch direction"],
  },
  {
    id: "teen-master-of-business",
    name: "Teen Master of Business",
    category: "Teen Academy",
    image: image09,
    accent: "#ffc934",
    summary: "A practical, year-long business programme for students aged 13–18.",
    description: `Teen Master of Business is Sri Lanka's first school-embedded, credit-bearing business education programme built for secondary school students aged 13–18. Across a structured year based on Learn It, Apply It, and Live It, students complete 12 modules spanning entrepreneurship, market research, business models, financial literacy, marketing, leadership, digital business and AI, ethics, pitching, design thinking, and business law before launching a real micro-enterprise and pitching to business judges.`,
    capabilities: ["Twelve practical business modules", "Project-based learning", "Live micro-enterprise capstone", "Student and school enrolment guidance"],
  },
  {
    id: "senela-jayasuriya",
    name: "Senela Jayasuriya",
    category: "Leadership and coaching",
    image: image10,
    accent: "#f0ec54",
    summary: "Explore Senela's work across leadership, innovation, DEI, and heart-centred coaching.",
    description: `Senela Jayasuriya's work brings together leadership, innovation, diversity, equity and inclusion, and heart-centred coaching. This experience supports individuals, teams, and organisations seeking purposeful growth and practical transformation. The digital experience helps prospective collaborators understand her approach, explore speaking, training, workshop, and partnership opportunities, and identify the most relevant way to engage with her team.`,
    capabilities: ["Leadership development", "Innovation and DEI", "Heart-centred coaching", "Speaking and workshop enquiries"],
  },
  {
    id: "personal-branding-ai",
    name: "Personal Branding AI",
    category: "Senela's digital partner",
    image: image11,
    accent: "#ff66bb",
    summary: "Chat with a warm digital partner built around Senela Jayasuriya's expertise and work.",
    description: `Personal Branding AI is Senela Jayasuriya's digital partner, designed as a natural extension of her expertise and purpose-driven style. Visitors can learn about her leadership and coaching approach, explore her perspective on innovation and DEI, understand how she works with people and organisations, and discuss potential collaborations such as speaking engagements, training programmes, workshops, and strategic partnerships before connecting with her team.`,
    capabilities: ["Expertise discovery", "Collaboration guidance", "Speaking and training enquiries", "Connection to Senela's team"],
    aiType: "personalBranding",
    welcomeMessage: "Hi, I am Senela's digital partner. How can I support what you are working toward?",
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
      <strong className="gro4ce-brand__lead" aria-hidden="true">Gro</strong>
      <span className="gro4ce-brand__four" aria-hidden="true">4</span>
      <strong className="gro4ce-brand__trail" aria-hidden="true">ce</strong>
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
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
    data?.reply ??
    data?.output ??
    data?.text ??
    data?.message ??
    data?.response ??
    data?.answer ??
    "Your request was received, but the assistant returned an empty response."
  );
}

async function sendToAI(type, message, sessionId) {
  const webhookUrl = WEBHOOKS[type];

  if (!webhookUrl) throw new Error(`Unknown AI type: ${type}`);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: "website", session_id: sessionId, message }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Webhook error:", { status: response.status, body });
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return getWebhookReply(await response.json());
}

function ServiceDetailPage({ service, onBack }) {
  const titleRef = useRef(null);
  const streamRef = useRef(null);
  const chatRef = useRef(null);
  const webhookUrl = service.aiType ? WEBHOOKS[service.aiType] : "";
  const isConnected = Boolean(webhookUrl);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "agent",
      text:
        service.welcomeMessage ??
        `The ${service.name} AI workspace is ready. Connect its n8n webhook to enable live answers.`,
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const sessionId = useRef(
    globalThis.crypto?.randomUUID?.() ?? `${service.id}-${Date.now()}`,
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const chatInput = input.trim();

    if (!chatInput || isSending || !isConnected) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text: chatInput },
    ]);
    setIsSending(true);

    try {
      const reply = await sendToAI(service.aiType, chatInput, sessionId.current);
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-agent`, role: "agent", text: reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "agent",
          text: `I couldn't reach the ${service.name} assistant. Check that its n8n workflow is published and try again.`,
          error: true,
        },
      ]);
      console.error(`${service.name} webhook error:`, error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="service-detail-page" style={{ "--service-accent": service.accent }}>
      <BackgroundEffects />

      <nav className="contact-page__nav service-detail__nav" aria-label="Service details navigation">
        <button type="button" onClick={onBack} className="contact-page__back">
          <span aria-hidden="true">←</span> Back to services
        </button>
        <span className="contact-page__brand"><BrandMark /></span>
        <span className="contact-page__secure">
          <i aria-hidden="true" /> Service profile
        </span>
      </nav>

      <section className="service-detail" aria-labelledby="service-detail-title">
        <div className="service-detail__visual">
          <img src={service.image} alt="" width="1280" height="720" />
          <span className="service-detail__index" aria-hidden="true">
            {String(services.findIndex((item) => item.id === service.id) + 1).padStart(2, "0")}
          </span>
          <span className="service-detail__visual-label">AI service profile</span>
        </div>

        <div className="service-detail__content">
          <span className="service-detail__eyebrow">{service.category}</span>
          <h1 id="service-detail-title" ref={titleRef} tabIndex="-1">{service.name}</h1>
          <p>{service.description}</p>

          <div className="service-detail__capabilities">
            <span>What the agent can help with</span>
            <ul>
              {service.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="service-detail__chat-link"
            onClick={() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Explore AI assistant <ArrowIcon />
          </button>
        </div>
      </section>

      <section
        ref={chatRef}
        className="conversation-panel service-chat-panel"
        aria-labelledby="service-chat-title"
      >
        <header className="conversation-panel__header">
          <div className="conversation-agent">
            <AgentAvatar />
            <span>
              <small>{service.name}</small>
              <h2 id="service-chat-title">AI Assistant</h2>
            </span>
          </div>
          <div className={`conversation-panel__status${isConnected ? "" : " is-pending"}`}>
            <i aria-hidden="true" /> {isConnected ? "Online" : "Ready for n8n"}
          </div>
        </header>

        {!isConnected && (
          <div className="chat-connection-note" role="status">
            <span>Connection pending</span>
            Add this agent's n8n webhook to activate live conversations.
          </div>
        )}

        <div className="conversation-stream" ref={streamRef}>
          <div className="conversation-date" aria-hidden="true">
            <span>Agent workspace</span>
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
          <label className="sr-only" htmlFor="service-chat-input">Message {service.name}</label>
          <input
            id="service-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connect the n8n webhook to start chatting"}
            autoComplete="off"
            disabled={!isConnected || isSending}
          />
          <button type="submit" disabled={!isConnected || !input.trim() || isSending}>
            Send <ArrowIcon />
          </button>
        </form>
      </section>
    </main>
  );
}

function ServiceCard({ service, index, onSelect }) {
  return (
    <li
      className="service-card"
      style={{ "--card-index": index, "--card-accent": service.accent }}
    >
      <article>
        <div className="service-card__media">
          <img
            src={service.image}
            alt=""
            width="1280"
            height="720"
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
          />
          <span className="service-card__number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="service-card__availability">
            <i aria-hidden="true" /> {service.aiType ? "Connected" : "AI ready"}
          </span>
        </div>

        <div className="service-card__body">
          <span className="service-card__category">{service.category}</span>
          <h3>{service.name}</h3>
          <p>{service.summary}</p>
          <button
            type="button"
            className="service-card__action"
            onClick={() => onSelect(service)}
            aria-label={`Get more information about ${service.name}`}
          >
            <span>Get more info</span>
            <span className="service-card__action-icon"><ArrowIcon /></span>
          </button>
        </div>
      </article>
    </li>
  );
}

function CommandPanel({ onSelect }) {
  return (
    <div className="command-panel-wrap">
      <div className="command-panel">
        <header className="command-panel__header">
          <div className="command-panel__identity">
            <span className="command-panel__kicker">AI services command center</span>
            <h2>Connected operations</h2>
          </div>
          <div className="system-status" aria-label="Eleven services available">
            <span className="system-status__dot" aria-hidden="true" />
            <span><small>Service status</small>11 Available</span>
          </div>
        </header>

        <div className="command-panel__meta" aria-hidden="true">
          <span>Select a service to discover more</span>
          <span>AI-ready ecosystem</span>
        </div>

        <ul className="service-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Gro4ceHero({ onProcess }) {
  const [activeService, setActiveService] = useState(null);

  const openService = (service) => {
    setActiveService(service);
    onProcess?.(service);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeService = () => {
    setActiveService(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeService) {
    return <ServiceDetailPage service={activeService} onBack={closeService} />;
  }

  return (
    <main className="gro4ce-page">
      <section className="gro4ce-hero" aria-label="Gro4ce services">
        <CommandPanel onSelect={openService} />
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

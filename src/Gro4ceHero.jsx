import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import image01 from "../assets/1.jpg";
import image02 from "../assets/2.jpg";
import image03 from "../assets/3.jpg";
import image04 from "../assets/4.jpg";
import image05 from "../assets/5.jpg";
import image06 from "../assets/6.jpg";
import image07 from "../assets/7.jpg";
import image08 from "../assets/8.jpg";
import image09 from "../assets/9.jpg";
import image11 from "../assets/11.jpg";
import {
  clearVisitorProfile,
  createPersonalizedWelcome,
  createWebhookRequest,
  loadVisitorProfile,
  saveVisitorProfile,
  validateProfile,
} from "./chatProfile";
import "./Gro4ceHero.css";
import "./ChatMessage.css";

const WEBHOOKS = {
  lankaElectroMart:
    import.meta.env.VITE_LANKA_ELECTRO_MART_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/38c36c82-4961-410d-b91a-5f0dd7c5ea8d",
  aiAcademy:
    import.meta.env.VITE_AI_ACADEMY_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/academy/chat",
  carloop:
    import.meta.env.VITE_CARLOOP_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/carloop-chat",
  ceylonKulubadu:
    import.meta.env.VITE_CEYLON_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/ceylon-chat",
  lankaGlow:
    import.meta.env.VITE_LANKA_GLOW_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/lanka-glow-chat",
  lankaLegal:
    import.meta.env.VITE_LANKA_LEGAL_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/legal/chat",
  meridianFinance:
    import.meta.env.VITE_MERIDIAN_FINANCE_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/c6d586f8-103f-4ccd-8e95-705f7f49a6e0/chat",
  sentinelInsurance:
    import.meta.env.VITE_SENTINEL_INSURANCE_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/53e126fa-59a8-422a-a8c4-f674091f848e/chat",
  teenMasterOfBusiness:
    import.meta.env.VITE_TEEN_MASTER_OF_BUSINESS_WEBHOOK ||
    "https://tachatbotapi.teenacademy.lk/webhook/teen-academy-chat",
  personalBranding:
    import.meta.env.VITE_PERSONAL_BRANDING_WEBHOOK ||
    "https://vmi3604779.contaboserver.net/webhook/personal-branding-chat-v6",
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
    aiType: "lankaElectroMart",
    welcomeMessage: "Welcome to Lanka Electro Mart's AI demo. What product can I help you find today?",
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
    aiType: "aiAcademy",
    welcomeMessage: "Welcome to AI Academy SL. Which subject, tutor, or class are you looking for?",
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
    welcomeMessage: "Welcome to the CarLoop demo. Vehicles, prices, quotes, and bookings in this experience are demo examples. Tell me what kind of vehicle you are looking for.",
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
    aiType: "lankaGlow",
    welcomeMessage: "Welcome to Lanka Glow Salon. Which service or appointment can I help you with?",
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
    aiType: "lankaLegal",
    welcomeMessage: "Welcome to Lanka Legal Partners. Briefly describe the legal support you need.",
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
    aiType: "meridianFinance",
    welcomeMessage: "Welcome to Meridian Finance. Which finance product can I help you explore?",
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
    aiType: "sentinelInsurance",
    welcomeMessage: "Welcome to Sentinel Insurance. What would you like to insure or claim for?",
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
    aiType: "teenMasterOfBusiness",
    welcomeMessage: "Welcome to Teen Master of Business. How can I help with the programme or enrolment?",
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

function normalizeImageUrl(url) {
  if (typeof url !== "string") return "";
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url.trim();
  }
}

function stripDuplicateProductImages(text, products = []) {
  if (typeof text !== "string" || !products.length) return text;

  const productUrls = new Set(
    products.map((item) => normalizeImageUrl(item?.image_url)).filter(Boolean),
  );

  return text
    .replace(/!\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g, (match, url) =>
      productUrls.has(normalizeImageUrl(url)) ? "" : match,
    )
    .replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, (match, url) =>
      productUrls.has(normalizeImageUrl(url)) ? "" : match,
    );
}

function ChatImage({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (hasError) {
    return (
      <div className="chat-image-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Image preview unavailable</span>
      </div>
    );
  }

  const cleanAlt = alt && alt !== "Assistant image" ? alt : "";

  return (
    <>
      <figure
        className="chat-image-card"
        style={{ width: "min(220px, 100%)", maxWidth: "100%" }}
      >
        <button
          type="button"
          className="chat-image-preview-btn"
          style={{ width: "100%", height: 180, maxWidth: "100%" }}
          onClick={() => setIsOpen(true)}
          title={cleanAlt ? `View ${cleanAlt} full size` : "Click to view full size"}
          aria-label={cleanAlt ? `View ${cleanAlt} full size` : "View image full size"}
        >
          {!isLoaded && <div className="chat-image-skeleton" aria-hidden="true" />}
          <img
            src={src}
            alt={cleanAlt || "Product image"}
            loading="lazy"
            className={`chat-image-element ${isLoaded ? "is-loaded" : ""}`}
            style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain" }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
          <span className="chat-image-badge" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>View</span>
          </span>
        </button>
        {cleanAlt && (
          <figcaption className="chat-image-caption" title={cleanAlt}>
            {cleanAlt}
          </figcaption>
        )}
      </figure>

      {isOpen &&
        createPortal(
          <div
            className="chat-image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={cleanAlt || "Full image preview"}
            onClick={() => setIsOpen(false)}
          >
            <div
              className="chat-image-lightbox__panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="chat-image-lightbox__header">
                <span className="chat-image-lightbox__title">
                  {cleanAlt || "Image Preview"}
                </span>
                <button
                  type="button"
                  className="chat-image-lightbox__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close image preview"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="chat-image-lightbox__image-wrap">
                <img src={src} alt={cleanAlt || "Full size preview"} />
              </div>
              <div className="chat-image-lightbox__footer">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-image-lightbox__link"
                >
                  Open Original
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function ChatMessageContent({ text, isAgent, products = [] }) {
  if (!text) return null;
  if (!isAgent) {
    return <p className="message-content message-content--user">{text}</p>;
  }

  return (
    <div className="message-content message-content--agent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => {
            const hasOnlyImage =
              node?.children?.length === 1 &&
              node.children[0].type === "element" &&
              node.children[0].tagName === "img";

            if (hasOnlyImage) {
              return <div className="chat-image-block">{children}</div>;
            }
            return <p {...props}>{children}</p>;
          },
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          img: ({ node, ...props }) => (
            <ChatImage src={props.src} alt={props.alt} />
          ),
        }}
      >
        {stripDuplicateProductImages(text, products)}
      </ReactMarkdown>
    </div>
  );
}

function ProductCard({ item, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const title = String(item?.name ?? "Product").replace(/\s*\(Demo\)\s*/gi, " ").trim();
  const price = Number(item?.price_lkr);

  return (
    <article className="product-card">
      <div className="product-card__image-box">
        {item?.image_url && !imageFailed ? (
          <>
            <button
              type="button"
              className="product-card__image-btn"
              onClick={() => setIsLightboxOpen(true)}
              title={`View ${title}`}
              aria-label={`View ${title} image`}
            >
              <img
                src={item.image_url}
                alt={item?.name || "Product"}
                onError={() => setImageFailed(true)}
                loading="lazy"
              />
            </button>
            {isLightboxOpen &&
              createPortal(
                <div
                  className="chat-image-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={title}
                  onClick={() => setIsLightboxOpen(false)}
                >
                  <div
                    className="chat-image-lightbox__panel"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="chat-image-lightbox__header">
                      <span className="chat-image-lightbox__title">{title}</span>
                      <button
                        type="button"
                        className="chat-image-lightbox__close"
                        onClick={() => setIsLightboxOpen(false)}
                        aria-label="Close image preview"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <div className="chat-image-lightbox__image-wrap">
                      <img src={item.image_url} alt={title} />
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </>
        ) : (
          <span className="product-card__image-fallback">Image unavailable</span>
        )}
      </div>
      <div className="product-card__body">
        {item?.variant && <span className="product-card__variant">{item.variant}</span>}
        <h3 title={title}>{title}</h3>
        <p className="product-card__price">
          {Number.isFinite(price) ? `LKR ${price.toLocaleString("en-US")}` : "Price on request"}
        </p>
        <button
          type="button"
          className="product-card__action"
          onClick={() => onSelect(`I want to buy ${item?.name || title} (${item?.sku || item?.product_id || "product"})`)}
        >
          Select / Buy
        </button>
      </div>
    </article>
  );
}

function ProductCards({ products, onSelect }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="product-cards" aria-label="Recommended products">
      {products.map((item, index) => (
        <ProductCard
          key={item?.product_id || item?.sku || `${item?.name || "product"}-${index}`}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </div>
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
    null
  );
}

async function sendToAI(type, message, sessionId, profile, updateConsent) {
  const request = createWebhookRequest(WEBHOOKS, type, {
    message,
    sessionId,
    profile,
    updateConsent,
  });

  const response = await fetch(request.url, {
    ...request.options,
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Webhook error:", { status: response.status, body });
    throw new Error(`Webhook failed: ${response.status}`);
  }

  const payload = await response.json();
  const data = Array.isArray(payload) ? payload[0] : payload;
  if (data?.success === false) throw new Error("Assistant could not complete the request");
  const reply = getWebhookReply(payload);
  if (typeof reply !== "string" || !reply.trim()) throw new Error("Invalid assistant reply");
  return {
    reply,
    products: Array.isArray(data?.products) ? data.products : [],
    limited: data?.degraded === true || data?.service_status === "limited",
  };
}

function VisitorProfileModal({
  service,
  savedProfile,
  initialConsent,
  mode,
  onCancel,
  onClear,
  onSubmit,
}) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [form, setForm] = useState(savedProfile ?? { name: "", email: "" });
  const [consent, setConsent] = useState(Boolean(initialConsent));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(savedProfile ?? { name: "", email: "" });
    setConsent(Boolean(initialConsent));
    setErrors({});
  }, [savedProfile, initialConsent]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleBlur = (field) => {
    const result = validateProfile(form);
    setErrors((current) => ({ ...current, [field]: result.errors[field] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateProfile(form);

    if (!result.isValid) {
      setErrors(result.errors);
      (result.errors.name ? nameRef : emailRef).current?.focus();
      return;
    }

    onSubmit(result.profile, consent);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="profile-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <section
        ref={dialogRef}
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        onKeyDown={handleKeyDown}
        style={{ "--service-accent": service.accent }}
      >
        <button type="button" className="profile-modal__close" onClick={onCancel} aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>

        <div className="profile-modal__heading">
          <span className="profile-modal__eyebrow">
            <i aria-hidden="true" /> {mode === "edit" ? "Your chat profile" : "Before we begin"}
          </span>
          <h2 id="profile-modal-title">
            {mode === "edit" ? "Update your details" : `Welcome to ${service.name}`}
          </h2>
          <p id="profile-modal-description">
            Your name helps the assistant make the conversation more personal. These details are sent only
            to {service.name}, the service you selected.
          </p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-form__field">
            <label htmlFor="visitor-name">Name</label>
            <input
              ref={nameRef}
              id="visitor-name"
              name="name"
              value={form.name}
              onChange={handleChange("name")}
              onBlur={() => handleBlur("name")}
              autoComplete="name"
              maxLength="80"
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "visitor-name-error" : undefined}
            />
            {errors.name && <span id="visitor-name-error" className="profile-form__error">{errors.name}</span>}
          </div>

          <div className="profile-form__field">
            <label htmlFor="visitor-email">Email address</label>
            <input
              ref={emailRef}
              id="visitor-email"
              name="email"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              autoComplete="email"
              maxLength="254"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "visitor-email-error" : undefined}
            />
            {errors.email && <span id="visitor-email-error" className="profile-form__error">{errors.email}</span>}
          </div>

          <label className="profile-form__consent" htmlFor="visitor-update-consent">
            <input
              id="visitor-update-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span aria-hidden="true" />
            <span>
              <strong>Email product updates (optional)</strong>
              Allow email updates only for a product I specifically ask to be notified about in this chat.
            </span>
          </label>

          <div className="profile-form__privacy">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <rect x="4.5" y="8.5" width="11" height="8" rx="2" />
              <path d="M7 8.5V6a3 3 0 0 1 6 0v2.5" />
            </svg>
            <p>Your profile is remembered only on this device. You can edit or clear it at any time.</p>
          </div>

          <div className="profile-form__actions">
            {savedProfile && (
              <button type="button" className="profile-form__clear" onClick={onClear}>
                Clear saved profile
              </button>
            )}
            <span />
            <button type="button" className="profile-form__cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="profile-form__submit">
              {mode === "edit" ? "Save changes" : "Continue to chat"} <ArrowIcon />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ServiceDetailPage({ service, onBack }) {
  const titleRef = useRef(null);
  const streamRef = useRef(null);
  const chatRef = useRef(null);
  const exploreButtonRef = useRef(null);
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
  const [availability, setAvailability] = useState("Ready");
  const [profile, setProfile] = useState(() => loadVisitorProfile());
  const [chatProfile, setChatProfile] = useState(null);
  const [updateConsent, setUpdateConsent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState("welcome");
  const [profileNotice, setProfileNotice] = useState("");
  const sessionId = useRef(
    globalThis.crypto?.randomUUID?.() ?? `${service.id}-${Date.now()}`,
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const openProfileModal = (mode = "welcome") => {
    setProfileModalMode(mode);
    setIsProfileModalOpen(true);
  };

  const handleExplore = () => {
    if (isChatOpen) {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    openProfileModal("welcome");
  };

  const handleProfileSubmit = (nextProfile, nextConsent) => {
    const remembered = saveVisitorProfile(nextProfile);
    const isFirstOpen = !isChatOpen;

    setProfile(nextProfile);
    setChatProfile(nextProfile);
    setUpdateConsent(nextConsent);
    setIsChatOpen(true);
    setIsProfileModalOpen(false);
    setProfileNotice(
      remembered
        ? profileModalMode === "edit"
          ? "Profile updated on this device."
          : "Profile saved on this device."
        : "Your details are active for this chat, but this browser could not remember them.",
    );

    if (isFirstOpen) {
      setMessages([
        {
          id: "welcome",
          role: "agent",
          text: createPersonalizedWelcome(service.welcomeMessage, nextProfile.name),
        },
      ]);
      requestAnimationFrame(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const handleClearProfile = () => {
    clearVisitorProfile();
    setProfile(null);
    setChatProfile(null);
    setUpdateConsent(false);
    setIsChatOpen(false);
    setMessages([
      {
        id: "welcome",
        role: "agent",
        text: service.welcomeMessage,
      },
    ]);
    setProfileNotice("Saved profile cleared from this device.");
    setAvailability("Ready");
  };

  const submitMessage = async (chatInput) => {
    if (!chatInput || isSending || !isConnected) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text: chatInput },
    ]);
    setIsSending(true);

    try {
      const { reply, products, limited } = await sendToAI(
        service.aiType,
        chatInput,
        sessionId.current,
        chatProfile,
        updateConsent,
      );
      setAvailability(limited ? "Limited support" : "Online");
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-agent`, role: "agent", text: reply, products },
      ]);
    } catch (error) {
      setAvailability("Temporarily unavailable");
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "agent",
          text: `The ${service.name} assistant couldn't complete your request. Please try again shortly.`,
          error: true,
        },
      ]);
      console.error(`${service.name} webhook error:`, error);
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    submitMessage(input.trim());
  };

  const selectProduct = (message) => submitMessage(message);

  return (
    <main className="service-detail-page" style={{ "--service-accent": service.accent }}>
      <BackgroundEffects />

      <nav className="contact-page__nav service-detail__nav" aria-label="Service details navigation">
        <button type="button" onClick={onBack} className="contact-page__back">
          <span aria-hidden="true">←</span> Back to services
        </button>
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
            ref={exploreButtonRef}
            type="button"
            className="service-detail__chat-link"
            onClick={handleExplore}
          >
            {isChatOpen ? "Go to conversation" : "Explore AI assistant"} <ArrowIcon />
          </button>
          {!isChatOpen && profileNotice && (
            <p className="service-detail__profile-notice" role="status" aria-live="polite">
              {profileNotice}
            </p>
          )}
        </div>
      </section>

      {isChatOpen && (
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
            <div className="conversation-panel__controls">
              <div className={`conversation-panel__status${!isConnected || availability === "Limited support" || availability === "Temporarily unavailable" ? " is-pending" : ""}`}>
                <i aria-hidden="true" /> {isConnected ? availability : "Ready for n8n"}
              </div>
              <div className="chat-profile-actions" aria-label="Chat profile controls">
                <span>{chatProfile?.name?.split(" ")[0]}'s profile</span>
                <button type="button" onClick={() => openProfileModal("edit")}>Edit</button>
                <button type="button" onClick={handleClearProfile}>Clear</button>
              </div>
            </div>
          </header>

          <p className="profile-status" role="status" aria-live="polite">{profileNotice}</p>

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
                  <ChatMessageContent
                    text={message.text}
                    isAgent={message.role === "agent"}
                    products={message.products}
                  />
                  {message.role === "agent" && (
                    <ProductCards products={message.products} onSelect={selectProduct} />
                  )}
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
      )}

      {isProfileModalOpen && (
        <VisitorProfileModal
          service={service}
          savedProfile={profile}
          initialConsent={profileModalMode === "edit" ? updateConsent : false}
          mode={profileModalMode}
          onCancel={() => setIsProfileModalOpen(false)}
          onClear={handleClearProfile}
          onSubmit={handleProfileSubmit}
        />
      )}
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
          <div className="system-status" aria-label="Ten services available">
            <span className="system-status__dot" aria-hidden="true" />
            <span><small>Service status</small>10 Available</span>
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
      <section className="gro4ce-hero" aria-label="AI services">
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

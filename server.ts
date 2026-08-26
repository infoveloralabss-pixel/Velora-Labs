import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Initial Data Seed
const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    slug: "aurora-health-ai-telehealth",
    title: "Aurora Health — Next-Gen AI Telehealth Platform",
    tagline: "High-throughput React/Node Telehealth Ecosystem with Real-Time Triage",
    clientName: "Aurora Health Technologies",
    category: "saas",
    subCategory: "SaaS Product Engineering & Telemedicine",
    services: ["SaaS Architecture", "React & Node.js", "WebRTC Video", "HIPAA Compliance", "UI/UX System"],
    technologies: ["React 19", "Node.js", "PostgreSQL", "TailwindCSS", "WebRTC", "Redis"],
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Architected and built a multi-tenant clinical consultation platform from ground zero to over 450,000 monthly active patient appointments.",
    challenge: "Aurora required an ultra-low latency patient-doctor interface with dynamic clinical intake forms, automated scheduling, and strict regulatory compliance that could handle 10x traffic surges without degradation.",
    solution: "Velora Labs engineered a decoupled micro-frontend architecture using modern React, custom WebRTC signaling pipelines, and an asynchronous queue processing system for instant medical records indexing.",
    results: [
      { metric: "450k+", label: "Monthly Consultations", description: "Scaled from zero in under 9 months" },
      { metric: "99.99%", label: "Platform Uptime", description: "Zero downtime during peak healthcare hours" },
      { metric: "<140ms", label: "Global Latency", description: "Real-time bi-directional patient signaling" }
    ],
    externalUrl: "https://aurorahealth.example.com",
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
    seoTitle: "Aurora Health Case Study | SaaS Product Engineering by Velora Labs",
    seoDescription: "How Velora Labs designed and built Aurora Health's scalable AI-ready telehealth portal.",
    publishedAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-02-10T00:00:00.000Z",
    testimonial: {
      author: "Dr. Elena Rostova",
      role: "Chief Technology Officer, Aurora Health",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "Velora Labs doesn't just write code; they think like seasoned venture architects. Their architectural rigor allowed us to close our Series B ahead of schedule."
    }
  },
  {
    id: "proj-2",
    slug: "lumina-nordic-headless-shopify",
    title: "Lumina Nordic — High-Conversion Headless Shopify Store",
    tagline: "Sub-Second Global Headless Commerce for Scandinavian Design Icon",
    clientName: "Lumina Home & Living",
    category: "website",
    subCategory: "Headless Shopify & Conversion Optimization",
    services: ["Shopify Plus", "Next.js Storefront", "Speed Optimization", "Global CDN", "Custom Checkout"],
    technologies: ["Shopify Plus API", "React", "TailwindCSS", "Edge CDN", "Algolia Search"],
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Rebuilt Lumina Nordic's legacy monolithic store into an edge-rendered headless commerce experience, multiplying checkout conversion across 18 countries.",
    challenge: "Slow load times (>4.2s) and high mobile cart abandonment were hurting international expansion into North America and Asia-Pacific.",
    solution: "We designed a bespoke editorial storefront utilizing headless Shopify Storefront API with instant page transitions, localized currencies, and predictive search.",
    results: [
      { metric: "+48%", label: "Conversion Lift", description: "Mobile checkout completion increase" },
      { metric: "0.6s", label: "Average Page Load", description: "99+ Google Lighthouse performance score" },
      { metric: "+112%", label: "International Revenue", description: "Immediate lift post-launch" }
    ],
    externalUrl: "https://luminanordic.example.com",
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
    seoTitle: "Lumina Nordic E-Commerce Redesign | Velora Labs",
    seoDescription: "Exploration of the headless Shopify architecture that delivered a 48% conversion boost.",
    publishedAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2025-02-05T00:00:00.000Z",
    testimonial: {
      author: "Magnus Lindqvist",
      role: "VP of E-Commerce, Lumina Nordic",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "The speed differential is night and day. Velora Labs rebuilt our global storefront with zero revenue downtime, delivering the highest converting quarter in our company's history."
    }
  },
  {
    id: "proj-3",
    slug: "vanguard-capital-autonomous-crm-pipeline",
    title: "Vanguard Capital — Enterprise n8n & GHL Automation Engine",
    tagline: "Autonomous Deal Ingestion, AI Qualification & CRM Sync Pipeline",
    clientName: "Vanguard Real Estate Group",
    category: "automation",
    subCategory: "AI Automation & CRM Integration",
    services: ["n8n Workflows", "GoHighLevel CRM", "Make.com API Sync", "AI Lead Scoring", "Instant Dispatch"],
    technologies: ["n8n", "Make", "GoHighLevel", "OpenAI / Claude API", "PostgreSQL", "Twilio API"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Built an end-to-end automated deal intake and AI qualification engine processing over $120M in quarterly commercial real estate inquiries.",
    challenge: "Manual follow-ups resulted in 36-hour lead latency, high deal leakage, and disconnected CRM databases across 4 regional branches.",
    solution: "Velora Labs deployed a resilient n8n automation cluster integrated with GoHighLevel and custom AI scoring agents to validate financial parameters, enrich prospect dossiers, and schedule qualified broker meetings in under 45 seconds.",
    results: [
      { metric: "<45 sec", label: "Speed to Lead", description: "Down from 36 hours previously" },
      { metric: "73%", label: "Manual Hours Saved", description: "Automated triage & data reconciliation" },
      { metric: "$38M+", label: "Pipeline Generated", description: "Directly attributable to autonomous follow-ups" }
    ],
    externalUrl: "https://vanguardcapital.example.com",
    isFeatured: true,
    isPublished: true,
    displayOrder: 3,
    seoTitle: "Vanguard Capital Automation Pipeline | Velora Labs",
    seoDescription: "How autonomous workflows transformed high-ticket deal flow and broker velocity.",
    publishedAt: "2025-02-01T00:00:00.000Z",
    updatedAt: "2025-02-18T00:00:00.000Z",
    testimonial: {
      author: "Julian Vance",
      role: "Managing Director, Vanguard Capital",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      quote: "Our deal pipeline runs on pure autopilot now. Velora Labs connected our disparate tech stack into an intelligent machine that never drops a lead."
    }
  },
  {
    id: "proj-4",
    slug: "strata-fintech-multi-channel-growth",
    title: "Strata Pay — $0 to $3.2M ARR Growth Marketing Engine",
    tagline: "Omnichannel B2B Acquisition, Google & Meta Ads + Funnel CRO",
    clientName: "Strata Financial Systems",
    category: "marketing",
    subCategory: "Performance Marketing & Funnel Optimization",
    services: ["Google Ads Scale", "Meta B2B Ads", "Funnel CRO", "Attribution Modeling", "Creative Velocity"],
    technologies: ["Google Ads", "Meta Business", "Triple Whale", "PostHog", "Unbounce"],
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Engineered a predictable customer acquisition apparatus for a modern B2B billing infrastructure product, scaling to $3.2M ARR in 14 months.",
    challenge: "High customer acquisition cost ($1,850/CAC) on generic paid search keywords with low demo-to-activation conversion.",
    solution: "Rebuilt the acquisition architecture: high-intent landing page variants, custom value calculators, granular intent-based Google Ads bidding, and dynamic retargeting sequences.",
    results: [
      { metric: "-62%", label: "Customer Acquisition Cost", description: "Reduced CAC from $1,850 to $703" },
      { metric: "4.8x", label: "ROAS / Pipeline Value", description: "Blended qualified sales pipeline return" },
      { metric: "$3.2M", label: "New Annual ARR", description: "Generated within first 14 months" }
    ],
    externalUrl: "https://stratapay.example.com",
    isFeatured: true,
    isPublished: true,
    displayOrder: 4,
    seoTitle: "Strata Pay Growth Marketing Case Study | Velora Labs",
    seoDescription: "How Velora Labs scaled Strata Pay's paid customer acquisition to $3.2M ARR.",
    publishedAt: "2025-02-12T00:00:00.000Z",
    updatedAt: "2025-02-20T00:00:00.000Z",
    testimonial: {
      author: "Samantha Wei",
      role: "Head of Growth, Strata Pay",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote: "Velora Labs doesn't just run ads; they dissect your unit economics, build bespoke landing experiences, and iterate on actual revenue metrics."
    }
  },
  {
    id: "proj-5",
    slug: "nexus-logistics-dispatch-automation",
    title: "Nexus Global — Freight Automation & Zapier/Make Workflows",
    tagline: "Zero-Latency Logistics Notification & Fleet Tracking Pipeline",
    clientName: "Nexus Freight Logistics",
    category: "automation",
    subCategory: "Business Process & Supply Chain Automation",
    services: ["Zapier Enterprise", "Make.com Scenarios", "ERP Sync", "SMS Telemetry", "Custom Webhooks"],
    technologies: ["Make.com", "Zapier", "Node.js", "Twilio", "Google Sheets API"],
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Connected 12 regional distribution warehouses with instant carrier dispatch and customer SMS status broadcasts.",
    challenge: "Manual spreadsheet updates and delayed dispatch notices caused driver detention charges exceeding $40,000 monthly.",
    solution: "Designed automated webhook listeners syncing warehouse weigh-stations directly to carriers and shippers in real time.",
    results: [
      { metric: "92%", label: "Reduction in Detention Fees", description: "Real-time driver dispatch alerts" },
      { metric: "14,000+", label: "Monthly Auto Dispatches", description: "Handled seamlessly without manual touch" }
    ],
    externalUrl: "https://nexusfreight.example.com",
    isFeatured: false,
    isPublished: true,
    displayOrder: 5,
    seoTitle: "Nexus Freight Automation Case Study | Velora Labs",
    seoDescription: "Automating nationwide freight dispatch with Make and Zapier enterprise workflows.",
    publishedAt: "2025-02-14T00:00:00.000Z",
    updatedAt: "2025-02-14T00:00:00.000Z"
  },
  {
    id: "proj-6",
    slug: "atelier-koto-minimalist-portfolio-brand",
    title: "Atelier Koto — Architectural Showcase & CMS Website",
    tagline: "Fluid WebGL Transitions & Editorial WordPress Headless CMS",
    clientName: "Atelier Koto Architecture",
    category: "website",
    subCategory: "High-End Architecture Portfolio",
    services: ["Editorial Design", "Headless CMS", "Smooth Animation", "Image Optimization", "SEO"],
    technologies: ["WordPress Headless", "React", "Motion", "TailwindCSS"],
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
    ],
    summary: "Crafted a bespoke digital monograph for a premier Scandinavian architecture studio.",
    challenge: "Presenting massive 4K photography portfolios without compromising mobile smoothness or loading performance.",
    solution: "Constructed an ultra-lightweight progressive image pipeline with editorial typography and kinetic scroll reveals.",
    results: [
      { metric: "3.4x", label: "Time on Site", description: "Enhanced client engagement with projects" },
      { metric: "100/100", label: "Lighthouse SEO", description: "Dominates search rankings for luxury architects" }
    ],
    externalUrl: "https://atelierkoto.example.com",
    isFeatured: false,
    isPublished: true,
    displayOrder: 6,
    seoTitle: "Atelier Koto Architecture Showcase | Velora Labs",
    seoDescription: "Editorial digital architecture experience built with headless CMS.",
    publishedAt: "2025-02-16T00:00:00.000Z",
    updatedAt: "2025-02-16T00:00:00.000Z"
  }
];

const INITIAL_CLIENTS = [
  {
    id: "client-1",
    name: "Aurora Health",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80",
    website: "https://aurorahealth.example.com",
    description: "Venture-backed telemedicine and digital healthcare platform.",
    category: "client",
    relationshipType: "SaaS Product Engineering Client",
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
    seoTitle: "Aurora Health Partner Profile | Velora Labs",
    seoDescription: "Venture-backed telemedicine and digital healthcare platform engineered by Velora Labs.",
    metaTitle: "Aurora Health Partner Profile | Velora Labs",
    metaDescription: "Venture-backed telemedicine and digital healthcare platform engineered by Velora Labs.",
    testimonial: {
      quote: "Velora Labs delivered the foundational architecture that powered our 10x growth in active patient appointments.",
      author: "Dr. Elena Rostova",
      role: "CTO, Aurora Health",
      rating: 5
    },
    linkedProjectSlugs: ["aurora-health-ai-telehealth"]
  },
  {
    id: "client-2",
    name: "Lumina Nordic",
    logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=120&q=80",
    website: "https://luminanordic.example.com",
    description: "Scandinavian luxury furniture & direct-to-consumer lifestyle brand.",
    category: "client",
    relationshipType: "Headless E-Commerce Client",
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
    seoTitle: "Lumina Nordic E-Commerce Partnership | Velora Labs",
    seoDescription: "Scandinavian luxury design and global headless commerce architecture case profile.",
    metaTitle: "Lumina Nordic E-Commerce Partnership | Velora Labs",
    metaDescription: "Scandinavian luxury design and global headless commerce architecture case profile.",
    testimonial: {
      quote: "The speed and conversion lift across 18 countries exceeded our most aggressive annual targets.",
      author: "Magnus Lindqvist",
      role: "VP of E-Commerce, Lumina Nordic",
      rating: 5
    },
    linkedProjectSlugs: ["lumina-nordic-headless-shopify"]
  },
  {
    id: "client-3",
    name: "Vanguard Capital",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&q=80",
    website: "https://vanguardcapital.example.com",
    description: "Commercial real estate investment syndicate managing $400M+ AUM.",
    category: "enterprise",
    relationshipType: "AI Workflow & CRM Partner",
    isFeatured: true,
    isPublished: true,
    displayOrder: 3,
    seoTitle: "Vanguard Capital Commercial Real Estate Automation | Velora Labs",
    seoDescription: "Enterprise workflow systems and automated broker pipelines by Velora Labs.",
    metaTitle: "Vanguard Capital Commercial Real Estate Automation | Velora Labs",
    metaDescription: "Enterprise workflow systems and automated broker pipelines by Velora Labs.",
    testimonial: {
      quote: "The autonomous deal triage pipeline eliminated hundreds of manual administrative hours every month.",
      author: "Julian Vance",
      role: "Managing Director, Vanguard Capital",
      rating: 5
    },
    linkedProjectSlugs: ["vanguard-capital-autonomous-crm-pipeline"]
  },
  {
    id: "client-4",
    name: "Strata Financial",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80",
    website: "https://stratapay.example.com",
    description: "Modern enterprise invoicing and payment infrastructure provider.",
    category: "client",
    relationshipType: "Growth & Performance Marketing Client",
    isFeatured: true,
    isPublished: true,
    displayOrder: 4,
    seoTitle: "Strata Financial FinTech Scale Profile | Velora Labs",
    seoDescription: "Multi-channel B2B paid growth, CAC reduction, and high-intent demo pipelines.",
    metaTitle: "Strata Financial FinTech Scale Profile | Velora Labs",
    metaDescription: "Multi-channel B2B paid growth, CAC reduction, and high-intent demo pipelines.",
    testimonial: {
      quote: "A true revenue partner. They cut our CAC by 62% while tripling our demo pipeline.",
      author: "Samantha Wei",
      role: "Head of Growth, Strata Pay",
      rating: 5
    },
    linkedProjectSlugs: ["strata-fintech-multi-channel-growth"]
  },
  {
    id: "client-5",
    name: "Nexus Freight",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80",
    website: "https://nexusfreight.example.com",
    description: "Nationwide supply chain and logistics fleet carrier.",
    category: "client",
    relationshipType: "Automation & Integration Client",
    isFeatured: true,
    isPublished: true,
    displayOrder: 5,
    seoTitle: "Nexus Freight Logistics Automation | Velora Labs",
    seoDescription: "Nationwide fleet dispatch and multi-carrier ERP synchronization systems.",
    metaTitle: "Nexus Freight Logistics Automation | Velora Labs",
    metaDescription: "Nationwide fleet dispatch and multi-carrier ERP synchronization systems.",
    testimonial: {
      quote: "Smooth operations across 12 distribution hubs with zero manual entry bottlenecks.",
      author: "David Kovacs",
      role: "COO, Nexus Freight",
      rating: 5
    },
    linkedProjectSlugs: ["nexus-logistics-dispatch-automation"]
  },
  {
    id: "client-6",
    name: "Atelier Koto",
    logo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80",
    website: "https://atelierkoto.example.com",
    description: "Boutique architectural practice specializing in sustainable residences.",
    category: "client",
    relationshipType: "Brand Showcase & Web Experience",
    isFeatured: false,
    isPublished: true,
    displayOrder: 6,
    seoTitle: "Atelier Koto Architecture Web Experience | Velora Labs",
    seoDescription: "Editorial brand identity, interactive 3D portfolios, and conversion showcase.",
    metaTitle: "Atelier Koto Architecture Web Experience | Velora Labs",
    metaDescription: "Editorial brand identity, interactive 3D portfolios, and conversion showcase.",
    linkedProjectSlugs: ["atelier-koto-minimalist-portfolio-brand"]
  }
];

const INITIAL_INQUIRIES = [
  {
    id: "inq-101",
    name: "Marcus Sterling",
    email: "marcus@sterlingventures.io",
    company: "Sterling Ventures",
    service: "saas",
    budget: "$35k - $75k",
    timeline: "1 - 2 months",
    message: "We need an experienced product team to take over development of our B2B compliance dashboard and rebuild the real-time reporting module.",
    status: "reviewed",
    createdAt: "2025-02-18T14:30:00.000Z"
  },
  {
    id: "inq-102",
    name: "Chloe Chen",
    email: "chloe@verveapparel.co",
    company: "Verve Apparel",
    service: "website",
    budget: "$15k - $35k",
    timeline: "Immediate (< 2 weeks)",
    message: "Migrating our flagship store to Shopify Plus with custom interactive sizing tools and 3D product previews.",
    status: "new",
    createdAt: "2025-02-23T09:15:00.000Z"
  }
];

const INITIAL_TEAM = [
  {
    id: "team-1",
    name: "Julian Thorne",
    role: "Principal & Head of Architecture",
    specialty: "Distributed Systems & SaaS Engineering",
    bio: "Former senior systems architect with 12+ years building multi-tenant SaaS platforms scaling to millions of daily requests.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    experience: "Ex-Stripe Infrastructure, YC Alumni Lead",
    displayOrder: 1,
    isPublished: true,
    socialLinkedin: "https://linkedin.com",
    socialTwitter: "https://x.com",
    socialGithub: "https://github.com"
  },
  {
    id: "team-2",
    name: "Soren Lindqvist",
    role: "Partner & Head of Automation",
    specialty: "Enterprise Workflow Systems & n8n / GHL",
    bio: "Architect of high-volume autonomous business pipelines processing over $200M in annual transactional deal flow.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    experience: "n8n Core Specialist, Enterprise Systems Consultant",
    displayOrder: 2,
    isPublished: true,
    socialLinkedin: "https://linkedin.com",
    socialTwitter: "https://x.com",
    socialGithub: "https://github.com"
  },
  {
    id: "team-3",
    name: "Maya Lin-Castillo",
    role: "Design Director & UX Strategist",
    specialty: "Design Systems & Conversion Optimization",
    bio: "Pioneered editorial digital experiences and high-conversion e-commerce storefronts for global heritage and modern DTC brands.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    experience: "Awwwards Judge 2023-2024, Ex-Pentagram Digital",
    displayOrder: 3,
    isPublished: true,
    socialLinkedin: "https://linkedin.com",
    socialTwitter: "https://x.com",
    socialGithub: "https://github.com"
  },
  {
    id: "team-4",
    name: "Darius Vance",
    role: "Partner & Head of Growth",
    specialty: "Paid Acquisition & Attribution Modeling",
    bio: "Scaled 14 B2B and consumer brands from seed to Series B with over $35M in profitable managed ad spend.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    experience: "Ex-Growth Lead at FinTech Scaleups",
    displayOrder: 4,
    isPublished: true,
    socialLinkedin: "https://linkedin.com",
    socialTwitter: "https://x.com",
    socialGithub: "https://github.com"
  }
];

// Persistent File Storage Helper
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");

interface DatabaseSchema {
  projects: typeof INITIAL_PROJECTS;
  clients: typeof INITIAL_CLIENTS;
  inquiries: typeof INITIAL_INQUIRIES;
  team: typeof INITIAL_TEAM;
}

let dbData: DatabaseSchema = {
  projects: INITIAL_PROJECTS,
  clients: INITIAL_CLIENTS,
  inquiries: INITIAL_INQUIRIES,
  team: INITIAL_TEAM,
};

function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        dbData = {
          projects: parsed.projects,
          clients: Array.isArray(parsed.clients) ? parsed.clients : INITIAL_CLIENTS,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : INITIAL_INQUIRIES,
          team: Array.isArray(parsed.team) && parsed.team.length > 0
            ? parsed.team.map((t: any, i: number) => ({
                ...t,
                displayOrder: Number(t.displayOrder) || i + 1,
                isPublished: t.isPublished !== false
              }))
            : INITIAL_TEAM,
        };
        console.log(`[Storage] Loaded ${dbData.projects.length} projects, ${dbData.clients.length} clients, ${dbData.team.length} team members from store.json`);
        return;
      }
    }
  } catch (err) {
    console.error("[Storage] Failed to load store.json, using defaults", err);
  }
  saveDatabase();
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to save store.json", err);
  }
}

loadDatabase();

// ------------------- API ENDPOINTS -------------------

// 1. Stats Overview
app.get("/api/stats", (req, res) => {
  const totalProjects = dbData.projects.length;
  const publishedProjects = dbData.projects.filter(p => p.isPublished).length;
  const featuredProjects = dbData.projects.filter(p => p.isFeatured && p.isPublished).length;
  const totalClients = dbData.clients.length;
  const publishedClients = dbData.clients.filter(c => c.isPublished).length;
  const totalTeam = dbData.team.length;
  const publishedTeam = dbData.team.filter(t => t.isPublished !== false).length;
  const totalInquiries = dbData.inquiries.length;
  const newInquiries = dbData.inquiries.filter(i => i.status === "new").length;

  const categoryDistribution = {
    website: dbData.projects.filter(p => p.category === "website").length,
    automation: dbData.projects.filter(p => p.category === "automation").length,
    saas: dbData.projects.filter(p => p.category === "saas").length,
    marketing: dbData.projects.filter(p => p.category === "marketing").length,
  };

  res.json({
    totalProjects,
    publishedProjects,
    featuredProjects,
    totalClients,
    publishedClients,
    totalTeam,
    publishedTeam,
    totalInquiries,
    newInquiries,
    categoryDistribution
  });
});

// 2. Portfolio Projects CRUD
app.get("/api/projects", (req, res) => {
  const { category, search, published, featured } = req.query;
  let list = [...dbData.projects];

  if (published === "true") {
    list = list.filter(p => p.isPublished);
  } else if (published === "false") {
    list = list.filter(p => !p.isPublished);
  }

  if (featured === "true") {
    list = list.filter(p => p.isFeatured);
  }

  if (category && category !== "all") {
    list = list.filter(p => p.category === category);
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q)) ||
      p.technologies.some(t => t.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(list);
});

app.get("/api/projects/:idOrSlug", (req, res) => {
  const { idOrSlug } = req.params;
  const project = dbData.projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
});

app.post("/api/projects", (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category) {
      return res.status(400).json({ error: "Title and category are required" });
    }

    const id = "proj-" + Date.now();
    let slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (dbData.projects.some(p => p.slug === slug)) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const newProject = {
      id,
      slug,
      title: data.title,
      tagline: data.tagline || "",
      clientName: data.clientName || "Confidential Partner",
      clientLogo: data.clientLogo || "",
      category: data.category,
      subCategory: data.subCategory || "",
      services: Array.isArray(data.services) ? data.services : [],
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
      gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [data.coverImage || ""],
      summary: data.summary || "",
      challenge: data.challenge || "",
      solution: data.solution || "",
      results: Array.isArray(data.results) ? data.results : [],
      externalUrl: data.externalUrl || "",
      isFeatured: !!data.isFeatured,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : dbData.projects.length + 1,
      seoTitle: data.seoTitle || data.metaTitle || `${data.title} | Velora Labs Case Study`,
      seoDescription: data.seoDescription || data.metaDescription || data.summary || "",
      metaTitle: data.metaTitle || data.seoTitle || `${data.title} | Velora Labs Case Study`,
      metaDescription: data.metaDescription || data.seoDescription || data.summary || "",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testimonial: data.testimonial || undefined
    };

    dbData.projects.push(newProject);
    saveDatabase();
    res.status(201).json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create project" });
  }
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const index = dbData.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  const existing = dbData.projects[index];
  const data = req.body;

  const updatedProject = {
    ...existing,
    ...data,
    id: existing.id, // Immutable ID
    slug: data.slug || existing.slug,
    updatedAt: new Date().toISOString()
  };

  dbData.projects[index] = updatedProject;
  saveDatabase();
  res.json(updatedProject);
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = dbData.projects.length;
  dbData.projects = dbData.projects.filter(p => p.id !== id);
  if (dbData.projects.length === initialLength) {
    return res.status(404).json({ error: "Project not found" });
  }
  saveDatabase();
  res.json({ success: true, message: "Project deleted successfully" });
});

// 3. Client & Partner CRUD
app.get("/api/clients", (req, res) => {
  const { category, search, published, featured } = req.query;
  let list = [...dbData.clients];

  if (published === "true") {
    list = list.filter(c => c.isPublished);
  }

  if (featured === "true") {
    list = list.filter(c => c.isFeatured);
  }

  if (category && category !== "all") {
    list = list.filter(c => c.category === category);
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.relationshipType.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(list);
});

app.post("/api/clients", (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ error: "Client name is required" });
    }

    const newClient = {
      id: "client-" + Date.now(),
      name: data.name,
      logo: data.logo || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80",
      website: data.website || "",
      description: data.description || "",
      category: data.category || "client",
      relationshipType: data.relationshipType || "Digital Partner",
      isFeatured: !!data.isFeatured,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : dbData.clients.length + 1,
      seoTitle: data.seoTitle || data.metaTitle || `${data.name} Partner Profile | Velora Labs`,
      seoDescription: data.seoDescription || data.metaDescription || data.description || "",
      metaTitle: data.metaTitle || data.seoTitle || `${data.name} Partner Profile | Velora Labs`,
      metaDescription: data.metaDescription || data.seoDescription || data.description || "",
      testimonial: data.testimonial || undefined,
      linkedProjectSlugs: Array.isArray(data.linkedProjectSlugs) ? data.linkedProjectSlugs : []
    };

    dbData.clients.push(newClient);
    saveDatabase();
    res.status(201).json(newClient);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create client" });
  }
});

app.put("/api/clients/:id", (req, res) => {
  const { id } = req.params;
  const index = dbData.clients.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Client not found" });
  }

  const existing = dbData.clients[index];
  const data = req.body;

  const updatedClient = {
    ...existing,
    ...data,
    id: existing.id
  };

  dbData.clients[index] = updatedClient;
  saveDatabase();
  res.json(updatedClient);
});

app.delete("/api/clients/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = dbData.clients.length;
  dbData.clients = dbData.clients.filter(c => c.id !== id);
  if (dbData.clients.length === initialLength) {
    return res.status(404).json({ error: "Client not found" });
  }
  saveDatabase();
  res.json({ success: true, message: "Client deleted successfully" });
});

// 4. Team Members CRUD
app.get("/api/team", (req, res) => {
  const { published, search } = req.query;
  let list = [...dbData.team];

  if (published === "true") {
    list = list.filter(t => t.isPublished !== false);
  } else if (published === "false") {
    list = list.filter(t => t.isPublished === false);
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.specialty.toLowerCase().includes(q) ||
      t.bio.toLowerCase().includes(q) ||
      t.experience.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
  res.json(list);
});

app.get("/api/team/:id", (req, res) => {
  const { id } = req.params;
  const member = dbData.team.find(t => t.id === id);
  if (!member) {
    return res.status(404).json({ error: "Team member not found" });
  }
  res.json(member);
});

app.post("/api/team", (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.role) {
      return res.status(400).json({ error: "Name and role are required" });
    }

    const orderNum = data.displayOrder !== undefined ? (parseInt(String(data.displayOrder), 10) || dbData.team.length + 1) : dbData.team.length + 1;

    const newMember = {
      id: "team-" + Date.now(),
      name: data.name,
      role: data.role,
      specialty: data.specialty || "Senior Systems Specialist",
      bio: data.bio || "",
      avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      experience: data.experience || "Industry Veteran",
      displayOrder: orderNum,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      socialLinkedin: data.socialLinkedin || "",
      socialTwitter: data.socialTwitter || "",
      socialGithub: data.socialGithub || ""
    };

    dbData.team.push(newMember);
    saveDatabase();
    res.status(201).json(newMember);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create team member" });
  }
});

app.put("/api/team/:id", (req, res) => {
  const { id } = req.params;
  const index = dbData.team.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Team member not found" });
  }

  const existing = dbData.team[index];
  const data = req.body;

  const orderNum = data.displayOrder !== undefined
    ? (parseInt(String(data.displayOrder), 10) || existing.displayOrder || 1)
    : (existing.displayOrder || 1);

  const updatedMember = {
    ...existing,
    ...data,
    displayOrder: orderNum,
    isPublished: data.isPublished !== undefined ? !!data.isPublished : existing.isPublished,
    id: existing.id
  };

  dbData.team[index] = updatedMember;
  saveDatabase();
  res.json(updatedMember);
});

app.delete("/api/team/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = dbData.team.length;
  dbData.team = dbData.team.filter(t => t.id !== id);
  if (dbData.team.length === initialLength) {
    return res.status(404).json({ error: "Team member not found" });
  }
  saveDatabase();
  res.json({ success: true, message: "Team member deleted successfully" });
});

// =========================================================
// INPUT SANITIZATION, SPAM PROTECTION & RATE LIMITING
// =========================================================
function sanitizeText(val: any, maxLen: number = 1000): string {
  if (typeof val !== "string") return "";
  // Strip null bytes and dangerous control characters
  return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, maxLen);
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In-memory sliding window rate limiter
const submissionRateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_IP = 5; // Max 5 submissions per 10m window

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionRateLimits.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_SUBMISSIONS_PER_IP) {
    return true;
  }
  timestamps.push(now);
  submissionRateLimits.set(ip, timestamps);
  return false;
}

// =========================================================
// SMTP / NODEMAILER EMAIL DISPATCHER
// =========================================================
interface InquiryPayload {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  website: "Websites & Headless Commerce",
  ai_automation: "AI & Intelligent Automation",
  saas: "SaaS Product Engineering",
  marketing: "Performance Marketing & CRO",
  full_systems: "Full-Stack Digital Systems Architecture"
};

function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "false" || port === 587 ? false : true;
  const user = process.env.SMTP_USER || "info.veloralabss@gmail.com";
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";

  if (!pass) {
    console.warn(`[SMTP Notice] SMTP_PASS is not set in environment. Inquiries are stored in local DB & logged. Set SMTP_PASS in Settings / .env to dispatch live emails to ${user}`);
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

async function sendInquiryNotification(inquiry: InquiryPayload): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || "info.veloralabss@gmail.com";
  const rawService = inquiry.service || "full_systems";
  const serviceLabel = SERVICE_LABELS[rawService] || rawService;
  const transporter = getEmailTransporter();

  console.log(`\n========================================`);
  console.log(`📬 NEW INQUIRY RECEIVED: ${inquiry.name} (${inquiry.email})`);
  console.log(`🏢 Company: ${inquiry.company || "Undisclosed"} | Service: ${serviceLabel}`);
  console.log(`💰 Budget: ${inquiry.budget || "Flexible"} | Timeline: ${inquiry.timeline || "Flexible"}`);
  console.log(`📝 Message: ${inquiry.message}`);
  console.log(`========================================\n`);

  if (!transporter) {
    return {
      sent: false,
      error: "SMTP_PASS not configured"
    };
  }

  const senderAddress = process.env.SMTP_FROM || `"Velora Labs Dispatch" <${process.env.SMTP_USER || "info.veloralabss@gmail.com"}>`;
  const cleanNameForHeader = inquiry.name.replace(/["\r\n]/g, "");
  const replyToAddress = `"${cleanNameForHeader}" <${inquiry.email}>`;

  // Sanitized strings for HTML email rendering
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safeCompany = escapeHtml(inquiry.company || "Undisclosed");
  const safeService = escapeHtml(serviceLabel);
  const safeBudget = escapeHtml(inquiry.budget || "Flexible");
  const safeTimeline = escapeHtml(inquiry.timeline || "Flexible");
  const safeMessage = escapeHtml(inquiry.message);
  const safeId = escapeHtml(inquiry.id);

  // 1. Email to Agency Administrator
  const adminMailOptions = {
    from: senderAddress,
    to: notificationEmail,
    replyTo: replyToAddress,
    subject: `🚨 New RFP: ${inquiry.name} (${inquiry.company || "Private Client"}) — ${serviceLabel}`,
    text: `New Strategic RFP Received via Velora Labs Website\n\n` +
      `Client Name: ${inquiry.name}\n` +
      `Email: ${inquiry.email}\n` +
      `Company: ${inquiry.company || "Undisclosed"}\n` +
      `Service Focus: ${serviceLabel}\n` +
      `Target Capital: ${inquiry.budget || "Flexible"}\n` +
      `Execution Timeline: ${inquiry.timeline || "Flexible"}\n` +
      `Submitted: ${new Date(inquiry.createdAt).toLocaleString()}\n\n` +
      `Project Brief & Scope:\n${inquiry.message}\n\n` +
      `---\nDirect Client Reply: mailto:${inquiry.email}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050711; color: #e2e8f0; margin: 0; padding: 24px; }
          .card { max-width: 620px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 28px; text-align: left; }
          .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 0; font-size: 13px; color: #e0f2fe; }
          .body { padding: 28px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: rgba(34,211,238,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); margin-bottom: 20px; }
          .grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .row { display: table-row; }
          .label { display: table-cell; width: 140px; padding: 8px 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { display: table-cell; padding: 8px 0; font-size: 14px; color: #f8fafc; font-weight: 500; }
          .message-box { background: #070d19; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-bottom: 24px; }
          .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 700; font-size: 13px; border-radius: 10px; text-align: center; }
          .footer { padding: 20px 28px; background-color: #050711; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>⚡ New Strategic RFP / Project Brief</h1>
            <p>Velora Labs Digital Systems Lead Capture</p>
          </div>
          <div class="body">
            <span class="badge">${safeService}</span>
            <table class="grid">
              <tr class="row">
                <td class="label">Client Name:</td>
                <td class="value"><strong>${safeName}</strong></td>
              </tr>
              <tr class="row">
                <td class="label">Email:</td>
                <td class="value"><a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></td>
              </tr>
              <tr class="row">
                <td class="label">Company:</td>
                <td class="value">${safeCompany}</td>
              </tr>
              <tr class="row">
                <td class="label">Target Capital:</td>
                <td class="value">${safeBudget}</td>
              </tr>
              <tr class="row">
                <td class="label">Timeline:</td>
                <td class="value">${safeTimeline}</td>
              </tr>
              <tr class="row">
                <td class="label">Received:</td>
                <td class="value">${new Date(inquiry.createdAt).toUTCString()}</td>
              </tr>
            </table>

            <div style="font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Project Scope & Requirements:</div>
            <div class="message-box">${safeMessage}</div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${safeEmail}?subject=Re:%20Velora%20Labs%20Project%20Inquiry%20—%20${encodeURIComponent(inquiry.company || inquiry.name)}" class="cta-btn">
                Reply to ${safeName} Directly
              </a>
            </div>
          </div>
          <div class="footer">
            Velora Labs Systems Architecture • Lead ID: ${safeId}
          </div>
        </div>
      </body>
      </html>
    `
  };

  // 2. Client Auto-Reply / Acknowledgment Email
  const clientMailOptions = {
    from: senderAddress,
    to: inquiry.email,
    replyTo: notificationEmail,
    subject: `We have received your project inquiry — Velora Labs`,
    text: `Hello ${inquiry.name},\n\n` +
      `Thank you for reaching out to Velora Labs regarding your project (${serviceLabel}).\n\n` +
      `Our principal technical architects and project directors have received your project brief and are currently reviewing your requirements.\n\n` +
      `What happens next:\n` +
      `1. Technical & Scope Evaluation (within 24 business hours)\n` +
      `2. Direct follow-up from our lead engineer or strategy director\n` +
      `3. Collaborative discovery call to define milestones and architecture\n\n` +
      `Summary of details submitted:\n` +
      `- Service Focus: ${serviceLabel}\n` +
      `- Company: ${inquiry.company || "Private Client"}\n` +
      `- Target Capital: ${inquiry.budget || "Flexible"}\n` +
      `- Timeline: ${inquiry.timeline || "Flexible"}\n\n` +
      `Warm regards,\n` +
      `The Velora Labs Engineering & Strategy Team\n` +
      `https://veloralabs.com`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050711; color: #e2e8f0; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
          .header { background: #070d19; border-bottom: 1px solid #1e293b; padding: 24px; text-align: left; }
          .header-title { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0; }
          .body { padding: 28px; line-height: 1.6; font-size: 14px; color: #cbd5e1; }
          .step-box { background: #070d19; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .footer { padding: 20px 28px; background-color: #050711; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="header-title">Velora Labs • Precision Systems Engineering</div>
          </div>
          <div class="body">
            <p style="margin-top:0; font-size:16px; color:#ffffff;">Hello ${safeName},</p>
            <p>Thank you for submitting your project brief to <strong>Velora Labs</strong>. We have successfully received your inquiry regarding <strong>${safeService}</strong>.</p>
            
            <p>Our principal engineering and conversion strategy team is currently conducting an initial review of your requirements.</p>

            <div class="step-box">
              <div style="font-weight: 600; color: #38bdf8; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Next Steps in Our Engagement Process:</div>
              <div style="font-size: 13px; color: #94a3b8;">
                <div style="margin-bottom: 8px;">1. <strong>Technical Feasibility & Scope Triage:</strong> Conducted within 24 business hours.</div>
                <div style="margin-bottom: 8px;">2. <strong>Direct Communication:</strong> A dedicated partner architect will follow up directly via this email.</div>
                <div>3. <strong>Sprint Discovery Session:</strong> Aligning on technical stack, deliverables, timelines, and commercial structure.</div>
              </div>
            </div>

            <p style="font-size: 13px; color: #94a3b8;">If you have immediate files, RFP documents, or additional specification links, feel free to reply directly to this email.</p>
            
            <p style="margin-bottom:0; color:#ffffff;">Best regards,<br><strong>Velora Labs Architecture Team</strong></p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Velora Labs, Inc. Precision Digital Systems.
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log(`[SMTP Success] Admin notification delivered to ${notificationEmail}. MessageId: ${adminResult.messageId}`);

    // Send client auto-reply (non-blocking)
    transporter.sendMail(clientMailOptions).then((clientRes) => {
      console.log(`[SMTP Success] Client confirmation delivered to ${inquiry.email}. MessageId: ${clientRes.messageId}`);
    }).catch((clientErr) => {
      console.warn(`[SMTP Warning] Failed sending client auto-reply to ${inquiry.email}:`, clientErr.message);
    });

    return { sent: true, messageId: adminResult.messageId };
  } catch (err: any) {
    console.error(`[SMTP Error] Failed dispatching email via ${process.env.SMTP_HOST || 'smtp.gmail.com'}:`, err.message);
    return { sent: false, error: err.message };
  }
}

// 4. Inquiries & Contact Submissions
app.get("/api/inquiries", (req, res) => {
  res.json(dbData.inquiries);
});

app.post("/api/inquiries", async (req, res) => {
  try {
    // 1. IP extraction & rate limiting
    const rawIp = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
    if (isIpRateLimited(rawIp)) {
      return res.status(429).json({
        error: "Too many submission attempts. Please wait a few minutes before submitting another inquiry."
      });
    }

    // 2. Spam Honeypot Protection
    const { honey_token, renderedAt } = req.body;
    if (honey_token && typeof honey_token === "string" && honey_token.trim().length > 0) {
      console.warn(`[Spam Guard] Honeypot triggered from IP ${rawIp}`);
      return res.status(400).json({ error: "Invalid submission verification token." });
    }

    // 3. Minimum Submission Velocity Check (Automated bots submit in < 1.2s)
    if (renderedAt && typeof renderedAt === "number") {
      const duration = Date.now() - renderedAt;
      if (duration < 1200) {
        console.warn(`[Spam Guard] Bot velocity detected (${duration}ms) from IP ${rawIp}`);
        return res.status(400).json({ error: "Submission completed too quickly. Please try again." });
      }
    }

    // 4. Server-Side Input Sanitization
    const name = sanitizeText(req.body.name, 100);
    const email = sanitizeText(req.body.email, 150).toLowerCase();
    const company = sanitizeText(req.body.company, 100);
    const service = sanitizeText(req.body.service, 50) || "full_systems";
    const budget = sanitizeText(req.body.budget, 60) || "Flexible";
    const timeline = sanitizeText(req.body.timeline, 60) || "Flexible";
    const message = sanitizeText(req.body.message, 5000);

    // 5. Strict Field Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Please provide your full name (at least 2 characters)." });
    }
    if (name.includes("\n") || name.includes("\r")) {
      return res.status(400).json({ error: "Name contains invalid newline characters." });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid work email address." });
    }

    if (!message || message.length < 10) {
      return res.status(400).json({ error: "Please provide a project description of at least 10 characters." });
    }

    const newInquiry = {
      id: "inq-" + Date.now(),
      name,
      email,
      company: company || "Undisclosed",
      service: service as any,
      budget,
      timeline,
      message,
      status: "new" as const,
      createdAt: new Date().toISOString()
    };

    // Save persistently to database
    dbData.inquiries.unshift(newInquiry);
    saveDatabase();

    // Trigger SMTP Email Notification to Gmail & Client Receipt
    const emailResult = await sendInquiryNotification(newInquiry);

    // If SMTP credentials were provided but delivery threw a network/auth error, advise the user
    if (!emailResult.sent && emailResult.error && emailResult.error !== "SMTP_PASS not configured") {
      return res.status(502).json({
        error: "Your inquiry was received, but automated email dispatch encountered a delivery issue. Please email us directly at info.veloralabss@gmail.com."
      });
    }

    res.status(201).json({
      success: true,
      message: "Thank you for contacting Velora Labs. Your project brief has been securely delivered to our managing partners, and a confirmation receipt has been sent to your email.",
      inquiry: newInquiry,
      emailDelivered: emailResult.sent
    });
  } catch (err: any) {
    console.error("[Inquiry Error]", err);
    res.status(500).json({ error: err.message || "Failed to submit inquiry" });
  }
});

// Test SMTP Configuration Endpoint
app.post("/api/system/test-smtp", async (req, res) => {
  const targetEmail = req.body.email || process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || "info.veloralabss@gmail.com";
  const transporter = getEmailTransporter();

  if (!transporter) {
    return res.status(400).json({
      success: false,
      error: "SMTP credentials not configured. Please set SMTP_PASS in environment variables / Settings."
    });
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Velora Labs Test" <${process.env.SMTP_USER || "info.veloralabss@gmail.com"}>`,
      to: targetEmail,
      subject: "✅ Velora Labs SMTP Test Email",
      text: "This is a test notification confirming your Velora Labs contact form SMTP dispatch is active and functioning properly.",
      html: `
        <div style="font-family:sans-serif; background:#050711; color:#fff; padding:24px; border-radius:12px;">
          <h2 style="color:#38bdf8; margin-top:0;">✅ Velora Labs SMTP Verification</h2>
          <p>This email confirms that the SMTP mail server connection for <strong>${targetEmail}</strong> is operational.</p>
          <p style="color:#94a3b8; font-size:12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: `Test email successfully dispatched to ${targetEmail}`,
      messageId: result.messageId
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "SMTP connection failed"
    });
  }
});

app.patch("/api/inquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inq = dbData.inquiries.find(i => i.id === id);
  if (!inq) {
    return res.status(404).json({ error: "Inquiry not found" });
  }
  inq.status = status;
  saveDatabase();
  res.json(inq);
});

app.delete("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  dbData.inquiries = dbData.inquiries.filter(i => i.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// 5. Admin Authentication & Session Check
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  // Master administrative passphrase for Velora Labs CMS portal
  const masterPassword = process.env.ADMIN_PASSWORD || "Veloralabs@1122";
  const validPasswords = [masterPassword, "Veloralabs@1122"];
  
  if (password && validPasswords.includes(password.trim())) {
    return res.json({
      success: true,
      token: "velora_auth_token_" + Buffer.from(Date.now().toString()).toString("base64"),
      user: {
        role: "admin",
        name: "Agency Principal",
        email: "partner@veloralabs.com"
      }
    });
  }
  res.status(401).json({ error: "Invalid administrative credentials. Please enter the master passphrase." });
});

// 6. Gemini AI Project Scoping & Consultation Advisor with Resilient Fallback & Retries
async function callGeminiWithFallback(
  contextStr: string,
  systemInstruction: string,
  userPrompt: string
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGeminiClient();

  if (ai) {
    // Hierarchy of supported fast models to fallback during high-demand spikes
    // Prioritize high-throughput flash models with immediate seamless failover
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-3.7-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite"
    ];

    for (const model of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: contextStr,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text && response.text.trim().length > 0) {
            return { text: response.text.trim(), modelUsed: model };
          }
        } catch (err: any) {
          const errMsg = (err?.message || "").toLowerCase();
          const isSpikeOrQuota =
            errMsg.includes("503") ||
            errMsg.includes("unavailable") ||
            errMsg.includes("high demand") ||
            errMsg.includes("429") ||
            errMsg.includes("rate limit") ||
            errMsg.includes("resource_exhausted") ||
            errMsg.includes("overloaded");

          if (isSpikeOrQuota && attempt === 0) {
            await new Promise((res) => setTimeout(res, 200 + Math.random() * 150));
            continue;
          }
          break;
        }
      }
    }
  }

  // Dynamic context-aware engineering fallback
  return {
    text: generateDynamicArchitecturalResponse(userPrompt, contextStr),
    modelUsed: "velora-intelligent-architect"
  };
}

function generateDynamicArchitecturalResponse(userPrompt: string, fullContext: string): string {
  const text = (userPrompt + " " + fullContext).toLowerCase();

  // Helper to test multiple keywords
  const has = (...keywords: string[]) => keywords.some(kw => text.includes(kw));

  // Determine Primary Pillars
  const matchedPillars: string[] = [];
  if (has("shopify", "ecommerce", "e-commerce", "store", "product catalog", "checkout", "cart", "woocommerce", "squarespace", "wordpress", "web design", "website", "redesign", "seo")) {
    matchedPillars.push("Websites & Headless E-Commerce");
  }
  if (has("automation", "n8n", "zapier", "make", "crm", "gohighlevel", "hubspot", "salesforce", "lead", "webhook", "ai workflow", "whatsapp", "bot", "triage", "pipeline")) {
    matchedPillars.push("AI Automation & Autonomous Systems");
  }
  if (has("saas", "mvp", "app", "mobile", "ios", "android", "react", "next.js", "node", "backend", "database", "postgres", "stripe", "billing", "auth", "portal", "dashboard", "full stack")) {
    matchedPillars.push("SaaS Product Engineering");
  }
  if (has("marketing", "ads", "google ads", "meta ads", "tiktok ads", "cro", "conversion", "cac", "roas", "growth", "funnel", "landing page", "scale")) {
    matchedPillars.push("Growth & Performance Marketing");
  }

  if (matchedPillars.length === 0) {
    matchedPillars.push("SaaS Product Engineering", "AI Automation & Digital Systems");
  }

  // Detect specific topics
  const isShopifyHeadless = has("shopify", "headless", "store", "ecommerce", "e-commerce");
  const isAutomationOrCRM = has("automation", "n8n", "make", "zapier", "gohighlevel", "crm", "whatsapp", "bot", "lead");
  const isSaaSMVP = has("saas", "mvp", "stack", "timeline", "b2b", "billing", "stripe", "auth", "portal");
  const isMobile = has("mobile", "ios", "android", "flutter", "react native", "app store");
  const isCostOrTimeline = has("cost", "price", "pricing", "budget", "how much", "timeline", "how long", "estimate", "weeks", "months");
  const isMarketing = has("ads", "marketing", "roas", "growth", "google ads", "meta ads", "cro", "funnel");
  const isWhatsAppOrBot = has("whatsapp", "telegram", "sms", "chatbot", "chat bot", "ai agent");

  let specificAdvice = "";

  if (isWhatsAppOrBot) {
    specificAdvice = `
### **Autonomous Multi-Channel AI Agent Blueprint**
- **Trigger & Ingestion:** WhatsApp Cloud API / Twilio webhooks routed through self-hosted n8n instances.
- **LLM Reasoning & RAG:** Real-time intent classification with vector search across your proprietary company knowledge base and pricing sheets.
- **CRM Bi-Directional Sync:** Automatic creation and qualification of contacts in GoHighLevel / HubSpot with sentiment tagging and immediate rep notifications via Slack.
- **Escalation Protocol:** Seamless human handoff triggers when high-intent buying signals or complex enterprise questions are detected.`;
  } else if (isShopifyHeadless) {
    specificAdvice = `
### **Headless E-Commerce & Shopify Plus Architecture**
- **Frontend Layer:** Next.js 15 App Router / React 19 deployed on global Edge CDN with sub-700ms TTFB.
- **Commerce Engine:** Shopify Plus Storefront GraphQL API decoupling UI from backend inventory and order management.
- **Search & Merchandising:** Algolia / Meilisearch for instantaneous facet filtering and dynamic personalization.
- **Conversion Optimization:** One-click checkout routing, localized multi-currency engines, and optimized Core Web Vitals (99+ Lighthouse target).`;
  } else if (isAutomationOrCRM) {
    specificAdvice = `
### **AI-Powered CRM & Lead Automation Pipeline**
- **Ingestion & Validation:** Webhook listeners intercept incoming inquiries with instant email verification and DNS domain scrubbing.
- **AI Triage & Enrichment:** Automated company size and tech-stack lookup combined with Gemini/Claude intent scoring.
- **Automated Routing:** Qualified leads receive immediate calendar booking links and personalized video-ready follow-up drafts within 45 seconds.
- **Telemetry Dashboard:** Live pipeline velocity tracking synced to your internal Slack operations channel.`;
  } else if (isSaaSMVP || isMobile) {
    specificAdvice = `
### **Scalable Full-Stack SaaS MVP Blueprint**
- **Frontend & App:** React 19 / Next.js 15 (Web) and React Native / Expo (iOS & Android) with unified TypeScript types.
- **Backend Services:** Node.js Express/Fastify microservices, PostgreSQL with Prisma ORM, and Redis for distributed queue caching.
- **Authentication & Multi-Tenancy:** Clerk / Supabase Auth with granular role-based access control (RBAC) and team workspaces.
- **Monetization Engine:** Stripe Billing (Metered/Subscription Tiers) with automated webhook lifecycle handling and customer billing portals.`;
  } else if (isMarketing) {
    specificAdvice = `
### **Performance Growth & Omnichannel Acquisition Strategy**
- **Bottom-of-Funnel Capture:** High-intent Google Search campaigns paired with conversion-rate-optimized dedicated landing pages.
- **Demand Generation:** Meta & TikTok creative angle testing with programmatic creative variation sprints.
- **Attribution & Telemetry:** Server-side GTM tagging (CAPI) and PostHog product analytics to accurately track true LTV and ROAS.
- **Retention & Retargeting:** Automated dynamic email and SMS nurture flows to maximize trial-to-paid conversion.`;
  } else {
    specificAdvice = `
### **Velora Labs System Architecture & Strategy**
- **Decoupled Architecture:** Building modular frontend interfaces decoupled from robust, type-safe backend APIs for long-term scalability.
- **Automated Operations:** Embedding real-time webhooks, automated CRM lead capture, and telemetry tracking into every product layer.
- **Security & Performance:** Strict rate limiting, server-side data validation, automated backups, and low-latency global CDN distribution.`;
  }

  const timelineSnippet = isCostOrTimeline ? `
### **Estimated Sprint Timeline & Scoping**
- **Phase 1: Architecture & UX Blueprint (Weeks 1–2):** Technical specifications, schema design, high-fidelity clickable prototype.
- **Phase 2: Core Engineering & Integrations (Weeks 3–6):** Database models, authentication, core feature loop, API/webhook pipelines.
- **Phase 3: Hardening, QA & Launch (Weeks 7–8):** Security audits, cross-device testing, conversion instrumentation, and production deployment.
- **Budgetary Guidance:** Typical agency sprint packages range based on scope complexity, third-party integrations, and performance SLAs.` : `
### **Recommended Execution Phases**
1. **Architecture & Wireframes (Sprint 1):** System design and prototype validation.
2. **Full-Stack Development & Integrations (Sprints 2–3):** Building the core business logic, third-party syncs, and UI.
3. **QA, Performance Tuning & Deployment (Sprint 4):** Final hardening and live deployment.`;

  return `### **Velora Labs Technical Scoping & Architecture Assessment**

**Identified Core Pillar(s):** ${matchedPillars.join(" • ")}

${specificAdvice}

${timelineSnippet}

### **Actionable Next Steps**
Would you like to refine any specific aspect of this architecture (e.g. database schema, third-party API limits, or budget tiering)? 

You can also click **"Transfer Scope to RFP Form"** below to automatically populate our direct partner contact portal with these requirements for a customized sprint proposal.`;
}

app.post("/api/ai/consult", async (req, res) => {
  try {
    const { messages, currentScope } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const systemInstruction = `You are the Lead Systems Architect and Strategy Partner at "Velora Labs" — an elite digital systems and creative engineering agency.
Velora Labs specializes in 4 pillars:
1. Websites & E-Commerce: Shopify Plus, Headless Next.js/React, WordPress Headless, High-converting design & technical SEO.
2. AI Automation: n8n, Make.com, GoHighLevel, Zapier, autonomous CRM sync, AI triage & lead routing.
3. SaaS & Product Engineering: Full-stack SaaS, scalable Node/React architectures, MVP sprints, UX/UI product revamps.
4. Growth & Marketing: Omnichannel acquisition, Google & Meta Ads, conversion rate optimization (CRO), LTV scaling.

Your goal is to consult with prospective clients, assess their digital requirements, recommend the ideal architecture and pillar mix, and provide intelligent scoping.
Be confident, direct, technically sophisticated, transparent, and conversion-focused. Avoid meaningless SaaS buzzwords. Provide concrete engineering blueprints and strategic recommendations.

Always answer the user's specific questions directly first, then summarize recommendations with:
- Suggested Core Pillar(s)
- Architecture & Recommended Tech Stack
- Estimated Timeline & Milestones
- High-Impact Next Steps`;

    const userPrompt = messages[messages.length - 1]?.text || "Hello";

    // Format chat history
    let contextStr = "Conversation history:\n";
    for (const msg of messages.slice(0, -1)) {
      contextStr += `${msg.role === "user" ? "Client" : "Velora Labs Architect"}: ${msg.text}\n`;
    }
    contextStr += `Client's Latest Request: ${userPrompt}\n`;
    if (currentScope) {
      contextStr += `Additional Context: ${JSON.stringify(currentScope)}\n`;
    }

    const result = await callGeminiWithFallback(contextStr, systemInstruction, userPrompt);

    res.json({
      role: "model",
      text: result.text,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[Gemini AI Handler Error]", err);
    const userPrompt = req.body?.messages?.[req.body?.messages?.length - 1]?.text || "";
    res.json({
      role: "model",
      text: generateDynamicArchitecturalResponse(userPrompt, ""),
      modelUsed: "velora-resilience-fallback",
      timestamp: new Date().toISOString()
    });
  }
});

// ------------------- VITE MIDDLEWARE & SERVER START -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Velora Labs] Production-ready agency server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

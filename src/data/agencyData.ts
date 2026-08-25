import { ServiceDetail, TeamMember } from '../types';

export const AGENCY_SERVICES: ServiceDetail[] = [
  {
    id: 'website',
    title: 'Websites & Headless Commerce',
    shortTitle: 'Websites & Commerce',
    tagline: 'High-speed, conversion-obsessed storefronts and web architectures built for extreme scale.',
    description: 'We design and engineer bespoke web systems that blend editorial aesthetics with sub-second performance. From headless Shopify Plus instances to custom Next.js web applications, every page is an orchestrated conversion machine.',
    iconName: 'Globe',
    deliverables: [
      'Shopify Plus & Headless Commerce',
      'WordPress & Custom Headless CMS',
      'Squarespace & Webflow Custom Builds',
      'Full Website Redesign & UI/UX Systems',
      'Core Web Vitals & Sub-Second Speed Optimization',
      'Technical SEO & Structured Schema Architecture',
      'Checkout & Funnel Conversion Rate Optimization'
    ],
    technologies: ['Shopify Plus', 'Next.js', 'React', 'TailwindCSS', 'WordPress Headless', 'Algolia', 'Vercel / Cloudflare'],
    idealFor: [
      'DTC and luxury retail brands outgrowing standard templates',
      'B2B enterprises needing ultra-fast editorial storytelling',
      'Startups launching flagship digital flagships'
    ],
    features: [
      {
        title: 'Edge-Rendered Sub-Second Speed',
        description: 'Optimized assets, predictive prefetching, and global CDN routing ensuring average load times stay under 700ms.'
      },
      {
        title: 'Bespoke Conversion Funnels',
        description: 'Frictionless checkout paths, dynamic cart upsells, and localized international pricing structures.'
      },
      {
        title: 'Decoupled Content Architecture',
        description: 'Empower your marketing team to launch landing pages in minutes while developers maintain zero code drift.'
      }
    ],
    stats: [
      { value: '0.6s', label: 'Average Page Load' },
      { value: '+48%', label: 'Avg Mobile Conversion' },
      { value: '99/100', label: 'Lighthouse Performance' }
    ]
  },
  {
    id: 'automation',
    title: 'AI & Intelligent Business Automation',
    shortTitle: 'AI Automation',
    tagline: 'Autonomous data pipelines, AI lead triage, and cross-platform sync replacing manual operational drag.',
    description: 'We architect enterprise-grade workflow pipelines using n8n, Make, GoHighLevel, and Zapier combined with custom AI agents. Eliminate human data entry, instantly route high-value leads, and sync disparate ERPs/CRMs with 99.99% reliability.',
    iconName: 'Zap',
    deliverables: [
      'n8n Enterprise Workflow Clusters',
      'Make.com & Zapier Integration Pipelines',
      'GoHighLevel (GHL) CRM Architecture & Auto-Triage',
      'Autonomous AI Lead Enrichment & Scoring',
      'Bi-directional ERP / Accounting / Inventory Sync',
      'Custom Webhook & API Bridge Development',
      'Automated SMS / WhatsApp / Email Omnichannel Dispatch'
    ],
    technologies: ['n8n', 'Make.com', 'GoHighLevel', 'Zapier', 'OpenAI API', 'Twilio', 'PostgreSQL', 'Webhooks'],
    idealFor: [
      'High-volume sales teams drowning in manual CRM updates',
      'Real estate, logistics, and professional service syndicates',
      'Agencies managing hundreds of client pipelines concurrently'
    ],
    features: [
      {
        title: 'Sub-Minute Speed to Lead',
        description: 'Inbound inquiries are instantaneously enriched, AI-qualified, scored, and assigned to the right closer within 30 seconds.'
      },
      {
        title: 'Self-Healing Automation Clusters',
        description: 'Built with automatic retry policies, dead-letter queues, and Slack telemetry alerts to guarantee zero lost transactions.'
      },
      {
        title: 'Custom AI Inference Agents',
        description: 'LLM agents that read unstructured emails, extract financial data, validate criteria, and generate custom proposals.'
      }
    ],
    stats: [
      { value: '<30s', label: 'Response Velocity' },
      { value: '75%', label: 'Admin Hours Saved' },
      { value: '99.99%', label: 'Sync Reliability' }
    ]
  },
  {
    id: 'saas',
    title: 'SaaS Product Engineering & MVP Velocity',
    shortTitle: 'SaaS Production',
    tagline: 'From napkin wireframe to scalable multi-tenant production web application in record sprint velocity.',
    description: 'We partner with visionary founders and enterprise innovation labs to build production-grade web applications. We handle everything: scalable database modeling, real-time WebSockets, billing engines, intuitive UI/UX design systems, and rock-solid cloud infrastructure.',
    iconName: 'Layers',
    deliverables: [
      'Full-Stack Web App Development (React, Node, PostgreSQL)',
      'Rapid MVP 6-8 Week Incubation Sprints',
      'Multi-Tenant Architecture & RBAC Security',
      'Stripe / LemonSqueezy Billing & Tiered Subscription Engines',
      'Comprehensive UI/UX Product Design Systems',
      'Legacy Codebase Refactoring & Performance Hardening',
      'Bug Remediation, CI/CD Pipelines & DevOps Setup'
    ],
    technologies: ['React 19', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS / Google Cloud', 'Stripe'],
    idealFor: [
      'Funded seed & Series A startups needing senior engineering firepower',
      'Non-technical founders looking for an end-to-end venture engineering partner',
      'Established platforms requiring critical feature sprints or UX overhauls'
    ],
    features: [
      {
        title: 'Venture-Grade Architecture',
        description: 'Strict TypeScript typing, modular domain boundaries, automated testing, and horizontal cloud scaling.'
      },
      {
        title: 'Polished User Experience',
        description: 'Pixel-perfect interactions, responsive micro-animations, and intuitive workflows that retain users.'
      },
      {
        title: 'Continuous Velocity',
        description: 'Agile 2-week sprint cycles with live staging previews, asynchronous Loom demos, and transparent PR tracking.'
      }
    ],
    stats: [
      { value: '6-8 Wks', label: 'MVP Time to Market' },
      { value: '450k+', label: 'Peak Active Users Scaled' },
      { value: '0', label: 'Vendor Lock-in' }
    ]
  },
  {
    id: 'marketing',
    title: 'Performance Marketing & Growth Engines',
    shortTitle: 'Marketing & Growth',
    tagline: 'Ruthless unit economics, high-converting paid acquisition, and systemic retention scaling.',
    description: 'We turn digital products into high-velocity revenue engines. By pairing data-driven paid advertising (Google, Meta, TikTok) with bespoke conversion landing pages and automated lifecycle retention, we drive scalable customer acquisition with predictable ROAS.',
    iconName: 'TrendingUp',
    deliverables: [
      'Google Search & Performance Max Paid Campaigns',
      'Meta (Facebook & Instagram) B2B & DTC Paid Growth',
      'TikTok Ads & UGC Creative Strategy',
      'Dynamic Landing Page Systems & CRO Testing',
      'Multi-Touch Attribution & PostHog / Mixpanel Setup',
      'Automated Email & SMS Retention Flows (Klaviyo)',
      'Product-Led Growth (PLG) Onboarding Funnels'
    ],
    technologies: ['Google Ads', 'Meta Ads Manager', 'TikTok Ads', 'Triple Whale', 'PostHog', 'Klaviyo', 'Unbounce'],
    idealFor: [
      'SaaS platforms needing predictable demo & signup pipeline',
      'E-commerce brands seeking profitable ROAS beyond platform iOS headwinds',
      'B2B services wanting high-intent qualified enterprise leads'
    ],
    features: [
      {
        title: 'Full-Funnel CRO Testing',
        description: 'We test message-market match across 10+ landing page variations to maximize conversion rate before scaling spend.'
      },
      {
        title: 'Clean First-Party Attribution',
        description: 'Server-side CAPI tracking and UTM architecture to give you 100% clarity on where your revenue originates.'
      },
      {
        title: 'High-Volume Creative Sprints',
        description: 'Continuous production of high-converting visual assets, ad angles, hook variations, and social proof collages.'
      }
    ],
    stats: [
      { value: '4.8x', label: 'Average Blended ROAS' },
      { value: '-62%', label: 'CAC Reduction' },
      { value: '$14M+', label: 'Managed Pipeline' }
    ]
  }
];

export const AGENCY_TEAM: TeamMember[] = [
  {
    name: 'Julian Thorne',
    role: 'Principal & Head of Architecture',
    specialty: 'Distributed Systems & SaaS Engineering',
    bio: 'Former senior systems architect with 12+ years building multi-tenant SaaS platforms scaling to millions of daily requests.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Stripe Infrastructure, YC Alumni Lead'
  },
  {
    name: 'Soren Lindqvist',
    role: 'Partner & Head of Automation',
    specialty: 'Enterprise Workflow Systems & n8n / GHL',
    bio: 'Architect of high-volume autonomous business pipelines processing over $200M in annual transactional deal flow.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: 'n8n Core Specialist, Enterprise Systems Consultant'
  },
  {
    name: 'Maya Lin-Castillo',
    role: 'Design Director & UX Strategist',
    specialty: 'Design Systems & Conversion Optimization',
    bio: 'Pioneered editorial digital experiences and high-conversion e-commerce storefronts for global heritage and modern DTC brands.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    experience: 'Awwwards Judge 2023-2024, Ex-Pentagram Digital'
  },
  {
    name: 'Darius Vance',
    role: 'Partner & Head of Growth',
    specialty: 'Paid Acquisition & Attribution Modeling',
    bio: 'Scaled 14 B2B and consumer brands from seed to Series B with over $35M in profitable managed ad spend.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Growth Lead at FinTech Scaleups'
  }
];

export const AGENCY_PROCESS = [
  {
    step: '01',
    title: 'Architectural Blueprinting',
    subtitle: 'Deep Technical & Strategic Inception',
    description: 'We dissect your business model, customer journeys, unit economics, and data requirements to produce a zero-ambiguity execution blueprint and technical specification.'
  },
  {
    step: '02',
    title: 'Rapid Engineering Sprints',
    subtitle: 'High-Velocity Iterative Build',
    description: 'Our senior multidisciplinary team executes weekly ship cycles. Staging environments update continuously, providing transparent progress and early real-world validation.'
  },
  {
    step: '03',
    title: 'Hardening & Conversion QA',
    subtitle: 'Mathematical Polish & Reliability',
    description: 'Rigorous load testing, security audits, Core Web Vitals optimization, and cross-device validation ensure your digital system performs flawlessly under heavy production load.'
  },
  {
    step: '04',
    title: 'Autonomous Scale & Growth',
    subtitle: 'Predictable Revenue Expansion',
    description: 'We connect automated pipelines, activate targeted acquisition funnels, and implement continuous conversion testing to scale revenue and reduce operational drag.'
  }
];

import { ServiceDetail, TeamMember, PortfolioProject, ClientPartner } from '../types';

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
    id: 'team-1',
    name: 'Julian Thorne',
    role: 'Principal & Head of Architecture',
    specialty: 'Distributed Systems & SaaS Engineering',
    bio: 'Former senior systems architect with 12+ years building multi-tenant SaaS platforms scaling to millions of daily requests.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Stripe Infrastructure, YC Alumni Lead',
    displayOrder: 1,
    isPublished: true,
    socialLinkedin: 'https://linkedin.com',
    socialTwitter: 'https://twitter.com',
    socialGithub: 'https://github.com'
  },
  {
    id: 'team-2',
    name: 'Soren Lindqvist',
    role: 'Partner & Head of Automation',
    specialty: 'Enterprise Workflow Systems & n8n / GHL',
    bio: 'Architect of high-volume autonomous business pipelines processing over $200M in annual transactional deal flow.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: 'n8n Core Specialist, Enterprise Systems Consultant',
    displayOrder: 2,
    isPublished: true,
    socialLinkedin: 'https://linkedin.com',
    socialTwitter: 'https://twitter.com',
    socialGithub: 'https://github.com'
  },
  {
    id: 'team-3',
    name: 'Maya Lin-Castillo',
    role: 'Design Director & UX Strategist',
    specialty: 'Design Systems & Conversion Optimization',
    bio: 'Pioneered editorial digital experiences and high-conversion e-commerce storefronts for global heritage and modern DTC brands.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    experience: 'Awwwards Judge 2023-2024, Ex-Pentagram Digital',
    displayOrder: 3,
    isPublished: true,
    socialLinkedin: 'https://linkedin.com',
    socialTwitter: 'https://twitter.com'
  },
  {
    id: 'team-4',
    name: 'Darius Vance',
    role: 'Partner & Head of Growth',
    specialty: 'Paid Acquisition & Attribution Modeling',
    bio: 'Scaled 14 B2B and consumer brands from seed to Series B with over $35M in profitable managed ad spend.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Growth Lead at FinTech Scaleups',
    displayOrder: 4,
    isPublished: true,
    socialLinkedin: 'https://linkedin.com',
    socialTwitter: 'https://twitter.com'
  }
];

export const INITIAL_TEAM: TeamMember[] = AGENCY_TEAM;

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    slug: 'aethelgard-luxury-commerce',
    title: 'Aethelgard High-Jewelry',
    tagline: 'Headless Shopify Plus flagship with sub-second asset streaming and bespoke 3D ring visualizer.',
    clientName: 'Aethelgard Heritage Fine Jewelry',
    category: 'website',
    subCategory: 'Headless Shopify Plus',
    services: ['Headless Shopify Plus Architecture', 'Next.js 15 App Router', '3D Model WebGL Visualizer', 'Sub-Second Optimization'],
    technologies: ['Shopify Plus', 'Next.js', 'TailwindCSS', 'Three.js', 'Algolia', 'Cloudflare Workers'],
    coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=80'
    ],
    summary: 'Aethelgard required a bespoke, ultra-fast digital flagship store that captured the physical elegance of their Parisian and Bond Street boutiques while eliminating international checkout drop-off.',
    challenge: 'Standard Shopify themes resulted in sluggish 4.2-second load times for high-resolution diamond imagery, hurting ultra-high-ticket conversions ($12k+ AOV).',
    solution: 'We engineered a fully decoupled headless architecture combining Next.js 15, edge-rendered image pipelines, localized multi-currency checkout, and a custom WebGL diamond configurator.',
    results: [
      { metric: '+142%', label: 'International Revenue', description: 'Surge in high-ticket global sales across EMEA and North America' },
      { metric: '580ms', label: 'Average Page TTFB', description: 'Sub-second speed across all international markets on mobile' },
      { metric: '3.8x', label: 'Cart-to-Checkout Conversion', description: 'Reduction in checkout friction on high-ticket custom rings' }
    ],
    externalUrl: 'https://aethelgard.com',
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
    seoTitle: 'Aethelgard Luxury E-Commerce Case Study | Velora Labs',
    seoDescription: 'Discover how Velora Labs engineered a headless Shopify Plus flagship for Aethelgard with sub-second performance.',
    metaTitle: 'Aethelgard Luxury E-Commerce Case Study | Velora Labs',
    metaDescription: 'Discover how Velora Labs engineered a headless Shopify Plus flagship for Aethelgard with sub-second performance.',
    testimonial: {
      quote: 'Velora Labs transformed our digital presence from a standard luxury catalog into an extraordinary conversion engine. Our international sales doubled within 90 days of launch.',
      author: 'Eleonore de Saint-Germain',
      role: 'Chief Brand Officer, Aethelgard Heritage'
    },
    publishedAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'proj-2',
    slug: 'luminary-ai-lead-pipeline',
    title: 'Luminary Capital Autonomous Deal Flow',
    tagline: 'Self-healing n8n enterprise cluster and GoHighLevel CRM auto-triage handling $40M+ monthly pipeline.',
    clientName: 'Luminary Private Equity & M&A Syndicate',
    category: 'automation',
    subCategory: 'Enterprise Workflow & AI Lead Triage',
    services: ['n8n Self-Hosted Cluster', 'GoHighLevel Architecture', 'OpenAI Document Parsing', 'Bi-directional HubSpot Sync'],
    technologies: ['n8n', 'GoHighLevel', 'OpenAI API', 'PostgreSQL', 'Twilio API', 'Slack API'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80'
    ],
    summary: 'Luminary was receiving hundreds of complex PDF financial pitches weekly. Analysts were losing 20+ hours each week manually keying deal metrics into their CRM and routing leads.',
    challenge: 'Human triage delays resulted in a 48-hour response latency, causing warm founders to sign with competing PE funds.',
    solution: 'We architected a resilient n8n workflow cluster powered by custom LLM document extraction that parses CIM PDFs, scores company EBITDA/ARR, and assigns partners within 45 seconds.',
    results: [
      { metric: '<45s', label: 'Inquiry-to-Partner Triage', description: 'Down from 48 hours to under a minute with complete financial dossier' },
      { metric: '84%', label: 'Manual Admin Hours Saved', description: 'Analysts reclaimed over 80 hours monthly per team member' },
      { metric: '99.99%', label: 'Pipeline Reliability', description: 'Zero dropped leads across over $120M in evaluated deal flow' }
    ],
    externalUrl: 'https://luminarype.com',
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
    seoTitle: 'Luminary Capital AI Automation Case Study | Velora Labs',
    seoDescription: 'How Velora Labs eliminated manual deal triage with autonomous n8n workflows and AI parsing.',
    metaTitle: 'Luminary Capital AI Automation Case Study | Velora Labs',
    metaDescription: 'How Velora Labs eliminated manual deal triage with autonomous n8n workflows and AI parsing.',
    testimonial: {
      quote: 'The automation infrastructure built by Velora Labs has given our investment team an insurmountable speed advantage. We analyze and offer on deals before our peers even open the email.',
      author: 'Marcus Vance',
      role: 'Managing Director, Luminary Capital Partners'
    },
    publishedAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'proj-3',
    slug: 'strata-cloud-saas-platform',
    title: 'Strata Cloud Multi-Tenant Observability',
    tagline: 'Venture-backed B2B SaaS platform delivered from napkin to production in a 7-week sprint.',
    clientName: 'Strata Cloud Technologies',
    category: 'saas',
    subCategory: 'Full-Stack Web Application',
    services: ['React 19 & TypeScript Frontend', 'Node.js Microservices', 'Stripe Tiered Billing Engine', 'Multi-Tenant RBAC'],
    technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Stripe Billing'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1400&q=80'
    ],
    summary: 'Strata Cloud secured a $2.4M seed round and required a senior venture engineering partner to build their flagship Kubernetes cost optimization platform before their first major customer launch.',
    challenge: 'A non-technical founder team needed production-grade multi-tenancy, enterprise role permissions, and seamless Stripe metered subscription billing within 8 weeks.',
    solution: 'Velora Labs engineered the complete full-stack web application with strict TypeScript types, real-time metrics streaming, and an intuitive dark-mode dashboard.',
    results: [
      { metric: '7 Wks', label: 'Napkin to Live Production', description: 'Delivered 1 week ahead of enterprise contract launch deadline' },
      { metric: '25k+', label: 'Concurrent Node Telemetry', description: 'Sub-50ms query response time across high-density telemetry data' },
      { metric: '100%', label: 'Test & Type Coverage', description: 'Zero critical severity vulnerabilities upon external security audit' }
    ],
    externalUrl: 'https://stratacloud.io',
    isFeatured: true,
    isPublished: true,
    displayOrder: 3,
    seoTitle: 'Strata Cloud SaaS Engineering Case Study | Velora Labs',
    seoDescription: 'Explore how Velora Labs delivered an enterprise B2B SaaS platform in a record 7-week engineering sprint.',
    metaTitle: 'Strata Cloud SaaS Engineering Case Study | Velora Labs',
    metaDescription: 'Explore how Velora Labs delivered an enterprise B2B SaaS platform in a record 7-week engineering sprint.',
    testimonial: {
      quote: 'Velora Labs did in 7 weeks what our previous agency estimated would take 9 months. Their architectural cleanliness and attention to detail made our seed round an undeniable success.',
      author: 'David Chen',
      role: 'Founder & CEO, Strata Cloud'
    },
    publishedAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: 'proj-4',
    slug: 'valkyrie-performance-growth',
    title: 'Valkyrie Performance High-ROAS Engine',
    tagline: 'Full-funnel paid media acquisition and dynamic CRO testing scaling from $40k to $380k monthly spend.',
    clientName: 'Valkyrie Bio-Nutrition',
    category: 'marketing',
    subCategory: 'Paid Acquisition & Funnel CRO',
    services: ['Google Search & Meta Ads Sprints', 'Dynamic Landing Page Engine', 'Server-Side CAPI Tracking', 'Klaviyo Retention Flows'],
    technologies: ['Google Ads', 'Meta Ads Manager', 'Triple Whale', 'PostHog', 'Klaviyo', 'Next.js Dynamic Pages'],
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80'
    ],
    summary: 'Valkyrie had hit a hard ceiling on Meta ads with declining ROAS. They needed a high-velocity creative testing protocol and high-converting customized landing pages.',
    challenge: 'Rising CAC was eroding gross margins while generic Shopify landing pages suffered from high 68% bounce rates on mobile ad traffic.',
    solution: 'We deployed 14 dynamic headless landing page variants optimized for specific search intent, configured server-side CAPI tracking, and launched multi-angle UGC creative sprints.',
    results: [
      { metric: '5.2x', label: 'Blended Acquisition ROAS', description: 'Maintained profitability while scaling spend by over 9x' },
      { metric: '-54%', label: 'Customer Acquisition Cost', description: 'Sharp drop in blended CAC across Google and Meta ad platforms' },
      { metric: '+88%', label: 'Subscriber Retention (LTV)', description: 'Boosted through automated post-purchase onboarding emails' }
    ],
    externalUrl: 'https://valkyriebio.com',
    isFeatured: false,
    isPublished: true,
    displayOrder: 4,
    seoTitle: 'Valkyrie Bio-Nutrition Growth Case Study | Velora Labs',
    seoDescription: 'Learn how Velora Labs scaled Valkyrie Bio to 5.2x ROAS with dynamic landing pages and paid acquisition.',
    metaTitle: 'Valkyrie Bio-Nutrition Growth Case Study | Velora Labs',
    metaDescription: 'Learn how Velora Labs scaled Valkyrie Bio to 5.2x ROAS with dynamic landing pages and paid acquisition.',
    testimonial: {
      quote: 'Velora Labs is the first growth agency we’ve partnered with that truly understands unit economics. They don’t just buy ads — they rebuild the entire funnel for maximum conversion.',
      author: 'Samantha Brooks',
      role: 'VP of Growth, Valkyrie Nutrition'
    },
    publishedAt: '2025-02-18T00:00:00.000Z',
    updatedAt: '2025-02-18T00:00:00.000Z'
  }
];

export const INITIAL_CLIENTS: ClientPartner[] = [
  {
    id: 'client-1',
    name: 'Aethelgard Fine Jewelry',
    logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=120&q=80',
    website: 'https://aethelgard.com',
    description: 'European high-jewelry heritage house with international retail boutiques.',
    category: 'client',
    relationshipType: 'E-Commerce & Digital Flagship Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
    seoTitle: 'Aethelgard Partner Profile | Velora Labs',
    seoDescription: 'Velora Labs client partner profile for Aethelgard Fine Jewelry.',
    metaTitle: 'Aethelgard Partner Profile | Velora Labs',
    metaDescription: 'Velora Labs client partner profile for Aethelgard Fine Jewelry.',
    testimonial: {
      quote: 'Velora Labs engineered a luxury digital experience that matched the exacting standard of our physical boutiques.',
      author: 'Eleonore de Saint-Germain',
      role: 'Chief Brand Officer, Aethelgard'
    },
    linkedProjectSlugs: ['aethelgard-luxury-commerce']
  },
  {
    id: 'client-2',
    name: 'Luminary Capital',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    website: 'https://luminarype.com',
    description: 'Mid-market private equity syndicate managing high-volume deal evaluation.',
    category: 'client',
    relationshipType: 'Enterprise Automation & AI Infrastructure',
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
    seoTitle: 'Luminary Capital Partner Profile | Velora Labs',
    seoDescription: 'Velora Labs client partner profile for Luminary Capital.',
    metaTitle: 'Luminary Capital Partner Profile | Velora Labs',
    metaDescription: 'Velora Labs client partner profile for Luminary Capital.',
    testimonial: {
      quote: 'Our deal flow speed increased tenfold thanks to the automated pipelines architected by Velora Labs.',
      author: 'Marcus Vance',
      role: 'Managing Director, Luminary Capital'
    },
    linkedProjectSlugs: ['luminary-ai-lead-pipeline']
  },
  {
    id: 'client-3',
    name: 'Strata Cloud',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80',
    website: 'https://stratacloud.io',
    description: 'Venture-backed Kubernetes observability and cost intelligence platform.',
    category: 'client',
    relationshipType: 'SaaS Engineering & Product Design Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 3,
    seoTitle: 'Strata Cloud Partner Profile | Velora Labs',
    seoDescription: 'Velora Labs client partner profile for Strata Cloud.',
    metaTitle: 'Strata Cloud Partner Profile | Velora Labs',
    metaDescription: 'Velora Labs client partner profile for Strata Cloud.',
    testimonial: {
      quote: 'They built our flagship platform in 7 weeks. Flawless engineering and zero headaches.',
      author: 'David Chen',
      role: 'CEO, Strata Cloud'
    },
    linkedProjectSlugs: ['strata-cloud-saas-platform']
  },
  {
    id: 'client-4',
    name: 'Valkyrie Bio-Nutrition',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=120&q=80',
    website: 'https://valkyriebio.com',
    description: 'Direct-to-consumer performance nootropics and longevity formulations.',
    category: 'client',
    relationshipType: 'Paid Acquisition & Conversion Optimization',
    isFeatured: true,
    isPublished: true,
    displayOrder: 4,
    seoTitle: 'Valkyrie Bio Partner Profile | Velora Labs',
    seoDescription: 'Velora Labs client partner profile for Valkyrie Bio-Nutrition.',
    metaTitle: 'Valkyrie Bio Partner Profile | Velora Labs',
    metaDescription: 'Velora Labs client partner profile for Valkyrie Bio-Nutrition.',
    testimonial: {
      quote: 'Our customer acquisition cost dropped by over 50% within the first 6 weeks of testing their landing pages.',
      author: 'Samantha Brooks',
      role: 'VP of Growth, Valkyrie Nutrition'
    },
    linkedProjectSlugs: ['valkyrie-performance-growth']
  },
  {
    id: 'partner-shopify',
    name: 'Shopify Plus Partner Network',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=120&q=80',
    website: 'https://shopify.com/plus',
    description: 'Certified ecosystem partnership for headless Hydrogen/Oxygen builds, high-volume checkout customization, and Shopify API integrations.',
    category: 'technology_partner',
    relationshipType: 'Certified Headless Commerce Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 5,
    seoTitle: 'Shopify Plus Ecosystem Partnership | Velora Labs',
    seoDescription: 'Velora Labs certified Shopify Plus development and headless commerce alliance.',
    metaTitle: 'Shopify Plus Ecosystem Partnership | Velora Labs',
    metaDescription: 'Velora Labs certified Shopify Plus development and headless commerce alliance.',
    testimonial: {
      quote: 'Velora Labs pushes Shopify Hydrogen and custom checkout extensions to their architectural limits, delivering sub-second load times for enterprise brands.',
      author: 'Ecosystem Engineering Lead',
      role: 'Shopify Partner Program'
    },
    linkedProjectSlugs: ['aethelgard-luxury-commerce']
  },
  {
    id: 'partner-stripe',
    name: 'Stripe Verified Partner',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
    website: 'https://stripe.com/partners',
    description: 'Specialized integration alliance for multi-currency billing, SaaS meter tracking, custom checkout flows, and Stripe Elements security.',
    category: 'technology_partner',
    relationshipType: 'Verified Billing & Infrastructure Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 6,
    seoTitle: 'Stripe Verified Partner | Velora Labs',
    seoDescription: 'Velora Labs verified Stripe billing and payment infrastructure partnership.',
    metaTitle: 'Stripe Verified Partner | Velora Labs',
    metaDescription: 'Velora Labs verified Stripe billing and payment infrastructure partnership.',
    testimonial: {
      quote: 'Exceptional precision in handling complex recurring usage billing and enterprise fraud defense pipelines.',
      author: 'Partner Architect',
      role: 'Stripe Global Ecosystem'
    },
    linkedProjectSlugs: ['strata-cloud-saas-platform']
  },
  {
    id: 'partner-make',
    name: 'Make.com & Celonis Alliance',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80',
    website: 'https://make.com',
    description: 'Enterprise workflow automation partner delivering complex multi-step webhook routing, CRM synchronizations, and autonomous data pipelines.',
    category: 'technology_partner',
    relationshipType: 'Enterprise Automation Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 7,
    seoTitle: 'Make.com Automation Partner | Velora Labs',
    seoDescription: 'Velora Labs enterprise automation alliance with Make.com.',
    metaTitle: 'Make.com Automation Partner | Velora Labs',
    metaDescription: 'Velora Labs enterprise automation alliance with Make.com.',
    testimonial: {
      quote: 'Velora Labs designs resilient, self-healing automation architectures handling millions of mission-critical webhooks with zero data drops.',
      author: 'Solutions Director',
      role: 'Enterprise Integrations'
    },
    linkedProjectSlugs: ['luminary-ai-lead-pipeline']
  },
  {
    id: 'partner-ai',
    name: 'Google Gemini & Anthropic Ecosystem',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    website: 'https://ai.google.dev',
    description: 'Production AI engineering partnership implementing server-side model orchestration, multi-modal reasoning, and custom RAG vector architectures.',
    category: 'technology_partner',
    relationshipType: 'AI Model & Systems Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 8,
    seoTitle: 'AI Systems Partnership | Velora Labs',
    seoDescription: 'Velora Labs Gemini & Anthropic enterprise AI integration partner.',
    metaTitle: 'AI Systems Partnership | Velora Labs',
    metaDescription: 'Velora Labs Gemini & Anthropic enterprise AI integration partner.',
    testimonial: {
      quote: 'Pioneering production-grade multi-agent architectures that turn generative AI into measurable business ROI.',
      author: 'AI Solutions Architect',
      role: 'Applied AI Ecosystem'
    },
    linkedProjectSlugs: ['luminary-ai-lead-pipeline', 'strata-cloud-saas-platform']
  },
  {
    id: 'partner-apex',
    name: 'Apex Studio London',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80',
    website: 'https://apexstudio.co.uk',
    description: 'Top-tier London creative consultancy partnering with Velora Labs as their dedicated full-stack engineering and custom SaaS development engine.',
    category: 'agency_partner',
    relationshipType: 'Strategic Co-Engineering Partner',
    isFeatured: true,
    isPublished: true,
    displayOrder: 9,
    seoTitle: 'Apex Studio Collaboration | Velora Labs',
    seoDescription: 'Velora Labs engineering partnership with Apex Studio London.',
    metaTitle: 'Apex Studio Collaboration | Velora Labs',
    metaDescription: 'Velora Labs engineering partnership with Apex Studio London.',
    testimonial: {
      quote: 'Velora Labs is our secret weapon. We handle high-concept brand strategy, and they engineer bulletproof web applications and automated backends without a hitch.',
      author: 'Jonathan Sterling',
      role: 'Managing Partner, Apex Studio'
    },
    linkedProjectSlugs: ['aethelgard-luxury-commerce']
  },
  {
    id: 'partner-kinetix',
    name: 'Kinetix Venture Foundry',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80',
    website: 'https://kinetixventures.io',
    description: 'European technology accelerator and venture studio building scalable software MVPs for early-stage portfolio startups.',
    category: 'enterprise',
    relationshipType: 'Venture Studio Technical Co-Builder',
    isFeatured: true,
    isPublished: true,
    displayOrder: 10,
    seoTitle: 'Kinetix Venture Foundry Partner | Velora Labs',
    seoDescription: 'Velora Labs venture foundry and technical incubation partner.',
    metaTitle: 'Kinetix Venture Foundry Partner | Velora Labs',
    metaDescription: 'Velora Labs venture foundry and technical incubation partner.',
    testimonial: {
      quote: 'Having Velora Labs as our technical execution partner allows our portfolio founders to launch venture-grade products in weeks instead of quarters.',
      author: 'Elena Rostova',
      role: 'Partner, Kinetix Ventures'
    },
    linkedProjectSlugs: ['strata-cloud-saas-platform']
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

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  Zap,
  Globe,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Terminal,
  Activity,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PortfolioProject, ClientPartner } from '../../types';
import { AGENCY_SERVICES, AGENCY_PROCESS } from '../../data/agencyData';
import { HeroSmokeCanvas } from '../effects/HeroSmokeCanvas';

interface HomeProps {
  projects: PortfolioProject[];
  clients: ClientPartner[];
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const Home: React.FC<HomeProps> = ({
  projects,
  clients,
  navigate,
  openAIConsultant
}) => {
  const [activePillar, setActivePillar] = useState<'website' | 'automation' | 'saas' | 'marketing'>('saas');

  const featuredProjects = projects.filter(p => p.isFeatured && p.isPublished).slice(0, 4);
  const featuredClients = clients.filter(c => c.isPublished && c.isFeatured);
  const selectedPillarData = AGENCY_SERVICES.find(s => s.id === activePillar) || AGENCY_SERVICES[0];

  return (
    <div className="relative overflow-hidden pt-24 pb-20">
      {/* Full-Bleed Dynamic Cursor Smoke Canvas across entire Hero viewport width & height */}
      <div className="absolute inset-x-0 top-0 h-[920px] pointer-events-none z-0 overflow-hidden">
        <HeroSmokeCanvas />
      </div>

      {/* Background Subtle Ambience with Multi-tone Chromatic Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none opacity-30 select-none overflow-hidden will-change-transform">
        <div className="absolute top-16 left-1/4 w-[420px] h-[420px] bg-indigo-600/35 rounded-full blur-[100px] animate-ambient-1 will-change-transform"></div>
        <div className="absolute top-36 right-1/4 w-[420px] h-[420px] bg-cyan-500/25 rounded-full blur-[100px] animate-ambient-2 will-change-transform"></div>
        <div className="absolute top-52 left-1/3 w-[340px] h-[340px] bg-purple-600/20 rounded-full blur-[90px] animate-ambient-3 will-change-transform"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-28 sm:space-y-36">
        {/* ============================================================ */}
        {/* SECTION 1: HERO */}
        {/* ============================================================ */}
        <section id="hero-section" className="pt-8 sm:pt-14 text-center max-w-4xl mx-auto relative">
          {/* Top Operational Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-neutral-300 mb-8 shadow-inner backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>VELORA LABS // PRODUCTION SYSTEMS AGENCY</span>
            <span className="text-neutral-400">|</span>
            <span className="text-neutral-400">Q2/Q3 ADVISORY ACTIVE</span>
          </div>

          {/* Main Headline */}
          <h1 className="relative z-10 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.08] mb-6 drop-shadow-sm">
            We architect digital systems that generate{' '}
            <span className="bg-gradient-to-r from-indigo-200 via-neutral-100 to-indigo-300 bg-clip-text text-transparent underline decoration-indigo-500/40 underline-offset-8">
              predictable revenue.
            </span>
          </h1>

          {/* Subtitle / Agency Manifesto */}
          <p className="relative z-10 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Velora Labs is an elite technical agency combining bespoke web development, autonomous AI automations, scalable SaaS product engineering, and high-LTV performance marketing.
          </p>

          {/* Primary Hero CTAs */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-cta-explore"
              onClick={() => navigate('portfolio')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-white/10 flex items-center justify-center gap-2 group"
            >
              <span>Explore Selected Work</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              id="hero-cta-ai-advisor"
              onClick={openAIConsultant}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/60 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Scope & Stack Advisor</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                Gemini 3.7
              </span>
            </button>

            <button
              id="hero-cta-contact"
              onClick={() => navigate('contact')}
              className="w-full sm:w-auto px-5 py-3.5 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
            >
              Book Strategic Consultation →
            </button>
          </div>

          {/* Key Quantitative Proof Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-neutral-800/80 text-left">
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                $140M+
              </div>
              <div className="text-xs text-neutral-400 mt-1">Client Pipeline Processed</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                99.99%
              </div>
              <div className="text-xs text-neutral-400 mt-1">System Uptime & Reliability</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                &lt;45s
              </div>
              <div className="text-xs text-neutral-400 mt-1">Speed to Lead Automation</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                4.8x
              </div>
              <div className="text-xs text-neutral-400 mt-1">Average Growth ROAS</div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: CLIENT & PARTNER TRUST MARQUEE */}
        {/* ============================================================ */}
        <section id="trust-section" className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase font-mono tracking-widest text-neutral-400">
              Trusted by High-Velocity Founders, Enterprise Franchises & Growth Syndicates
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => navigate('clients')}
                className="cursor-pointer p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all duration-200 flex flex-col items-center justify-center text-center group"
              >
                <div className="font-display font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">
                  {client.name}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-full">
                  {client.relationshipType}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: THE 4 CORE SERVICE PILLARS (Interactive System) */}
        {/* ============================================================ */}
        <section id="services-overview-section" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">
                // System Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
                Four Pillars. Unified Execution.
              </h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-md">
              Unlike single-track freelancers, Velora Labs operates across the entire digital value chain — from software design to backend automation and customer acquisition.
            </p>
          </div>

          {/* Pillar Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-neutral-900/70 p-1.5 rounded-2xl border border-neutral-800">
            {AGENCY_SERVICES.map((pillar) => {
              const isSelected = activePillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  id={`pillar-tab-${pillar.id}`}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`p-3 sm:p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-800 text-white shadow-md border border-neutral-700/80'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {pillar.id === 'website' && <Globe className="w-4 h-4 text-emerald-400" />}
                    {pillar.id === 'automation' && <Zap className="w-4 h-4 text-amber-400" />}
                    {pillar.id === 'saas' && <Layers className="w-4 h-4 text-indigo-400" />}
                    {pillar.id === 'marketing' && <TrendingUp className="w-4 h-4 text-rose-400" />}
                    <span className="font-display font-semibold text-xs sm:text-sm">
                      {pillar.shortTitle}
                    </span>
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </button>
              );
            })}
          </div>

          {/* Active Pillar Deep Dive Card */}
          <div className="p-6 sm:p-10 rounded-2xl bg-neutral-900/50 border border-neutral-800/90 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Details & Deliverables */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
                    {selectedPillarData.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                    {selectedPillarData.description}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div>
                  <h4 className="text-xs uppercase font-mono text-neutral-400 tracking-wider mb-3">
                    Core Capabilities & Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedPillarData.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <h4 className="text-xs uppercase font-mono text-neutral-400 tracking-wider mb-2.5">
                    Primary Technologies & Protocols
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPillarData.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-[11px] font-mono text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA for Pillar */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => navigate('services')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-indigo-300 transition-colors"
                  >
                    <span>View Full Pillar Breakdown</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={openAIConsultant}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Scope with AI</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Architectural Highlights & Quantitative ROI */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-3">
                    Architectural Advantages
                  </h4>
                  <div className="space-y-3.5">
                    {selectedPillarData.features.map((feat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                          {feat.title}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-3 gap-2">
                  {selectedPillarData.stats.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
                      <div className="font-display font-bold text-lg text-white">
                        {st.value}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: FEATURED PORTFOLIO & CASE STUDIES */}
        {/* ============================================================ */}
        <section id="featured-work-section" className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">
                // Real Client Deployments
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
                Featured Case Studies
              </h2>
            </div>
            <button
              onClick={() => navigate('portfolio')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <span>View All {projects.length} Case Studies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate('project-detail', project.slug)}
                className="group cursor-pointer rounded-2xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/90 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Category Pill */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-[11px] font-mono text-neutral-200 uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    {/* Client Name Pill */}
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-md text-[11px] font-medium text-neutral-300 border border-neutral-800">
                        {project.clientName}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display group-hover:text-indigo-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">
                        {project.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Results Metrics Banner */}
                    {project.results && project.results.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
                        {project.results.slice(0, 3).map((res, i) => (
                          <div key={i} className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
                            <div className="font-display font-bold text-sm text-indigo-300">
                              {res.metric}
                            </div>
                            <div className="text-[10px] text-neutral-400 leading-tight truncate">
                              {res.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-neutral-950/40 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
                  <div className="flex flex-wrap gap-1.5">
                    {project.services.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-neutral-400">
                        #{s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-xs text-white">
                    <span>Read Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: 4-STAGE STRATEGIC PROCESS */}
        {/* ============================================================ */}
        <section id="process-section" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">
              // Engineering Discipline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              How We Execute
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              Zero guesswork. We employ an iterative, mathematically structured engineering lifecycle designed to eliminate scope creep and deliver production results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENCY_PROCESS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="font-mono text-2xl font-bold text-indigo-400 mb-2">
                    {step.step}
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    {step.title}
                  </h3>
                  <div className="text-xs font-mono text-neutral-400 mb-3">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: DIRECT STRATEGIC CTA */}
        {/* ============================================================ */}
        <section id="final-cta-section" className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[11px] font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>Direct Senior Partner Access</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
              Ready to engineer your next digital advantage?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Whether you require a headless e-commerce transformation, autonomous AI pipelines, or a venture-grade SaaS MVP, we operate as your dedicated engineering arm.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="cta-start-project"
                onClick={() => navigate('contact')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Initiate Project Inquiry</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                id="cta-ai-estimator"
                onClick={openAIConsultant}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-indigo-500/60 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Scope Stack via AI</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Globe,
  Zap,
  Layers,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Terminal,
  Activity
} from 'lucide-react';
import { AGENCY_SERVICES } from '../../data/agencyData';
import { ServicePillar } from '../../types';

interface ServicesProps {
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const Services: React.FC<ServicesProps> = ({
  navigate,
  openAIConsultant
}) => {
  const [activeTab, setActiveTab] = useState<ServicePillar>('website');

  const getPillarIcon = (id: ServicePillar) => {
    switch (id) {
      case 'website': return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'automation': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'saas': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'marketing': return <TrendingUp className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // Comprehensive Capabilities
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
          Full-Stack Digital Systems & Creative Engineering
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          We don't offer fragmented freelance gigs. We design, engineer, automate, and scale complete revenue machines across four interconnected disciplines.
        </p>
      </div>

      {/* 4 Pillars Section Stack */}
      <div className="space-y-16">
        {AGENCY_SERVICES.map((service, index) => (
          <section
            key={service.id}
            id={`service-${service.id}`}
            className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/90 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Title, Description, Stats */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    {getPillarIcon(service.id)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      Pillar 0{index + 1}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Quantitative Stats Banner */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {service.stats.map((st, i) => (
                    <div key={i} className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center">
                      <div className="font-display font-bold text-lg sm:text-xl text-white">
                        {st.value}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ideal For Section */}
                <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/60 space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-indigo-300 tracking-wider">
                    Recommended For
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {service.idealFor.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pillar Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('contact')}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Request Proposal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={openAIConsultant}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Scope with AI</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Deliverables & Tech Stacks */}
              <div className="lg:col-span-6 space-y-6">
                {/* Deliverables Checklist */}
                <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-4">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                    Full Deliverables Spectrum
                  </h3>
                  <div className="space-y-2.5">
                    {service.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features & Architecture */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                    Engineering Standards & Architecture
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                        <div className="text-xs font-bold text-neutral-100">
                          {feat.title}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supported Technologies & Integrations */}
                <div>
                  <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2.5">
                    Supported Tech & API Integrations
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {service.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-[11px] font-mono text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Conversion Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 to-indigo-950/40 border border-neutral-800 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
          Need a unified digital systems engagement?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Most of our highest-impact partners combine multiple disciplines — such as pairing a Headless Storefront with autonomous n8n workflows and Meta Ads growth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('contact')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-neutral-950 font-semibold text-xs transition-colors"
          >
            Start Strategic Engagement
          </button>
          <button
            onClick={openAIConsultant}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consult Velora AI Architect</span>
          </button>
        </div>
      </div>
    </div>
  );
};

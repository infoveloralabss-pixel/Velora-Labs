import React from 'react';
import {
  ShieldCheck,
  Terminal,
  Cpu,
  ArrowUpRight,
  Sparkles,
  Layers,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { AGENCY_TEAM } from '../../data/agencyData';

interface AboutProps {
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const About: React.FC<AboutProps> = ({
  navigate,
  openAIConsultant
}) => {
  const principles = [
    {
      title: 'Architectural Rigor Over Disposable Hacks',
      description: 'We do not build flimsy prototypes or bloated themes. We write clean, typed, modular codebases and self-healing automation clusters designed for high production loads.'
    },
    {
      title: 'Full-Funnel Cross-Discipline Synergy',
      description: 'Software development, automated CRM workflows, and customer acquisition are not isolated silos. When engineered together, conversion and operating efficiency compound exponentially.'
    },
    {
      title: 'Senior Execution Without Account Layers',
      description: 'You partner directly with senior systems architects, staff designers, and growth partners. Zero junior handoffs, zero agency bureaucracy.'
    },
    {
      title: 'Measurable Economic Outgrowth',
      description: 'We measure success by hard metrics: conversion rates, latency under load, automated hours saved, customer acquisition cost reduction, and net annual pipeline.'
    }
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Header & Positioning Manifesto */}
      <div className="max-w-4xl space-y-6">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // About Velora Labs
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display leading-[1.1]">
          We exist to eliminate the friction between engineering and revenue.
        </h1>
        <p className="text-base sm:text-xl text-neutral-300 leading-relaxed font-normal">
          Most companies struggle because their agency partners operate in disconnected silos: marketing agencies don't understand code, dev shops don't understand conversion, and automation consultants don't understand security.
        </p>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          Velora Labs was founded to solve this fracture. We are an integrated digital systems agency that brings world-class web engineering, autonomous AI workflows, full-scale SaaS production, and high-LTV performance marketing under one unified roof.
        </p>
      </div>

      {/* Core Principles Grid */}
      <section className="space-y-8">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
          // Our Operating Principles
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((pr, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="font-mono text-xs text-indigo-400">
                0{idx + 1}
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {pr.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {pr.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Multi-Disciplinary Team */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">
              // Senior Partners
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Multidisciplinary Team
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm">
            Our principals bring deep domain backgrounds from venture scaleups, high-traffic e-commerce flagships, and enterprise workflow engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENCY_TEAM.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-all"
            >
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-indigo-300 mt-0.5">
                    {member.role}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {member.specialty}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                {member.experience}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Footprint & Infrastructure */}
      <section className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase">San Francisco HQ</div>
          <div className="text-lg font-bold text-white font-display mt-1">Americas Innovation Hub</div>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Leading product engineering, AI agent architectures, and Series A/B founder advisory.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase">London Studio</div>
          <div className="text-lg font-bold text-white font-display mt-1">EMEA Systems & Commerce</div>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Specializing in headless Shopify Plus flagships, multi-currency architectures, and enterprise n8n clusters.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase">Zurich Lab</div>
          <div className="text-lg font-bold text-white font-display mt-1">Security & Infrastructure</div>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Overseeing database integrity, HIPAA/GDPR regulatory compliance, and distributed cloud performance.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-white font-display">
          Let’s discuss your technical roadmap.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          We limit concurrent engagements to ensure direct principal involvement on every build.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('contact')}
            className="px-7 py-3 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            Start Conversation
          </button>
          <button
            onClick={openAIConsultant}
            className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-medium hover:border-indigo-500/60 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Architecture Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

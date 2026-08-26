import React from 'react';
import { ArrowUpRight, Shield, Sparkles, Mail, MapPin } from 'lucide-react';
import { Logo } from '../common/Logo';

interface FooterProps {
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
  openAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  navigate,
  openAIConsultant,
  openAdmin
}) => {
  return (
    <footer className="bg-[#050711] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('home')}
              className="flex items-center text-left group focus:outline-none cursor-pointer"
            >
              <Logo size="lg" />
            </button>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Elite digital systems engineering firm. We architect high-converting headless storefronts, autonomous AI workflow pipelines, scalable multi-tenant SaaS platforms, and high-LTV growth engines.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 w-fit px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for Select Q2/Q3 Engagements</span>
            </div>
          </div>

          {/* Pillars Navigation */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4">
              Service Pillars
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Websites & Headless Commerce
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  AI & Intelligent Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  SaaS Product Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Performance Marketing & CRO
                </button>
              </li>
            </ul>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4">
              Agency & Work
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('portfolio')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Selected Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('clients')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Client Directory & Partners
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Engineering Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={openAIConsultant}
                  className="hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-cyan-400"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Scoping Advisor</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openAdmin}
                  className="hover:text-indigo-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-indigo-400"
                >
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>Admin CMS Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider mb-4">
              Direct Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href="mailto:info.veloralabss@gmail.com" className="hover:text-cyan-300 transition-colors">
                  info.veloralabss@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <span>San Francisco · London · Zurich</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white border-b border-cyan-500/40 pb-0.5 cursor-pointer"
                >
                  <span>Submit Detailed RFP</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} Velora Labs, Inc. All rights reserved. Precision Digital Systems.
          </div>
          <div className="flex items-center gap-6">
            <span>Enterprise SLA 99.99%</span>
            <span>Zero Lock-in Codebases</span>
            <button onClick={openAdmin} className="hover:text-cyan-300 transition-colors cursor-pointer">
              CMS Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

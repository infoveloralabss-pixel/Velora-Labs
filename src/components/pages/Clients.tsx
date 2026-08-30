import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Quote,
  Building2,
  Handshake,
  RotateCcw,
  Sparkles,
  Layers,
  Zap,
  Globe,
  BadgeCheck
} from 'lucide-react';
import { ClientPartner } from '../../types';

interface ClientsProps {
  clients: ClientPartner[];
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const Clients: React.FC<ClientsProps> = ({
  clients,
  navigate,
  openAIConsultant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (!c.isPublished) return false;

      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesRel = c.relationshipType.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesRel) return false;
      }

      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [clients, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const published = clients.filter(c => c.isPublished);
    return {
      all: published.length,
      client: published.filter(c => c.category === 'client').length,
      enterprise: published.filter(c => c.category === 'enterprise').length,
      agency_partner: published.filter(c => c.category === 'agency_partner').length,
      technology_partner: published.filter(c => c.category === 'technology_partner').length,
    };
  }, [clients]);

  const categories = [
    { id: 'all', label: 'All Partners', count: categoryCounts.all },
    { id: 'technology_partner', label: 'Technology Ecosystems', count: categoryCounts.technology_partner },
    { id: 'client', label: 'Direct Enterprise Clients', count: categoryCounts.client },
    { id: 'agency_partner', label: 'Agency Collaborations', count: categoryCounts.agency_partner },
    { id: 'enterprise', label: 'Venture & Franchise Studios', count: categoryCounts.enterprise },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Handshake className="w-3.5 h-3.5" />
            <span>// Strategic Ecosystem & Certified Alliances</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1]">
            Partners, Clients & Technology Ecosystem
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            We collaborate with ambitious venture-backed startups, high-revenue enterprises, global platforms, and specialized creative agencies to engineer enduring technical advantages.
          </p>
        </div>

        {/* Quick Partnership Inquiry CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('contact')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Propose a Partnership</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            onClick={openAIConsultant}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scope Alignment via AI</span>
          </button>
        </div>
      </div>

      {/* Trust & Scale Proof Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
        <div className="space-y-1">
          <div className="font-display font-bold text-2xl sm:text-3xl text-white">
            100%
          </div>
          <div className="text-xs text-neutral-400 font-mono">Code Ownership & IP Transfer</div>
        </div>
        <div className="space-y-1">
          <div className="font-display font-bold text-2xl sm:text-3xl text-cyan-300">
            $140M+
          </div>
          <div className="text-xs text-neutral-400 font-mono">Client Pipeline Processed</div>
        </div>
        <div className="space-y-1">
          <div className="font-display font-bold text-2xl sm:text-3xl text-white">
            99.99%
          </div>
          <div className="text-xs text-neutral-400 font-mono">Enterprise Systems SLA</div>
        </div>
        <div className="space-y-1">
          <div className="font-display font-bold text-2xl sm:text-3xl text-emerald-400">
            &lt;45s
          </div>
          <div className="text-xs text-neutral-400 font-mono">Speed-to-Lead Automation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold shadow-sm'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800/80 hover:bg-neutral-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                selectedCategory === cat.id ? 'bg-cyan-500/30 text-cyan-100' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners & technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/70 transition-colors"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-6 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div className="space-y-4">
                {/* Header with Logo / Category */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-1 group-hover:border-cyan-500/40 transition-colors">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                        {client.name}
                      </h3>
                      <div className="text-[11px] font-mono text-cyan-400">
                        {client.relationshipType}
                      </div>
                    </div>
                  </div>

                  {client.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {client.description}
                </p>

                {/* Testimonial Quote if available */}
                {client.testimonial && (
                  <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                    <div className="flex items-center gap-1">
                      {[...Array(client.testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-300 italic leading-relaxed">
                      "{client.testimonial.quote}"
                    </p>
                    <div className="text-[10px] font-mono text-cyan-400">
                      — {client.testimonial.author}, {client.testimonial.role}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                {client.linkedProjectSlugs && client.linkedProjectSlugs.length > 0 ? (
                  <button
                    onClick={() => navigate('project-detail', client.linkedProjectSlugs![0])}
                    className="inline-flex items-center gap-1 text-white font-semibold hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-400">
                    Active Alliance
                  </span>
                )}

                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-neutral-800 rounded-lg cursor-pointer"
                    title="Visit Official Partner Resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 space-y-3">
          <p className="text-xs text-neutral-400">No partner entries found matching your query.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Strategic Partnership Engagement Models */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            // Collaboration Paradigms
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            How We Partner With Organizations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Direct Enterprise Engagements
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We operate as your dedicated engineering arm, taking complete ownership of architecture, headless web storefronts, autonomous AI agents, and custom SaaS platforms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              White-Label Agency Co-Development
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Leading creative and marketing agencies partner with Velora Labs to execute high-complexity full-stack builds, custom APIs, and automated CRM pipelines under their brand.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Venture Studio Technical Foundry
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Accelerators and venture funds embed Velora Labs as the technical builder for early-stage portfolio founders, shipping production MVPs in weeks with high architectural rigor.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Partnership CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/30 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono">
            <Handshake className="w-3 h-3" />
            <span>Open for Q2/Q3 Strategic Partnerships</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Interested in an agency or technology alliance?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Whether you need a specialized technical subcontractor, certified platform integration partner, or co-development engineering team, let's connect.
          </p>
        </div>

        <button
          onClick={() => navigate('contact')}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold transition-all shadow-lg shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>Initiate Partnership Discussion</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};


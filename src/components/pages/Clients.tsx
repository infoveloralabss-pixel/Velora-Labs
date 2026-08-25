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
  RotateCcw
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

  const categories = [
    { id: 'all', label: 'All Partners' },
    { id: 'client', label: 'Direct Clients' },
    { id: 'enterprise', label: 'Enterprise Franchises' },
    { id: 'agency_partner', label: 'Agency Collaborations' },
    { id: 'technology_partner', label: 'Technology Ecosystems' },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // Dynamic Ecosystem Directory
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
          Clients, Partners & Strategic Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          We collaborate with ambitious venture-backed startups, established enterprises, and specialized digital agencies to build lasting technical advantages.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header with Logo / Category */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-1">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white">
                        {client.name}
                      </h3>
                      <div className="text-[11px] font-mono text-indigo-300">
                        {client.relationshipType}
                      </div>
                    </div>
                  </div>

                  {client.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                      ★ Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {client.description}
                </p>

                {/* Testimonial Quote if available */}
                {client.testimonial && (
                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                    <div className="flex items-center gap-1">
                      {[...Array(client.testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-300 italic leading-relaxed">
                      "{client.testimonial.quote}"
                    </p>
                    <div className="text-[10px] font-mono text-neutral-400">
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
                    className="inline-flex items-center gap-1 text-white font-semibold hover:text-indigo-300 transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-400">
                    Ongoing Engagement
                  </span>
                )}

                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                    title="Visit Partner Website"
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
            className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Strategic Partnership CTA */}
      <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">
            Interested in an agency or technology partnership?
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            We partner with creative agencies, venture studios, and SaaS platforms as their dedicated technical engineering and automation arm.
          </p>
        </div>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-3 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors shrink-0"
        >
          Inquire About Strategic Partnership
        </button>
      </div>
    </div>
  );
};

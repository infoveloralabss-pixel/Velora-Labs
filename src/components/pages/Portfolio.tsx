import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, Sparkles, SlidersHorizontal, CheckCircle2, RotateCcw } from 'lucide-react';
import { PortfolioProject, ServicePillar } from '../../types';

interface PortfolioProps {
  projects: PortfolioProject[];
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  projects,
  navigate,
  openAIConsultant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Must be published for public view
      if (!p.isPublished) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Featured filter
      if (onlyFeatured && !p.isFeatured) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesClient = p.clientName.toLowerCase().includes(q);
        const matchesServices = p.services.some(s => s.toLowerCase().includes(q));
        const matchesTech = p.technologies.some(t => t.toLowerCase().includes(q));
        const matchesSummary = p.summary.toLowerCase().includes(q);

        if (!matchesTitle && !matchesTagline && !matchesClient && !matchesServices && !matchesTech && !matchesSummary) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, selectedCategory, onlyFeatured, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'saas', label: 'SaaS & Product' },
    { id: 'website', label: 'Websites & Commerce' },
    { id: 'automation', label: 'AI Automation' },
    { id: 'marketing', label: 'Growth & CRO' },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header & Page Title */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // Digital Systems Portfolio
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
          Engineered for Scalability & Revenue
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Explore our real-world technical case studies across modern commerce, venture SaaS engineering, autonomous workflow engines, and performance marketing.
        </p>
      </div>

      {/* Control Bar: Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 shadow-lg">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`portfolio-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Featured Filter Toggle */}
          <button
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border ${
              onlyFeatured
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <span>★ Featured</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="portfolio-search-input"
            type="text"
            placeholder="Search by tech, client, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/70 transition-colors"
          />
        </div>
      </div>

      {/* Projects Count Summary */}
      <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
        <div>
          Showing <span className="text-white font-bold">{filteredProjects.length}</span> of {projects.filter(p => p.isPublished).length} published deployments
        </div>
        {(selectedCategory !== 'all' || searchQuery !== '' || onlyFeatured) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyFeatured(false);
            }}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Dynamic Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate('project-detail', project.slug)}
              className="group cursor-pointer rounded-2xl bg-neutral-900/40 hover:bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-[10px] font-mono text-neutral-200 uppercase">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-900/80 backdrop-blur-md text-[10px] text-neutral-300 font-medium border border-neutral-800">
                      {project.clientName}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                      {project.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Highlight Metrics */}
                  {project.results && project.results.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/60">
                      {project.results.slice(0, 2).map((r, idx) => (
                        <div key={idx} className="p-1.5 rounded-md bg-neutral-950/60 border border-neutral-800/60">
                          <div className="font-display font-bold text-xs text-indigo-300">
                            {r.metric}
                          </div>
                          <div className="text-[9px] text-neutral-400 truncate">
                            {r.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-neutral-950/50 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 overflow-hidden max-w-[70%]">
                  {project.technologies.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="font-mono text-neutral-400 text-[10px] truncate">
                      {t}{idx < 1 && project.technologies.length > 1 ? ' · ' : ''}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <span className="text-[9px] font-mono text-neutral-400">+{project.technologies.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            No projects matched your criteria
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the active category filters to see our full catalogue of engineering deployments.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyFeatured(false);
            }}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Bottom Scoping Teaser */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/40 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">
            Need a tailored architectural assessment?
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Our AI Strategy Consultant can analyze your target stack, timeline, and deliverables based on our production case studies.
          </p>
        </div>
        <button
          onClick={openAIConsultant}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Scope Advisor</span>
        </button>
      </div>
    </div>
  );
};

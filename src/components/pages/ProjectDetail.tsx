import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  Quote
} from 'lucide-react';
import { PortfolioProject } from '../../types';

interface ProjectDetailProps {
  slug: string;
  projects: PortfolioProject[];
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  slug,
  projects,
  navigate,
  openAIConsultant
}) => {
  const project = projects.find(p => p.slug === slug || p.id === slug);

  // If not found, show graceful 404
  if (!project) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-display">Case Study Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested project deployment may have been unpublished or moved.
        </p>
        <button
          onClick={() => navigate('portfolio')}
          className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-semibold"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  // Related projects
  const relatedProjects = projects
    .filter(p => p.id !== project.id && p.isPublished && (p.category === project.category || p.isFeatured))
    .slice(0, 2);

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('portfolio')}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 uppercase">
            {project.category}
          </span>
          {project.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
          // {project.clientName} Case Study
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.15]">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
          {project.tagline}
        </p>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Metadata Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
        <div>
          <div className="font-mono text-[10px] uppercase text-neutral-400">Client / Partner</div>
          <div className="font-semibold text-white mt-1">{project.clientName}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-neutral-400">Core Pillar</div>
          <div className="font-semibold text-white mt-1 capitalize">{project.category}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-neutral-400">Engineering Scope</div>
          <div className="font-semibold text-white mt-1">{project.services.length} Specialized Modules</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-neutral-400">Deployment Status</div>
          <div className="font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live in Production</span>
          </div>
        </div>
      </div>

      {/* Results & Quantitative Impact */}
      {project.results && project.results.length > 0 && (
        <section className="space-y-4">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Key Business Outcomes
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((res, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="font-display font-bold text-3xl text-white tracking-tight">
                    {res.metric}
                  </div>
                  <div className="text-xs font-bold text-indigo-300 mt-1">
                    {res.label}
                  </div>
                </div>
                {res.description && (
                  <p className="text-[11px] text-neutral-400 mt-3 pt-3 border-t border-neutral-800/80 leading-relaxed">
                    {res.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Case Study Narrative: Problem → Strategy → Execution */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        <div className="lg:col-span-2 space-y-10">
          {/* Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white font-display">Executive Summary</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.summary}
            </p>
          </div>

          {/* The Challenge */}
          <div className="space-y-3 p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80">
            <div className="text-xs font-mono text-rose-400 uppercase tracking-wider">01 // The Problem</div>
            <h3 className="text-lg font-bold text-white font-display">Architectural & Business Challenge</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.challenge}
            </p>
          </div>

          {/* The Solution */}
          <div className="space-y-3 p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">02 // The Engineering Solution</div>
            <h3 className="text-lg font-bold text-white font-display">Execution & Architectural Delivery</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.solution}
            </p>
          </div>

          {/* Testimonial Quote if present */}
          {project.testimonial && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 to-indigo-950/30 border border-indigo-500/20 space-y-4">
              <Quote className="w-6 h-6 text-indigo-400 opacity-60" />
              <p className="text-sm text-neutral-200 italic leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
                {project.testimonial.avatar && (
                  <img
                    src={project.testimonial.avatar}
                    alt={project.testimonial.author}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                  />
                )}
                <div>
                  <div className="text-xs font-bold text-white font-display">
                    {project.testimonial.author}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {project.testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Screenshots if available */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-display">System Screenshots & Artifacts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.slice(1).map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10]">
                    <img src={imgUrl} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Tech Stack, Deliverables & Actions */}
        <div className="space-y-6">
          {/* Deliverables Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h4 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
              Services Delivered
            </h4>
            <div className="space-y-2">
              {project.services.map((svc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700/60 text-[11px] font-mono text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* External URL if provided */}
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
            >
              <span>Visit Live Production System</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          )}

          {/* Project Scoping Trigger */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-neutral-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Require a similar architecture?</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Our engineering team can replicate and customize this blueprint for your operational requirements.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="w-full py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              Inquire About Similar Build
            </button>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="pt-10 border-t border-neutral-800/80 space-y-6">
          <h3 className="text-xl font-bold text-white font-display">
            Related Case Studies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('project-detail', rel.slug)}
                className="cursor-pointer p-5 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400">
                    {rel.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {rel.tagline}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-4" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

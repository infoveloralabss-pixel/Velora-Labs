import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  Users,
  Linkedin,
  Twitter,
  Github,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Award,
  Compass,
  X,
  Maximize2,
  Briefcase,
  Calendar,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { AGENCY_TEAM } from '../../data/agencyData';
import { TeamMember } from '../../types';
import { api } from '../../lib/api';

interface AboutProps {
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
  team?: TeamMember[];
}

export const About: React.FC<AboutProps> = ({
  navigate,
  openAIConsultant,
  team: propTeam
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(propTeam || AGENCY_TEAM);
  const [isLoadingTeam, setIsLoadingTeam] = useState<boolean>(false);
  const [showAllTeam, setShowAllTeam] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Helper for strictly truncating strings with ellipsis if content remains
  const truncateText = (text: string | undefined, maxChars: number) => {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars).trim() + '...';
  };

  // Strictly sort team members by displayOrder ascending (1, 2, 3, 4...)
  const sortTeamList = (list: TeamMember[]): TeamMember[] => {
    return [...list]
      .filter((m) => m.isPublished !== false)
      .sort((a, b) => {
        const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : (Number(a.displayOrder) || 999);
        const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : (Number(b.displayOrder) || 999);
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  };

  useEffect(() => {
    if (propTeam && propTeam.length > 0) {
      setTeamMembers(sortTeamList(propTeam));
    } else {
      setIsLoadingTeam(true);
      api.getTeam({ published: true })
        .then((data) => {
          if (data && data.length > 0) {
            setTeamMembers(sortTeamList(data));
          } else {
            setTeamMembers(sortTeamList(AGENCY_TEAM));
          }
        })
        .catch((err) => {
          console.warn('Using default agency team fallback', err);
          setTeamMembers(sortTeamList(AGENCY_TEAM));
        })
        .finally(() => {
          setIsLoadingTeam(false);
        });
    }
  }, [propTeam]);

  // Handle escape key and body scroll lock for team modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedMember) {
        setSelectedMember(null);
      }
    };

    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  const activeSortedMembers = useMemo(() => {
    return sortTeamList(teamMembers);
  }, [teamMembers]);

  // If not expanded and we have more than 4, slice first 4 (Core Leadership)
  const displayedMembers = useMemo(() => {
    if (!showAllTeam && activeSortedMembers.length > 4) {
      return activeSortedMembers.slice(0, 4);
    }
    return activeSortedMembers;
  }, [activeSortedMembers, showAllTeam]);

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
      <section className="space-y-10" id="team-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>// Senior Partners & Leadership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Multidisciplinary Team
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {showAllTeam || activeSortedMembers.length <= 4
                  ? `Showing all ${activeSortedMembers.length} team members`
                  : `Showing 4 of ${activeSortedMembers.length} senior partners`}
              </span>
            </div>

            {activeSortedMembers.length > 4 && (
              <button
                onClick={() => setShowAllTeam(!showAllTeam)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-cyan-500/50 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm group"
              >
                <span>{showAllTeam ? 'Show Core 4' : `View All Team (${activeSortedMembers.length})`}</span>
                {showAllTeam ? (
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedMembers.map((member, idx) => {
            const positionNum = member.displayOrder || idx + 1;
            const formattedPosition = positionNum < 10 ? `0${positionNum}` : `${positionNum}`;

            const rawBio = member.bio || '';
            const isBioTruncated = rawBio.length > 130;
            const bioDisplay = truncateText(rawBio, 130);

            const rawExp = member.experience || '';
            const isExpTruncated = rawExp.length > 70;
            const expDisplay = truncateText(rawExp, 70);

            return (
              <div
                key={member.id || idx}
                onClick={() => setSelectedMember(member)}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 hover:bg-neutral-900/70 transition-all duration-300 group relative overflow-hidden cursor-pointer shadow-sm hover:shadow-cyan-500/5 select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
                aria-label={`View full profile of ${member.name}`}
              >
                {/* Position Marker & Expand Cue */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-950/90 text-cyan-400 border border-cyan-800/40 backdrop-blur-sm shadow-sm">
                    #{formattedPosition}
                  </span>
                  <span className="p-1 rounded-md bg-neutral-950/80 text-neutral-400 group-hover:text-cyan-300 border border-neutral-800/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" title="Click to view full bio">
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative group-hover:border-neutral-700 transition-colors">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                        <span>Click for full profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{member.name}</span>
                    </h3>
                    <div className="text-xs font-mono text-indigo-300 mt-0.5">
                      {member.role}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {member.specialty}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                      {bioDisplay}
                    </p>
                    {isBioTruncated && (
                      <span className="text-[11px] font-mono text-cyan-400/90 font-medium group-hover:text-cyan-300 inline-flex items-center gap-0.5">
                        <span>Read full bio</span>
                        <span className="text-xs">→</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/60">
                    <span className="text-neutral-500 font-semibold block sm:inline">Track Record:</span>{' '}
                    <span>{expDisplay}</span>
                    {isExpTruncated && (
                      <span className="text-cyan-400 font-bold ml-0.5 hover:underline" title="Full track record available on click">
                        [+]
                      </span>
                    )}
                  </div>

                  {(member.socialLinkedin || member.socialTwitter || member.socialGithub) && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-neutral-500">
                        {member.socialLinkedin && (
                          <a
                            href={member.socialLinkedin}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-indigo-400 transition-colors p-1"
                            aria-label={`${member.name} LinkedIn`}
                            title="LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialTwitter && (
                          <a
                            href={member.socialTwitter}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-cyan-400 transition-colors p-1"
                            aria-label={`${member.name} Twitter / X`}
                            title="Twitter / X"
                          >
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialGithub && (
                          <a
                            href={member.socialGithub}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-white transition-colors p-1"
                            aria-label={`${member.name} GitHub`}
                            title="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                        Details & Credentials →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Action Footer */}
        {activeSortedMembers.length > 4 && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setShowAllTeam(!showAllTeam);
                if (showAllTeam) {
                  const el = document.getElementById('team-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-slate-900 hover:from-neutral-850 hover:to-slate-850 border border-neutral-700/80 hover:border-cyan-500/50 text-white text-xs font-semibold font-mono transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
            >
              <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>
                {showAllTeam
                  ? 'Show Core Leadership Only (Top 4)'
                  : `View Full Multidisciplinary Team (${activeSortedMembers.length} Members)`}
              </span>
              {showAllTeam ? (
                <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
      </section>

      {/* Team Member Full Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-member-name"
        >
          <div
            className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 space-y-6 text-left my-auto transition-all duration-300 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-sm">
                  Position #{(selectedMember.displayOrder || 1) < 10 ? `0${selectedMember.displayOrder || 1}` : selectedMember.displayOrder || 1}
                </span>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
                  // Leadership Dossier
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60 hover:border-neutral-500 transition-all cursor-pointer flex items-center justify-center group"
                  aria-label="Close modal"
                  title="Close (Esc or Click outside)"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-700/80 shrink-0 shadow-lg relative">
                <img
                  src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <h3 id="modal-member-name" className="text-2xl sm:text-3xl font-bold font-display text-white">
                  {selectedMember.name}
                </h3>
                <div className="text-sm font-mono text-indigo-300 font-semibold">
                  {selectedMember.role}
                </div>
                <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-900/50 inline-block">
                  Specialty: {selectedMember.specialty}
                </div>

                {/* Social Links */}
                {(selectedMember.socialLinkedin || selectedMember.socialTwitter || selectedMember.socialGithub) && (
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 text-neutral-400">
                    {selectedMember.socialLinkedin && (
                      <a
                        href={selectedMember.socialLinkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-indigo-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedMember.socialTwitter && (
                      <a
                        href={selectedMember.socialTwitter}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        <span>Twitter/X</span>
                      </a>
                    )}
                    {selectedMember.socialGithub && (
                      <a
                        href={selectedMember.socialGithub}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Complete Bio */}
            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>Professional Background & Biography</span>
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed">
                {selectedMember.bio}
              </p>
            </div>

            {/* Complete Track Record & Experience */}
            <div className="space-y-2 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs font-mono text-neutral-400 uppercase flex items-center gap-1.5 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Track Record & Experience</span>
              </div>
              <p className="text-sm text-neutral-200 font-mono leading-relaxed">
                {selectedMember.experience}
              </p>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
              <div className="text-xs text-neutral-400 font-mono text-center sm:text-left">
                Direct engagement available for strategic consulting.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMember(null);
                  navigate('contact');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold font-mono hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Start Project Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

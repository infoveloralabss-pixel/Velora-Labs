import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '../common/Logo';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string, param?: string) => void;
  openAIConsultant: () => void;
  openAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  openAIConsultant,
  openAdmin
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', route: 'portfolio' },
    { label: 'Services', route: 'services' },
    { label: 'About', route: 'about' },
    { label: 'Partners', route: 'clients' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060813]/90 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-2xl shadow-cyan-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-btn"
          onClick={() => navigate('home')}
          className="flex items-center text-left group focus:outline-none cursor-pointer"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800/90 p-1.5 rounded-full backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                id={`nav-link-${link.route}`}
                onClick={() => navigate(link.route)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* AI Scope Advisor CTA */}
          <button
            id="nav-ai-advisor-btn"
            onClick={openAIConsultant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs font-medium transition-all group shadow-sm cursor-pointer"
            title="Open Velora AI Architecture Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>AI Scoping</span>
            <span className="text-[9px] font-mono px-1 py-0.5 bg-cyan-500/15 text-cyan-300 rounded border border-cyan-500/30">
              3.7
            </span>
          </button>

          {/* Admin CMS Trigger */}
          <button
            id="nav-admin-portal-btn"
            onClick={openAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-900 border border-transparent hover:border-indigo-500/30 text-xs font-medium transition-all cursor-pointer"
            title="Manage Portfolio, Clients & SEO CMS"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>CMS Admin</span>
          </button>

          {/* Start a Project Primary CTA */}
          <button
            id="nav-start-project-btn"
            onClick={() => navigate('contact')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold tracking-tight transition-all duration-200 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 cursor-pointer"
          >
            <span>Start Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-ai-btn"
            onClick={openAIConsultant}
            className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pt-2 pb-6 bg-[#060813]/95 border-b border-slate-800 backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentRoute === link.route
                    ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  openAIConsultant();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI Scoping Advisor
              </button>

              <button
                onClick={() => {
                  openAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
              >
                <Shield className="w-4 h-4" />
                CMS Admin Portal
              </button>

              <button
                onClick={() => {
                  navigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 text-xs font-bold"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

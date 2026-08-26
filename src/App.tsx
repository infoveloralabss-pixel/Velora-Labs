import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { Portfolio } from './components/pages/Portfolio';
import { ProjectDetail } from './components/pages/ProjectDetail';
import { Services } from './components/pages/Services';
import { About } from './components/pages/About';
import { Clients } from './components/pages/Clients';
import { Contact } from './components/pages/Contact';
import { AIConsultantModal } from './components/ai/AIConsultantModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { api } from './lib/api';
import { PortfolioProject, ClientPartner, TeamMember } from './types';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [projectsData, clientsData, teamData] = await Promise.all([
        api.getProjects({}),
        api.getClients({}),
        api.getTeam({}),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setTeam(teamData);
    } catch (err: any) {
      console.error('Data load error:', err);
      setLoadError('Failed to load portfolio database. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Navigation handler
  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransferToContact = (scopeText: string) => {
    setPrefilledMessage(scopeText);
    navigate('contact');
  };

  const pageTransitionVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const pageTransitionConfig = {
    duration: 0.36,
    ease: "easeOut" as const,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Universal Navigation Header */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        openAIConsultant={() => setIsAIModalOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page Rendering Engine */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {isLoading && projects.length === 0 ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="min-h-[70vh] flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
                Loading Velora Systems Registry...
              </p>
            </motion.div>
          ) : loadError && projects.length === 0 ? (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center"
            >
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <h2 className="text-xl font-bold font-display text-white">System Error</h2>
              <p className="text-xs text-neutral-400 max-w-sm">{loadError}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Initialization</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentRoute + (routeParam ? `-${routeParam}` : '')}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransitionConfig}
              className="w-full"
            >
              {currentRoute === 'home' && (
                <Home
                  projects={projects}
                  clients={clients}
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'portfolio' && (
                <Portfolio
                  projects={projects}
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'project-detail' && (
                <ProjectDetail
                  slug={routeParam || ''}
                  projects={projects}
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'services' && (
                <Services
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'about' && (
                <About
                  team={team}
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'clients' && (
                <Clients
                  clients={clients}
                  navigate={navigate}
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}

              {currentRoute === 'contact' && (
                <Contact
                  openAIConsultant={() => setIsAIModalOpen(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer
        navigate={navigate}
        openAdmin={() => setIsAdminOpen(true)}
        openAIConsultant={() => setIsAIModalOpen(true)}
      />

      {/* Gemini AI Scope & Stack Advisor Modal */}
      <AIConsultantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onTransferToContact={handleTransferToContact}
      />

      {/* Protected Admin CMS & Systems Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={fetchData}
      />
    </div>
  );
}

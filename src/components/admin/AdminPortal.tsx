import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  Users2,
  Inbox,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  AlertCircle,
  LogOut,
  X,
  Search,
  ExternalLink,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Zap,
  Layers,
  Mail,
  Send
} from 'lucide-react';
import { api } from '../../lib/api';
import { PortfolioProject, ClientPartner, Inquiry, ServicePillar } from '../../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'clients' | 'inquiries'>('dashboard');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [clients, setClients] = useState<ClientPartner[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit / Create Modals
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<ClientPartner> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'project' | 'client' | 'inquiry'; id: string; name: string } | null>(null);

  // SMTP Testing State
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpStatusMessage, setSmtpStatusMessage] = useState<{ success: boolean; message: string } | null>(null);

  // Search in Admin
  const [projectSearch, setProjectSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // Check existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('velora_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all CMS data
  const loadData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [statsData, projectsData, clientsData, inquiriesData] = await Promise.all([
        api.getStats(),
        api.getProjects({}),
        api.getClients({}),
        api.getInquiries(),
      ]);
      setStats(statsData);
      setProjects(projectsData);
      setClients(clientsData);
      setInquiries(inquiriesData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.login(passwordInput);
      if (res.success && res.token) {
        localStorage.setItem('velora_admin_token', res.token);
        setIsAuthenticated(true);
        setPasswordInput('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid passphrase');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('velora_admin_token');
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
    onDataChanged();
  };

  // ---------------- PROJECT CRUD ----------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.category) return;

    try {
      if (editingProject.id) {
        await api.updateProject(editingProject.id, editingProject);
        showNotification(`Project "${editingProject.title}" updated successfully.`);
      } else {
        await api.createProject(editingProject);
        showNotification(`New project "${editingProject.title}" created.`);
      }
      setEditingProject(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  const handleToggleProjectPublish = async (project: PortfolioProject) => {
    try {
      await api.updateProject(project.id, { isPublished: !project.isPublished });
      showNotification(`Project "${project.title}" ${!project.isPublished ? 'published' : 'unpublished'}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProjectFeatured = async (project: PortfolioProject) => {
    try {
      await api.updateProject(project.id, { isFeatured: !project.isFeatured });
      showNotification(`Project "${project.title}" featured status updated.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ---------------- CLIENT CRUD ----------------
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name) return;

    try {
      if (editingClient.id) {
        await api.updateClient(editingClient.id, editingClient);
        showNotification(`Client "${editingClient.name}" updated.`);
      } else {
        await api.createClient(editingClient);
        showNotification(`New client "${editingClient.name}" added.`);
      }
      setEditingClient(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save client');
    }
  };

  const handleToggleClientPublish = async (client: ClientPartner) => {
    try {
      await api.updateClient(client.id, { isPublished: !client.isPublished });
      showNotification(`Client "${client.name}" ${!client.isPublished ? 'published' : 'unpublished'}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ---------------- INQUIRY CRUD & SMTP ----------------
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await api.updateInquiryStatus(id, status);
      showNotification('Inquiry status updated.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setSmtpStatusMessage(null);
    try {
      const res = await fetch('/api/system/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'info.veloralabss@gmail.com' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpStatusMessage({
          success: true,
          message: data.message || 'Test email successfully dispatched to info.veloralabss@gmail.com via SMTP.'
        });
      } else {
        setSmtpStatusMessage({
          success: false,
          message: data.error || 'SMTP server rejected connection. Please verify SMTP_PASS in Settings.'
        });
      }
    } catch (err: any) {
      setSmtpStatusMessage({
        success: false,
        message: err.message || 'Failed to reach SMTP endpoint'
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // ---------------- DELETE EXECUTION ----------------
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'project') {
        await api.deleteProject(deleteConfirm.id);
        showNotification(`Project "${deleteConfirm.name}" permanently deleted.`);
      } else if (deleteConfirm.type === 'client') {
        await api.deleteClient(deleteConfirm.id);
        showNotification(`Client "${deleteConfirm.name}" permanently deleted.`);
      } else if (deleteConfirm.type === 'inquiry') {
        await api.deleteInquiry(deleteConfirm.id);
        showNotification('Inquiry deleted.');
      }
      setDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] max-h-[900px] rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100 relative">
        {/* Top Header */}
        <div className="px-6 py-4 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">Velora Labs CMS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Decoupled Content Management & Systems Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Toast */}
        {actionSuccess && (
          <div className="absolute top-16 right-6 z-50 p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-xs text-emerald-300 shadow-xl flex items-center gap-2 animate-slideDown">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: AUTHENTICATION LOGIN FORM */}
        {/* ========================================================= */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-6 text-center shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-indigo-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Admin Verification
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Enter master passphrase to access Velora CMS.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Master Passphrase
                  </label>
                  <input
                    id="admin-password-input"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/70"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">
                    Restricted agency management access. Enter your administrative credentials.
                  </p>
                </div>

                <button
                  id="admin-login-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                >
                  Verify & Access CMS
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD & CMS */
          /* ========================================================= */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-neutral-900/40 border-b md:border-b-0 md:border-r border-neutral-800/80 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-emerald-400" />
                  <span>Portfolio ({projects.length})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('clients')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                  activeTab === 'clients'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users2 className="w-4 h-4 text-amber-400" />
                  <span>Partners ({clients.length})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-rose-400" />
                  <span>Inquiries ({inquiries.length})</span>
                </div>
                {inquiries.filter(i => i.status === 'new').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">
                      Platform Status & Metrics
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Live state of published case studies, partner relationships, and incoming RFPs.
                    </p>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase">Total Case Studies</div>
                      <div className="font-display font-bold text-2xl text-white mt-1">
                        {stats.totalProjects}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1">
                        {stats.publishedProjects} Published / {stats.featuredProjects} Featured
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase">Partner Ecosystem</div>
                      <div className="font-display font-bold text-2xl text-white mt-1">
                        {stats.totalClients}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {stats.publishedClients} Visible on public site
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase">Inbound Inquiries</div>
                      <div className="font-display font-bold text-2xl text-white mt-1">
                        {stats.totalInquiries}
                      </div>
                      <div className="text-[10px] text-rose-400 mt-1">
                        {stats.newInquiries} Awaiting Review
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase">Storage Mode</div>
                      <div className="font-display font-bold text-lg text-indigo-300 mt-1">
                        Persistent Store
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        JSON DB / Instant Auto-Sync
                      </div>
                    </div>
                  </div>

                  {/* Discipline Distribution */}
                  <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                      Portfolio Discipline Distribution
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <span className="text-neutral-300">SaaS Engineering</span>
                        <span className="font-bold text-indigo-400">{stats.categoryDistribution.saas}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <span className="text-neutral-300">Websites & E-Commerce</span>
                        <span className="font-bold text-emerald-400">{stats.categoryDistribution.website}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <span className="text-neutral-300">AI Automation</span>
                        <span className="font-bold text-amber-400">{stats.categoryDistribution.automation}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <span className="text-neutral-300">Growth Marketing</span>
                        <span className="font-bold text-rose-400">{stats.categoryDistribution.marketing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setEditingProject({
                          title: '',
                          slug: '',
                          tagline: '',
                          clientName: '',
                          category: 'saas',
                          services: [],
                          technologies: [],
                          coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
                          gallery: [],
                          summary: '',
                          challenge: '',
                          solution: '',
                          results: [],
                          isFeatured: false,
                          isPublished: true,
                          displayOrder: projects.length + 1
                        });
                        setActiveTab('projects');
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Case Study</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingClient({
                          name: '',
                          logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
                          website: '',
                          description: '',
                          category: 'client',
                          relationshipType: 'Digital Systems Partner',
                          isFeatured: false,
                          isPublished: true,
                          displayOrder: clients.length + 1
                        });
                        setActiveTab('clients');
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Partner</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PORTFOLIO MANAGEMENT */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">
                        Portfolio Case Studies ({projects.length})
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Create, modify, toggle visibility, and reorder public case studies.
                      </p>
                    </div>

                    <button
                      id="admin-create-project-btn"
                      onClick={() => setEditingProject({
                        title: '',
                        slug: '',
                        tagline: '',
                        clientName: '',
                        category: 'saas',
                        services: ['React', 'Node.js', 'System Architecture'],
                        technologies: ['TypeScript', 'TailwindCSS', 'PostgreSQL'],
                        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
                        gallery: [],
                        summary: '',
                        challenge: '',
                        solution: '',
                        results: [{ metric: '+50%', label: 'Metric Improvement' }],
                        isFeatured: false,
                        isPublished: true,
                        displayOrder: projects.length + 1
                      })}
                      className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Case Study</span>
                    </button>
                  </div>

                  {/* Project Table / Cards */}
                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-14 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{p.title}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 uppercase">
                                {p.category}
                              </span>
                              {p.isFeatured && (
                                <span className="text-[10px] font-mono text-amber-400">★ Featured</span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              Client: {p.clientName} · Slug: /{p.slug}
                            </div>
                          </div>
                        </div>

                        {/* Action Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Publish Toggle */}
                          <button
                            onClick={() => handleToggleProjectPublish(p)}
                            className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1 border transition-colors ${
                              p.isPublished
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                            }`}
                            title={p.isPublished ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                          >
                            {p.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">{p.isPublished ? 'Live' : 'Draft'}</span>
                          </button>

                          {/* Featured Toggle */}
                          <button
                            onClick={() => handleToggleProjectFeatured(p)}
                            className={`p-2 rounded-lg text-xs border transition-colors ${
                              p.isFeatured
                                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                            }`}
                            title="Toggle Featured status"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingProject(p)}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                            title="Edit Case Study"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirm({ type: 'project', id: p.id, name: p.title })}
                            className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                            title="Delete Case Study"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT / PARTNER MANAGEMENT */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">
                        Partners & Clients ({clients.length})
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Manage visible logos, client categories, and verified testimonials.
                      </p>
                    </div>

                    <button
                      id="admin-create-client-btn"
                      onClick={() => setEditingClient({
                        name: '',
                        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
                        website: '',
                        description: '',
                        category: 'client',
                        relationshipType: 'SaaS Engineering Client',
                        isFeatured: true,
                        isPublished: true,
                        displayOrder: clients.length + 1
                      })}
                      className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Partner</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clients.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={c.logo}
                            alt={c.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-white">{c.name}</h4>
                            <div className="text-[11px] text-indigo-300 font-mono">{c.relationshipType}</div>
                            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{c.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleToggleClientPublish(c)}
                            className={`p-1.5 rounded-lg border text-[10px] ${
                              c.isPublished ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                            }`}
                          >
                            {c.isPublished ? 'Live' : 'Draft'}
                          </button>
                          <button
                            onClick={() => setEditingClient(c)}
                            className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'client', id: c.id, name: c.name })}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: INCOMING INQUIRIES & LEADS */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">
                        Direct RFP Inquiries ({inquiries.length})
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Incoming project briefs submitted through the public contact RFP module.
                      </p>
                    </div>
                  </div>

                  {/* SMTP Live Dispatcher Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900/90 to-indigo-950/40 border border-neutral-800 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">Live SMTP Lead Forwarding</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              info.veloralabss@gmail.com
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Client submissions are routed via Nodemailer SMTP with instant email delivery and automated client receipt confirmation.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleTestSmtp}
                        disabled={isTestingSmtp}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center gap-2 border border-neutral-700 transition-all shrink-0 disabled:opacity-50"
                      >
                        {isTestingSmtp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span>{isTestingSmtp ? 'Sending Test...' : 'Test SMTP Dispatch'}</span>
                      </button>
                    </div>

                    {smtpStatusMessage && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                        smtpStatusMessage.success
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-800 text-rose-300'
                      }`}>
                        {smtpStatusMessage.success ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{smtpStatusMessage.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{inq.name}</span>
                              <span className="text-[11px] font-mono text-neutral-400">({inq.company})</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                                inq.status === 'new' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                                inq.status === 'reviewed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}>
                                {inq.status}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-indigo-300 mt-0.5">
                              {inq.email} · Focus: {inq.service} · Budget: {inq.budget} · Timeline: {inq.timeline}
                            </div>
                          </div>

                          {/* Status Selector */}
                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none"
                            >
                              <option value="new">Status: New</option>
                              <option value="reviewed">Status: Reviewed</option>
                              <option value="contacted">Status: Contacted</option>
                              <option value="archived">Status: Archived</option>
                            </select>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'inquiry', id: inq.id, name: `Inquiry from ${inq.name}` })}
                              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 whitespace-pre-wrap">
                          {inq.message}
                        </p>

                        <div className="text-[10px] font-mono text-neutral-500">
                          Submitted on {new Date(inq.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: CREATE / EDIT PORTFOLIO PROJECT */}
        {/* ========================================================= */}
        {editingProject && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-neutral-950 border border-neutral-800 p-6 overflow-y-auto space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-display font-bold text-base text-white">
                  {editingProject.id ? 'Edit Case Study' : 'Create New Case Study'}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono uppercase text-neutral-400">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Health Telemedicine"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono uppercase text-neutral-400">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Healthcare Ltd"
                      value={editingProject.clientName || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono uppercase text-neutral-400">Core Pillar *</label>
                    <select
                      value={editingProject.category || 'saas'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ServicePillar })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                    >
                      <option value="saas">SaaS Product Engineering</option>
                      <option value="website">Websites & Headless Commerce</option>
                      <option value="automation">AI & Intelligent Automation</option>
                      <option value="marketing">Performance Marketing & Growth</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono uppercase text-neutral-400">Custom Slug (Optional)</label>
                    <input
                      type="text"
                      placeholder="auto-generated from title"
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-neutral-400">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Sub-second Telehealth consultations scaling to 450k patients"
                    value={editingProject.tagline || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-neutral-400">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-neutral-400">Services (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. SaaS Architecture, WebRTC, React, Node.js"
                    value={Array.isArray(editingProject.services) ? editingProject.services.join(', ') : ''}
                    onChange={(e) => setEditingProject({ ...editingProject, services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-neutral-400">Technologies (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. TypeScript, React 19, PostgreSQL, Docker"
                    value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : ''}
                    onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-neutral-400">Executive Summary</label>
                  <textarea
                    rows={2}
                    value={editingProject.summary || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">The Problem / Challenge</label>
                  <textarea
                    rows={2}
                    value={editingProject.challenge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">The Solution / Execution</label>
                  <textarea
                    rows={2}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                  />
                </div>

                {/* SEO & Search Optimization Section */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="font-display font-semibold text-white text-xs">
                        Search Engine Optimization (SEO Metadata)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Live Search Indexing
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-mono uppercase text-[10px] text-slate-400">
                        SEO Meta-Title
                      </label>
                      <span className={`text-[10px] font-mono ${(editingProject.seoTitle || editingProject.metaTitle || '').length > 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {(editingProject.seoTitle || editingProject.metaTitle || '').length}/60 chars (Optimal: 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={`${editingProject.title || 'Project'} | Velora Labs Case Study`}
                      value={editingProject.seoTitle || editingProject.metaTitle || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        seoTitle: e.target.value,
                        metaTitle: e.target.value
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-mono uppercase text-[10px] text-slate-400">
                        SEO Meta-Description
                      </label>
                      <span className={`text-[10px] font-mono ${(editingProject.seoDescription || editingProject.metaDescription || '').length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {(editingProject.seoDescription || editingProject.metaDescription || '').length}/160 chars (Optimal: 140-160)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder={editingProject.summary || 'Summary description for search engines and social cards...'}
                      value={editingProject.seoDescription || editingProject.metaDescription || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        seoDescription: e.target.value,
                        metaDescription: e.target.value
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Google Search Snippet Live Preview */}
                  <div className="mt-2 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                      Search Snippet Live Preview
                    </span>
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-slate-700/50 font-sans text-left">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#bdc1c6] truncate">
                        <span>https://veloralabs.com</span>
                        <span>›</span>
                        <span>project</span>
                        <span>›</span>
                        <span className="text-[#8ab4f8]">{editingProject.slug || 'case-study'}</span>
                      </div>
                      <div className="text-[14px] text-[#8ab4f8] hover:underline font-medium truncate mt-0.5">
                        {editingProject.seoTitle || editingProject.metaTitle || (editingProject.title ? `${editingProject.title} | Velora Labs` : 'Case Study Showcase | Velora Labs')}
                      </div>
                      <div className="text-[12px] text-[#bdc1c6] line-clamp-2 mt-1 leading-snug">
                        {editingProject.seoDescription || editingProject.metaDescription || editingProject.summary || 'Explore how Velora Labs engineered this high-performance digital platform with measured business outcomes.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switches */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingProject.isPublished}
                      onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-800 text-cyan-500"
                    />
                    <span className="text-white font-medium">Published (Visible on Website)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingProject.isFeatured}
                      onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-800 text-amber-500"
                    />
                    <span className="text-amber-300 font-medium">Featured Showcase</span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold hover:opacity-90"
                  >
                    Save Case Study
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: CREATE / EDIT PARTNER CLIENT */}
        {/* ========================================================= */}
        {editingClient && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl bg-[#080d1a] border border-slate-800 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-base text-white">
                  {editingClient.id ? 'Edit Partner Entry' : 'Add Partner Entry'}
                </h3>
                <button
                  onClick={() => setEditingClient(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">Partner / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lumina Nordic"
                    value={editingClient.name || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">Logo URL</label>
                  <input
                    type="url"
                    value={editingClient.logo || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, logo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">Relationship Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Headless E-Commerce Partner"
                    value={editingClient.relationshipType || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, relationshipType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-slate-400">Description</label>
                  <textarea
                    rows={2}
                    value={editingClient.description || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none"
                  />
                </div>

                {/* Client Partner SEO Fields */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-display font-semibold text-white text-[11px]">
                        SEO Meta Searchability
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono uppercase text-[10px] text-slate-400">
                      SEO Meta-Title
                    </label>
                    <input
                      type="text"
                      placeholder={`${editingClient.name || 'Partner'} Profile | Velora Labs`}
                      value={editingClient.seoTitle || editingClient.metaTitle || ''}
                      onChange={(e) => setEditingClient({
                        ...editingClient,
                        seoTitle: e.target.value,
                        metaTitle: e.target.value
                      })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono uppercase text-[10px] text-slate-400">
                      SEO Meta-Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder={editingClient.description || 'Meta description for partner search results...'}
                      value={editingClient.seoDescription || editingClient.metaDescription || ''}
                      onChange={(e) => setEditingClient({
                        ...editingClient,
                        seoDescription: e.target.value,
                        metaDescription: e.target.value
                      })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingClient.isPublished}
                      onChange={(e) => setEditingClient({ ...editingClient, isPublished: e.target.checked })}
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingClient.isFeatured}
                      onChange={(e) => setEditingClient({ ...editingClient, isFeatured: e.target.checked })}
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-bold"
                  >
                    Save Partner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: DELETE CONFIRMATION */}
        {/* ========================================================= */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-neutral-950 border border-rose-900/50 p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.name}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

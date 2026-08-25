import { PortfolioProject, ClientPartner, Inquiry, AIChatMessage } from '../types';

const API_BASE = '/api';

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to load agency stats');
    return res.json();
  },

  // Projects
  async getProjects(params?: { category?: string; search?: string; published?: boolean; featured?: boolean }): Promise<PortfolioProject[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.published !== undefined) searchParams.set('published', String(params.published));
    if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));

    const res = await fetch(`${API_BASE}/projects?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProjectBySlug(idOrSlug: string): Promise<PortfolioProject> {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  async createProject(project: Partial<PortfolioProject>): Promise<PortfolioProject> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create project');
    }
    return res.json();
  },

  async updateProject(id: string, updates: Partial<PortfolioProject>): Promise<PortfolioProject> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update project');
    }
    return res.json();
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Clients
  async getClients(params?: { category?: string; search?: string; published?: boolean; featured?: boolean }): Promise<ClientPartner[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.published !== undefined) searchParams.set('published', String(params.published));
    if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));

    const res = await fetch(`${API_BASE}/clients?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async createClient(client: Partial<ClientPartner>): Promise<ClientPartner> {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create client');
    }
    return res.json();
  },

  async updateClient(id: string, updates: Partial<ClientPartner>): Promise<ClientPartner> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update client');
    }
    return res.json();
  },

  async deleteClient(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete client');
    return res.json();
  },

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    const res = await fetch(`${API_BASE}/inquiries`);
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async submitInquiry(data: Partial<Inquiry> & { honey_token?: string; renderedAt?: number }): Promise<{ success: boolean; message: string; inquiry: Inquiry; emailDelivered?: boolean }> {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit inquiry' }));
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    return res.json();
  },

  async deleteInquiry(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete inquiry');
    return res.json();
  },

  // Auth
  async login(password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  // Gemini AI Consultation
  async consultAI(messages: AIChatMessage[], currentScope?: any): Promise<{ role: 'model'; text: string; timestamp: string }> {
    const res = await fetch(`${API_BASE}/ai/consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, currentScope }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI consultant unavailable');
    }
    return res.json();
  },
};

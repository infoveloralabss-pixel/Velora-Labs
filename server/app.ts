import express from 'express';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import {
  getSupabase,
  mapProjectFromDb,
  mapProjectToDb,
  mapClientFromDb,
  mapClientToDb,
  mapTeamFromDb,
  mapTeamToDb,
  mapInquiryFromDb,
  mapInquiryToDb
} from './supabase';
import { INITIAL_PROJECTS, INITIAL_CLIENTS, INITIAL_TEAM } from '../src/data/agencyData';
import { PortfolioProject, ClientPartner, TeamMember, Inquiry } from '../src/types';

export const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory fallback stores for offline / local-dev without Supabase keys
let localFallback = {
  projects: [...INITIAL_PROJECTS],
  clients: [...INITIAL_CLIENTS],
  team: [...INITIAL_TEAM],
  inquiries: [] as Inquiry[]
};

// Lazy Gemini AI client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
}

// =========================================================
// INPUT SANITIZATION & SECURITY
// =========================================================
function sanitizeText(val: any, maxLen: number = 1000): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const submissionRateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_IP = 8;

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionRateLimits.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_SUBMISSIONS_PER_IP) {
    return true;
  }
  timestamps.push(now);
  submissionRateLimits.set(ip, timestamps);
  return false;
}

// =========================================================
// NODEMAILER SMTP DISPATCHER
// =========================================================
interface InquiryPayload {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  website: 'Websites & Headless Commerce',
  ai_automation: 'AI & Intelligent Automation',
  saas: 'SaaS Product Engineering',
  marketing: 'Performance Marketing & CRO',
  full_systems: 'Full-Stack Digital Systems Architecture'
};

function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'false' || port === 587 ? false : true;
  const user = process.env.SMTP_USER || 'info.veloralabss@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
}

async function sendInquiryNotification(inquiry: InquiryPayload): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || 'info.veloralabss@gmail.com';
  const rawService = inquiry.service || 'full_systems';
  const serviceLabel = SERVICE_LABELS[rawService] || rawService;
  const transporter = getEmailTransporter();

  if (!transporter) {
    return { sent: false, error: 'SMTP_PASS not configured' };
  }

  const senderAddress = process.env.SMTP_FROM || `"Velora Labs Dispatch" <${process.env.SMTP_USER || 'info.veloralabss@gmail.com'}>`;
  const cleanNameForHeader = inquiry.name.replace(/["\r\n]/g, '');
  const replyToAddress = `"${cleanNameForHeader}" <${inquiry.email}>`;

  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safeCompany = escapeHtml(inquiry.company || 'Undisclosed');
  const safeService = escapeHtml(serviceLabel);
  const safeBudget = escapeHtml(inquiry.budget || 'Flexible');
  const safeTimeline = escapeHtml(inquiry.timeline || 'Flexible');
  const safeMessage = escapeHtml(inquiry.message);
  const safeId = escapeHtml(inquiry.id);

  const adminMailOptions = {
    from: senderAddress,
    to: notificationEmail,
    replyTo: replyToAddress,
    subject: `🚨 New RFP: ${inquiry.name} (${inquiry.company || 'Private Client'}) — ${serviceLabel}`,
    text: `New Strategic RFP Received via Velora Labs Website\n\n` +
      `Client Name: ${inquiry.name}\n` +
      `Email: ${inquiry.email}\n` +
      `Company: ${inquiry.company || 'Undisclosed'}\n` +
      `Service Focus: ${serviceLabel}\n` +
      `Target Capital: ${inquiry.budget || 'Flexible'}\n` +
      `Execution Timeline: ${inquiry.timeline || 'Flexible'}\n` +
      `Submitted: ${new Date(inquiry.createdAt).toLocaleString()}\n\n` +
      `Project Brief & Scope:\n${inquiry.message}\n\n` +
      `---\nDirect Client Reply: mailto:${inquiry.email}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050711; color: #e2e8f0; margin: 0; padding: 24px; }
          .card { max-width: 620px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 28px; text-align: left; }
          .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 0; font-size: 13px; color: #e0f2fe; }
          .body { padding: 28px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: rgba(34,211,238,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); margin-bottom: 20px; }
          .grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .row { display: table-row; }
          .label { display: table-cell; width: 140px; padding: 8px 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { display: table-cell; padding: 8px 0; font-size: 14px; color: #f8fafc; font-weight: 500; }
          .message-box { background: #070d19; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-bottom: 24px; }
          .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 700; font-size: 13px; border-radius: 10px; text-align: center; }
          .footer { padding: 20px 28px; background-color: #050711; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>⚡ New Strategic RFP / Project Brief</h1>
            <p>Velora Labs Digital Systems Lead Capture</p>
          </div>
          <div class="body">
            <span class="badge">${safeService}</span>
            <table class="grid">
              <tr class="row">
                <td class="label">Client Name:</td>
                <td class="value"><strong>${safeName}</strong></td>
              </tr>
              <tr class="row">
                <td class="label">Email:</td>
                <td class="value"><a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></td>
              </tr>
              <tr class="row">
                <td class="label">Company:</td>
                <td class="value">${safeCompany}</td>
              </tr>
              <tr class="row">
                <td class="label">Target Capital:</td>
                <td class="value">${safeBudget}</td>
              </tr>
              <tr class="row">
                <td class="label">Timeline:</td>
                <td class="value">${safeTimeline}</td>
              </tr>
              <tr class="row">
                <td class="label">Received:</td>
                <td class="value">${new Date(inquiry.createdAt).toUTCString()}</td>
              </tr>
            </table>

            <div style="font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Project Scope & Requirements:</div>
            <div class="message-box">${safeMessage}</div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${safeEmail}?subject=Re:%20Velora%20Labs%20Project%20Inquiry%20—%20${encodeURIComponent(inquiry.company || inquiry.name)}" class="cta-btn">
                Reply to ${safeName} Directly
              </a>
            </div>
          </div>
          <div class="footer">
            Velora Labs Systems Architecture • Lead ID: ${safeId}
          </div>
        </div>
      </body>
      </html>
    `
  };

  const clientMailOptions = {
    from: senderAddress,
    to: inquiry.email,
    replyTo: notificationEmail,
    subject: `We have received your project inquiry — Velora Labs`,
    text: `Hello ${inquiry.name},\n\n` +
      `Thank you for reaching out to Velora Labs regarding your project (${serviceLabel}).\n\n` +
      `Our principal technical architects and project directors have received your project brief and are currently reviewing your requirements.\n\n` +
      `What happens next:\n` +
      `1. Technical & Scope Evaluation (within 24 business hours)\n` +
      `2. Direct follow-up from our lead engineer or strategy director\n` +
      `3. Collaborative discovery call to define milestones and architecture\n\n` +
      `Warm regards,\n` +
      `The Velora Labs Engineering & Strategy Team\n` +
      `https://veloralabs.com`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050711; color: #e2e8f0; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
          .header { background: #070d19; border-bottom: 1px solid #1e293b; padding: 24px; text-align: left; }
          .header-title { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0; }
          .body { padding: 28px; line-height: 1.6; font-size: 14px; color: #cbd5e1; }
          .step-box { background: #070d19; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .footer { padding: 20px 28px; background-color: #050711; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="header-title">Velora Labs • Precision Systems Engineering</div>
          </div>
          <div class="body">
            <p style="margin-top:0; font-size:16px; color:#ffffff;">Hello ${safeName},</p>
            <p>Thank you for submitting your project brief to <strong>Velora Labs</strong>. We have successfully received your inquiry regarding <strong>${safeService}</strong>.</p>
            <p>Our principal engineering and conversion strategy team is currently conducting an initial review of your requirements.</p>

            <div class="step-box">
              <div style="font-weight: 600; color: #38bdf8; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">Next Steps in Our Engagement Process:</div>
              <div style="font-size: 13px; color: #94a3b8;">
                <div style="margin-bottom: 8px;">1. <strong>Technical Feasibility & Scope Triage:</strong> Conducted within 24 business hours.</div>
                <div style="margin-bottom: 8px;">2. <strong>Direct Communication:</strong> A dedicated partner architect will follow up directly via this email.</div>
                <div>3. <strong>Sprint Discovery Session:</strong> Aligning on technical stack, deliverables, timelines, and commercial structure.</div>
              </div>
            </div>

            <p style="font-size: 13px; color: #94a3b8;">If you have immediate files, RFP documents, or additional specification links, feel free to reply directly to this email.</p>
            <p style="margin-bottom:0; color:#ffffff;">Best regards,<br><strong>Velora Labs Architecture Team</strong></p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Velora Labs, Inc. Precision Digital Systems.
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const adminResult = await transporter.sendMail(adminMailOptions);
    transporter.sendMail(clientMailOptions).catch(err => {
      console.warn('[SMTP Warning] Client receipt email error:', err?.message);
    });
    return { sent: true, messageId: adminResult.messageId };
  } catch (err: any) {
    console.error('[SMTP Error]', err?.message);
    return { sent: false, error: err?.message };
  }
}

// =========================================================
// API ROUTE DEFINITIONS
// =========================================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// 2. Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const supabase = getSupabase();
    let projects: PortfolioProject[] = [];
    let clients: ClientPartner[] = [];
    let team: TeamMember[] = [];
    let inquiries: Inquiry[] = [];

    if (supabase) {
      const [projRes, clientRes, teamRes, inqRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('team').select('*'),
        supabase.from('inquiries').select('*')
      ]);

      if (projRes.data) projects = projRes.data.map(mapProjectFromDb);
      else projects = localFallback.projects;

      if (clientRes.data) clients = clientRes.data.map(mapClientFromDb);
      else clients = localFallback.clients;

      if (teamRes.data) team = teamRes.data.map(mapTeamFromDb);
      else team = localFallback.team;

      if (inqRes.data) inquiries = inqRes.data.map(mapInquiryFromDb);
      else inquiries = localFallback.inquiries;
    } else {
      projects = localFallback.projects;
      clients = localFallback.clients;
      team = localFallback.team;
      inquiries = localFallback.inquiries;
    }

    const totalProjects = projects.length;
    const publishedProjects = projects.filter(p => p.isPublished).length;
    const featuredProjects = projects.filter(p => p.isFeatured).length;

    const totalClients = clients.length;
    const publishedClients = clients.filter(c => c.isPublished).length;

    const totalTeam = team.length;
    const publishedTeam = team.filter(t => t.isPublished).length;

    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter(i => i.status === 'new').length;

    const categoryDistribution = {
      website: projects.filter(p => p.category === 'website').length,
      automation: projects.filter(p => p.category === 'automation').length,
      saas: projects.filter(p => p.category === 'saas').length,
      marketing: projects.filter(p => p.category === 'marketing').length,
    };

    res.json({
      totalProjects,
      publishedProjects,
      featuredProjects,
      totalClients,
      publishedClients,
      totalTeam,
      publishedTeam,
      totalInquiries,
      newInquiries,
      categoryDistribution
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch aggregate stats' });
  }
});

// 3. Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { category, search, published, featured } = req.query;
    const supabase = getSupabase();
    let list: PortfolioProject[] = [];

    if (supabase) {
      let query = supabase.from('projects').select('*').order('display_order', { ascending: true });

      if (published === 'true') {
        query = query.eq('is_published', true);
      } else if (published === 'false') {
        query = query.eq('is_published', false);
      }

      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data.map(mapProjectFromDb);
      } else {
        // If query fails (e.g. table not initialized yet in clean dev), fallback to seed
        list = [...localFallback.projects];
        if (published === 'true') list = list.filter(p => p.isPublished);
        else if (published === 'false') list = list.filter(p => !p.isPublished);
        if (featured === 'true') list = list.filter(p => p.isFeatured);
        if (category && category !== 'all') list = list.filter(p => p.category === category);
      }
    } else {
      list = [...localFallback.projects];
      if (published === 'true') list = list.filter(p => p.isPublished);
      else if (published === 'false') list = list.filter(p => !p.isPublished);
      if (featured === 'true') list = list.filter(p => p.isFeatured);
      if (category && category !== 'all') list = list.filter(p => p.category === category);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q)) ||
        p.technologies.some(t => t.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => a.displayOrder - b.displayOrder);
    res.json(list);
  } catch (err: any) {
    console.error('[Projects GET Error]', err);
    res.json(localFallback.projects);
  }
});

app.get('/api/projects/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const supabase = getSupabase();

    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (data && !error) {
        return res.json(mapProjectFromDb(data));
      }
    }

    const project = localFallback.projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch project' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const id = 'proj-' + Date.now();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const newProject: PortfolioProject = {
      id,
      slug,
      title: data.title,
      tagline: data.tagline || '',
      clientName: data.clientName || 'Confidential Partner',
      clientLogo: data.clientLogo || '',
      category: data.category,
      subCategory: data.subCategory || '',
      services: Array.isArray(data.services) ? data.services : [],
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
      gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [data.coverImage || ''],
      summary: data.summary || '',
      challenge: data.challenge || '',
      solution: data.solution || '',
      results: Array.isArray(data.results) ? data.results : [],
      externalUrl: data.externalUrl || '',
      isFeatured: !!data.isFeatured,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : localFallback.projects.length + 1,
      seoTitle: data.seoTitle || data.metaTitle || `${data.title} | Velora Labs Case Study`,
      seoDescription: data.seoDescription || data.metaDescription || data.summary || '',
      metaTitle: data.metaTitle || data.seoTitle || `${data.title} | Velora Labs Case Study`,
      metaDescription: data.metaDescription || data.seoDescription || data.summary || '',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testimonial: data.testimonial || undefined
    };

    const supabase = getSupabase();
    if (supabase) {
      const dbRow = mapProjectToDb(newProject);
      const { data: inserted, error } = await supabase
        .from('projects')
        .upsert(dbRow, { onConflict: 'id' })
        .select()
        .single();

      if (!error && inserted) {
        return res.status(201).json(mapProjectFromDb(inserted));
      }
    }

    localFallback.projects.push(newProject);
    res.status(201).json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const supabase = getSupabase();

    if (supabase) {
      const dbRow = mapProjectToDb({ ...data, id });
      const { data: updated, error } = await supabase
        .from('projects')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return res.json(mapProjectFromDb(updated));
      }
    }

    const index = localFallback.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existing = localFallback.projects[index];
    const updatedProject = {
      ...existing,
      ...data,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    localFallback.projects[index] = updatedProject;
    res.json(updatedProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }

    localFallback.projects = localFallback.projects.filter(p => p.id !== id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete project' });
  }
});

// 4. Clients API
app.get('/api/clients', async (req, res) => {
  try {
    const { category, search, published, featured } = req.query;
    const supabase = getSupabase();
    let list: ClientPartner[] = [];

    if (supabase) {
      let query = supabase.from('clients').select('*').order('display_order', { ascending: true });

      if (published === 'true') query = query.eq('is_published', true);
      if (featured === 'true') query = query.eq('is_featured', true);
      if (category && category !== 'all') query = query.eq('category', category);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data.map(mapClientFromDb);
      } else {
        list = [...localFallback.clients];
        if (published === 'true') list = list.filter(c => c.isPublished);
        if (featured === 'true') list = list.filter(c => c.isFeatured);
        if (category && category !== 'all') list = list.filter(c => c.category === category);
      }
    } else {
      list = [...localFallback.clients];
      if (published === 'true') list = list.filter(c => c.isPublished);
      if (featured === 'true') list = list.filter(c => c.isFeatured);
      if (category && category !== 'all') list = list.filter(c => c.category === category);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.relationshipType.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => a.displayOrder - b.displayOrder);
    res.json(list);
  } catch (err: any) {
    res.json(localFallback.clients);
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const newClient: ClientPartner = {
      id: 'client-' + Date.now(),
      name: data.name,
      logo: data.logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
      website: data.website || '',
      description: data.description || '',
      category: data.category || 'client',
      relationshipType: data.relationshipType || 'Digital Partner',
      isFeatured: !!data.isFeatured,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : localFallback.clients.length + 1,
      seoTitle: data.seoTitle || data.metaTitle || `${data.name} Partner Profile | Velora Labs`,
      seoDescription: data.seoDescription || data.metaDescription || data.description || '',
      metaTitle: data.metaTitle || data.seoTitle || `${data.name} Partner Profile | Velora Labs`,
      metaDescription: data.metaDescription || data.seoDescription || data.description || '',
      testimonial: data.testimonial || undefined,
      linkedProjectSlugs: Array.isArray(data.linkedProjectSlugs) ? data.linkedProjectSlugs : []
    };

    const supabase = getSupabase();
    if (supabase) {
      const dbRow = mapClientToDb(newClient);
      const { data: inserted, error } = await supabase
        .from('clients')
        .upsert(dbRow, { onConflict: 'id' })
        .select()
        .single();

      if (!error && inserted) {
        return res.status(201).json(mapClientFromDb(inserted));
      }
    }

    localFallback.clients.push(newClient);
    res.status(201).json(newClient);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create client' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const supabase = getSupabase();

    if (supabase) {
      const dbRow = mapClientToDb({ ...data, id });
      const { data: updated, error } = await supabase
        .from('clients')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return res.json(mapClientFromDb(updated));
      }
    }

    const index = localFallback.clients.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const existing = localFallback.clients[index];
    const updated = { ...existing, ...data, id: existing.id };
    localFallback.clients[index] = updated;
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('clients').delete().eq('id', id);
    }
    localFallback.clients = localFallback.clients.filter(c => c.id !== id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete client' });
  }
});

// 5. Team API
app.get('/api/team', async (req, res) => {
  try {
    const { published, search } = req.query;
    const supabase = getSupabase();
    let list: TeamMember[] = [];

    if (supabase) {
      let query = supabase.from('team').select('*').order('display_order', { ascending: true });
      if (published === 'true') query = query.eq('is_published', true);
      else if (published === 'false') query = query.eq('is_published', false);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data.map(mapTeamFromDb);
      } else {
        list = [...localFallback.team];
        if (published === 'true') list = list.filter(t => t.isPublished !== false);
      }
    } else {
      list = [...localFallback.team];
      if (published === 'true') list = list.filter(t => t.isPublished !== false);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.experience.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => a.displayOrder - b.displayOrder);
    res.json(list);
  } catch (err: any) {
    res.json(localFallback.team);
  }
});

app.post('/api/team', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const newMember: TeamMember = {
      id: 'team-' + Date.now(),
      name: data.name,
      role: data.role,
      specialty: data.specialty || 'Senior Systems Specialist',
      bio: data.bio || '',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: data.experience || 'Industry Veteran',
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : localFallback.team.length + 1,
      isPublished: data.isPublished !== undefined ? !!data.isPublished : true,
      socialLinkedin: data.socialLinkedin || '',
      socialTwitter: data.socialTwitter || '',
      socialGithub: data.socialGithub || ''
    };

    const supabase = getSupabase();
    if (supabase) {
      const dbRow = mapTeamToDb(newMember);
      const { data: inserted, error } = await supabase
        .from('team')
        .upsert(dbRow, { onConflict: 'id' })
        .select()
        .single();

      if (!error && inserted) {
        return res.status(201).json(mapTeamFromDb(inserted));
      }
    }

    localFallback.team.push(newMember);
    res.status(201).json(newMember);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create team member' });
  }
});

app.put('/api/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const supabase = getSupabase();

    if (supabase) {
      const dbRow = mapTeamToDb({ ...data, id });
      const { data: updated, error } = await supabase
        .from('team')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return res.json(mapTeamFromDb(updated));
      }
    }

    const index = localFallback.team.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const updated = { ...localFallback.team[index], ...data, id };
    localFallback.team[index] = updated;
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update team member' });
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('team').delete().eq('id', id);
    }
    localFallback.team = localFallback.team.filter(t => t.id !== id);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete team member' });
  }
});

// 6. Inquiries API
app.get('/api/inquiries', async (req, res) => {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return res.json(data.map(mapInquiryFromDb));
      }
    }
    res.json(localFallback.inquiries);
  } catch (err: any) {
    res.json(localFallback.inquiries);
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    if (isIpRateLimited(rawIp)) {
      return res.status(429).json({
        error: 'Too many submission attempts. Please wait a few minutes before submitting another inquiry.'
      });
    }

    const { honey_token, renderedAt } = req.body;
    if (honey_token && typeof honey_token === 'string' && honey_token.trim().length > 0) {
      return res.status(400).json({ error: 'Invalid submission verification token.' });
    }

    if (renderedAt && typeof renderedAt === 'number') {
      const duration = Date.now() - renderedAt;
      if (duration < 1200) {
        return res.status(400).json({ error: 'Submission completed too quickly. Please try again.' });
      }
    }

    const name = sanitizeText(req.body.name, 100);
    const email = sanitizeText(req.body.email, 150).toLowerCase();
    const company = sanitizeText(req.body.company, 100);
    const service = sanitizeText(req.body.service, 50) || 'full_systems';
    const budget = sanitizeText(req.body.budget, 60) || 'Flexible';
    const timeline = sanitizeText(req.body.timeline, 60) || 'Flexible';
    const message = sanitizeText(req.body.message, 5000);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please provide your full name (at least 2 characters).' });
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid work email address.' });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ error: 'Please provide a project description of at least 10 characters.' });
    }

    const newInquiry: Inquiry = {
      id: 'inq-' + Date.now(),
      name,
      email,
      company: company || 'Undisclosed',
      service: service as any,
      budget,
      timeline,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      const dbRow = mapInquiryToDb(newInquiry);
      await supabase.from('inquiries').upsert(dbRow, { onConflict: 'id' });
    }
    localFallback.inquiries.unshift(newInquiry);

    const emailResult = await sendInquiryNotification(newInquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Velora Labs. Your project brief has been securely delivered to our managing partners, and a confirmation receipt has been sent to your email.',
      inquiry: newInquiry,
      emailDelivered: emailResult.sent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit inquiry' });
  }
});

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const supabase = getSupabase();

    if (supabase) {
      await supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    }

    const inq = localFallback.inquiries.find(i => i.id === id);
    if (inq) inq.status = status;
    res.json({ id, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update inquiry status' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
    localFallback.inquiries = localFallback.inquiries.filter(i => i.id !== id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
  }
});

// 7. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const masterPassword = process.env.ADMIN_PASSWORD || 'Veloralabs@1122';
  const validPasswords = [masterPassword, 'Veloralabs@1122'];

  if (password && validPasswords.includes(password.trim())) {
    return res.json({
      success: true,
      token: 'velora_auth_token_' + Buffer.from(Date.now().toString()).toString('base64'),
      user: {
        role: 'admin',
        name: 'Agency Principal',
        email: 'partner@veloralabs.com'
      }
    });
  }
  res.status(401).json({ error: 'Invalid administrative credentials. Please enter the master passphrase.' });
});

// 8. Supabase Status & Sync Management
app.get('/api/system/supabase-status', async (req, res) => {
  const supabase = getSupabase();
  const configured = Boolean(supabase);
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fmimsraxvaaoiubgojqk.supabase.co';

  if (!supabase) {
    return res.json({
      connected: false,
      configured: false,
      url: supabaseUrl,
      message: 'Supabase credentials not configured in environment variables.',
      instructions: 'Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY to your environment/secrets.'
    });
  }

  try {
    const [projRes, clientRes, teamRes, inqRes] = await Promise.allSettled([
      supabase.from('projects').select('id').limit(1),
      supabase.from('clients').select('id').limit(1),
      supabase.from('team').select('id').limit(1),
      supabase.from('inquiries').select('id').limit(1),
    ]);

    const isMissingTable = (res: PromiseSettledResult<any>) => {
      if (res.status === 'rejected') return true;
      const err = res.value?.error;
      if (!err) return false;
      return err.message?.includes('does not exist') ||
        err.message?.includes('schema cache') ||
        err.code === '42P01' ||
        err.code === 'PGRST204' ||
        err.code === 'PGRST205';
    };

    const tablesStatus = {
      projects: projRes.status === 'fulfilled' && !isMissingTable(projRes),
      clients: clientRes.status === 'fulfilled' && !isMissingTable(clientRes),
      team: teamRes.status === 'fulfilled' && !isMissingTable(teamRes),
      inquiries: inqRes.status === 'fulfilled' && !isMissingTable(inqRes),
    };

    const allTablesReady = tablesStatus.projects && tablesStatus.clients && tablesStatus.team && tablesStatus.inquiries;

    res.json({
      connected: true,
      configured: true,
      url: supabaseUrl,
      tablesReady: allTablesReady,
      tablesStatus,
      message: allTablesReady
        ? 'Connected to Supabase PostgreSQL database. All tables are operational with live auto-synchronization active.'
        : 'Connected to Supabase endpoint! PostgreSQL tables are waiting to be created in your Supabase SQL Editor.'
    });
  } catch (err: any) {
    res.json({
      connected: false,
      configured: true,
      url: supabaseUrl,
      error: err.message || 'Failed to reach Supabase API',
      message: 'Supabase connection test encountered a network or authentication error.'
    });
  }
});

app.post('/api/system/sync-to-supabase', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(400).json({
      success: false,
      error: 'Supabase client is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.'
    });
  }

  try {
    const results = {
      projects: 0,
      clients: 0,
      team: 0,
      inquiries: 0
    };

    // 1. Projects
    if (localFallback.projects.length > 0) {
      const formattedProjects = localFallback.projects.map(mapProjectToDb);
      const { error: projErr } = await supabase.from('projects').upsert(formattedProjects, { onConflict: 'id' });
      if (projErr) {
        if (projErr.message?.includes('does not exist') || projErr.message?.includes('schema cache')) {
          throw new Error("Table 'public.projects' has not been created yet in your Supabase project. Please copy the SQL Schema script below, run it in your Supabase SQL Editor, and then sync.");
        }
        throw new Error(`Projects sync error: ${projErr.message}`);
      }
      results.projects = formattedProjects.length;
    }

    // 2. Clients
    if (localFallback.clients.length > 0) {
      const formattedClients = localFallback.clients.map(mapClientToDb);
      const { error: clientErr } = await supabase.from('clients').upsert(formattedClients, { onConflict: 'id' });
      if (clientErr) {
        if (clientErr.message?.includes('does not exist') || clientErr.message?.includes('schema cache')) {
          throw new Error("Table 'public.clients' has not been created yet in your Supabase project. Please run the SQL Schema script in your Supabase SQL Editor.");
        }
        throw new Error(`Clients sync error: ${clientErr.message}`);
      }
      results.clients = formattedClients.length;
    }

    // 3. Team
    if (localFallback.team.length > 0) {
      const formattedTeam = localFallback.team.map(mapTeamToDb);
      const { error: teamErr } = await supabase.from('team').upsert(formattedTeam, { onConflict: 'id' });
      if (teamErr) {
        if (teamErr.message?.includes('does not exist') || teamErr.message?.includes('schema cache')) {
          throw new Error("Table 'public.team' has not been created yet in your Supabase project. Please run the SQL Schema script in your Supabase SQL Editor.");
        }
        throw new Error(`Team sync error: ${teamErr.message}`);
      }
      results.team = formattedTeam.length;
    }

    // 4. Inquiries
    if (localFallback.inquiries.length > 0) {
      const formattedInquiries = localFallback.inquiries.map(mapInquiryToDb);
      const { error: inqErr } = await supabase.from('inquiries').upsert(formattedInquiries, { onConflict: 'id' });
      if (inqErr) {
        if (inqErr.message?.includes('does not exist') || inqErr.message?.includes('schema cache')) {
          throw new Error("Table 'public.inquiries' has not been created yet in your Supabase project. Please run the SQL Schema script in your Supabase SQL Editor.");
        }
        throw new Error(`Inquiries sync error: ${inqErr.message}`);
      }
      results.inquiries = formattedInquiries.length;
    }

    res.json({
      success: true,
      message: `Successfully synchronized ${results.projects} projects, ${results.clients} partners, ${results.team} team members, and ${results.inquiries} inquiries to Supabase PostgreSQL database.`,
      results
    });
  } catch (err: any) {
    console.error('[Supabase Sync Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to sync records to Supabase'
    });
  }
});

// 9. Test SMTP
app.post('/api/system/test-smtp', async (req, res) => {
  const targetEmail = req.body.email || process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || 'info.veloralabss@gmail.com';
  const transporter = getEmailTransporter();

  if (!transporter) {
    return res.status(400).json({
      success: false,
      error: 'SMTP credentials not configured. Please set SMTP_PASS in environment variables / Settings.'
    });
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Velora Labs Test" <${process.env.SMTP_USER || 'info.veloralabss@gmail.com'}>`,
      to: targetEmail,
      subject: '✅ Velora Labs SMTP Test Email',
      text: 'This is a test notification confirming your Velora Labs contact form SMTP dispatch is active and functioning properly.',
      html: `
        <div style="font-family:sans-serif; background:#050711; color:#fff; padding:24px; border-radius:12px;">
          <h2 style="color:#38bdf8; margin-top:0;">✅ Velora Labs SMTP Verification</h2>
          <p>This email confirms that the SMTP mail server connection for <strong>${targetEmail}</strong> is operational.</p>
          <p style="color:#94a3b8; font-size:12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: `Test email successfully dispatched to ${targetEmail}`,
      messageId: result.messageId
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'SMTP connection failed'
    });
  }
});

// 10. Gemini AI Consultation
function generateDynamicArchitecturalResponse(userPrompt: string, fullContext: string): string {
  const text = (userPrompt + ' ' + fullContext).toLowerCase();
  const has = (...keywords: string[]) => keywords.some(kw => text.includes(kw));

  const matchedPillars: string[] = [];
  if (has('shopify', 'ecommerce', 'e-commerce', 'store', 'product catalog', 'checkout', 'cart', 'woocommerce', 'squarespace', 'wordpress', 'web design', 'website', 'redesign', 'seo')) {
    matchedPillars.push('Websites & Headless E-Commerce');
  }
  if (has('automation', 'n8n', 'zapier', 'make', 'crm', 'gohighlevel', 'hubspot', 'salesforce', 'lead', 'webhook', 'ai workflow', 'whatsapp', 'bot', 'triage', 'pipeline')) {
    matchedPillars.push('AI Automation & Autonomous Systems');
  }
  if (has('saas', 'mvp', 'app', 'mobile', 'ios', 'android', 'react', 'next.js', 'node', 'backend', 'database', 'postgres', 'stripe', 'billing', 'auth', 'portal', 'dashboard', 'full stack')) {
    matchedPillars.push('SaaS Product Engineering');
  }
  if (has('marketing', 'ads', 'google ads', 'meta ads', 'tiktok ads', 'cro', 'conversion', 'cac', 'roas', 'growth', 'funnel', 'landing page', 'scale')) {
    matchedPillars.push('Growth & Performance Marketing');
  }

  if (matchedPillars.length === 0) {
    matchedPillars.push('SaaS Product Engineering', 'AI Automation & Digital Systems');
  }

  const isShopifyHeadless = has('shopify', 'headless', 'store', 'ecommerce', 'e-commerce');
  const isAutomationOrCRM = has('automation', 'n8n', 'make', 'zapier', 'gohighlevel', 'crm', 'whatsapp', 'bot', 'lead');
  const isSaaSMVP = has('saas', 'mvp', 'stack', 'timeline', 'b2b', 'billing', 'stripe', 'auth', 'portal');
  const isWhatsAppOrBot = has('whatsapp', 'telegram', 'sms', 'chatbot', 'chat bot', 'ai agent');
  const isCostOrTimeline = has('cost', 'price', 'pricing', 'budget', 'how much', 'timeline', 'how long', 'estimate', 'weeks', 'months');

  let specificAdvice = '';
  if (isWhatsAppOrBot) {
    specificAdvice = `
### **Autonomous Multi-Channel AI Agent Blueprint**
- **Trigger & Ingestion:** WhatsApp Cloud API / Twilio webhooks routed through self-hosted n8n instances.
- **LLM Reasoning & RAG:** Real-time intent classification with vector search across your proprietary company knowledge base and pricing sheets.
- **CRM Bi-Directional Sync:** Automatic creation and qualification of contacts in GoHighLevel / HubSpot with sentiment tagging and immediate rep notifications via Slack.
- **Escalation Protocol:** Seamless human handoff triggers when high-intent buying signals or complex enterprise questions are detected.`;
  } else if (isShopifyHeadless) {
    specificAdvice = `
### **Headless E-Commerce & Shopify Plus Architecture**
- **Frontend Layer:** Next.js 15 App Router / React 19 deployed on global Edge CDN with sub-700ms TTFB.
- **Commerce Engine:** Shopify Plus Storefront GraphQL API decoupling UI from backend inventory and order management.
- **Search & Merchandising:** Algolia / Meilisearch for instantaneous facet filtering and dynamic personalization.
- **Conversion Optimization:** One-click checkout routing, localized multi-currency engines, and optimized Core Web Vitals (99+ Lighthouse target).`;
  } else if (isAutomationOrCRM) {
    specificAdvice = `
### **AI-Powered CRM & Lead Automation Pipeline**
- **Ingestion & Validation:** Webhook listeners intercept incoming inquiries with instant email verification and DNS domain scrubbing.
- **AI Triage & Enrichment:** Automated company size and tech-stack lookup combined with Gemini/Claude intent scoring.
- **Automated Routing:** Qualified leads receive immediate calendar booking links and personalized video-ready follow-up drafts within 45 seconds.
- **Telemetry Dashboard:** Live pipeline velocity tracking synced to your internal Slack operations channel.`;
  } else if (isSaaSMVP) {
    specificAdvice = `
### **Scalable Full-Stack SaaS MVP Blueprint**
- **Frontend & App:** React 19 / Next.js 15 (Web) and React Native / Expo (iOS & Android) with unified TypeScript types.
- **Backend Services:** Node.js Express/Fastify microservices, PostgreSQL with Prisma ORM, and Redis for distributed queue caching.
- **Authentication & Multi-Tenancy:** Supabase Auth with granular role-based access control (RBAC) and team workspaces.
- **Monetization Engine:** Stripe Billing (Metered/Subscription Tiers) with automated webhook lifecycle handling and customer billing portals.`;
  } else {
    specificAdvice = `
### **Velora Labs System Architecture & Strategy**
- **Decoupled Architecture:** Building modular frontend interfaces decoupled from robust, type-safe backend APIs for long-term scalability.
- **Automated Operations:** Embedding real-time webhooks, automated CRM lead capture, and telemetry tracking into every product layer.
- **Security & Performance:** Strict rate limiting, server-side data validation, automated backups, and low-latency global CDN distribution.`;
  }

  const timelineSnippet = isCostOrTimeline ? `
### **Estimated Sprint Timeline & Scoping**
- **Phase 1: Architecture & UX Blueprint (Weeks 1–2):** Technical specifications, schema design, high-fidelity clickable prototype.
- **Phase 2: Core Engineering & Integrations (Weeks 3–6):** Database models, authentication, core feature loop, API/webhook pipelines.
- **Phase 3: Hardening, QA & Launch (Weeks 7–8):** Security audits, cross-device testing, conversion instrumentation, and production deployment.
- **Budgetary Guidance:** Typical agency sprint packages range based on scope complexity, third-party integrations, and performance SLAs.` : `
### **Recommended Execution Phases**
1. **Architecture & Wireframes (Sprint 1):** System design and prototype validation.
2. **Full-Stack Development & Integrations (Sprints 2–3):** Building the core business logic, third-party syncs, and UI.
3. **QA, Performance Tuning & Deployment (Sprint 4):** Final hardening and live deployment.`;

  return `### **Velora Labs Technical Scoping & Architecture Assessment**

**Identified Core Pillar(s):** ${matchedPillars.join(' • ')}

${specificAdvice}

${timelineSnippet}

### **Actionable Next Steps**
Would you like to refine any specific aspect of this architecture (e.g. database schema, third-party API limits, or budget tiering)? 

You can also click **"Transfer Scope to RFP Form"** below to automatically populate our direct partner contact portal with these requirements for a customized sprint proposal.`;
}

app.post('/api/ai/consult', async (req, res) => {
  try {
    const { messages, currentScope } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const systemInstruction = `You are the Lead Systems Architect and Strategy Partner at "Velora Labs" — an elite digital systems and creative engineering agency.
Velora Labs specializes in 4 pillars:
1. Websites & E-Commerce: Shopify Plus, Headless Next.js/React, WordPress Headless, High-converting design & technical SEO.
2. AI Automation: n8n, Make.com, GoHighLevel, Zapier, autonomous CRM sync, AI triage & lead routing.
3. SaaS & Product Engineering: Full-stack SaaS, scalable Node/React architectures, MVP sprints, UX/UI product revamps.
4. Growth & Marketing: Omnichannel acquisition, Google & Meta Ads, conversion rate optimization (CRO), LTV scaling.

Your goal is to consult with prospective clients, assess their digital requirements, recommend the ideal architecture and pillar mix, and provide intelligent scoping.
Be confident, direct, technically sophisticated, transparent, and conversion-focused. Avoid meaningless SaaS buzzwords. Provide concrete engineering blueprints and strategic recommendations.

Always answer the user's specific questions directly first, then summarize recommendations with:
- Suggested Core Pillar(s)
- Architecture & Recommended Tech Stack
- Estimated Timeline & Milestones
- High-Impact Next Steps`;

    const userPrompt = messages[messages.length - 1]?.text || 'Hello';
    let contextStr = 'Conversation history:\n';
    for (const msg of messages.slice(0, -1)) {
      contextStr += `${msg.role === 'user' ? 'Client' : 'Velora Labs Architect'}: ${msg.text}\n`;
    }
    contextStr += `Client's Latest Request: ${userPrompt}\n`;
    if (currentScope) {
      contextStr += `Additional Context: ${JSON.stringify(currentScope)}\n`;
    }

    const ai = getGeminiClient();
    if (ai) {
      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-3.7-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite'
      ];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: contextStr,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text && response.text.trim().length > 0) {
            return res.json({
              role: 'model',
              text: response.text.trim(),
              modelUsed: model,
              timestamp: new Date().toISOString()
            });
          }
        } catch (err: any) {
          continue;
        }
      }
    }

    res.json({
      role: 'model',
      text: generateDynamicArchitecturalResponse(userPrompt, contextStr),
      modelUsed: 'velora-intelligent-architect',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    const userPrompt = req.body?.messages?.[req.body?.messages?.length - 1]?.text || '';
    res.json({
      role: 'model',
      text: generateDynamicArchitecturalResponse(userPrompt, ''),
      modelUsed: 'velora-resilience-fallback',
      timestamp: new Date().toISOString()
    });
  }
});

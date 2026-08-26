import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioProject, ClientPartner, TeamMember, Inquiry, ServicePillar } from '../src/types';
import { INITIAL_PROJECTS, INITIAL_CLIENTS, INITIAL_TEAM } from '../src/data/agencyData';

let cachedSupabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cachedSupabase) return cachedSupabase;

  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://fmimsraxvaaoiubgojqk.supabase.co';

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    '';

  if (!url || !key) {
    return null;
  }

  try {
    cachedSupabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return cachedSupabase;
  } catch (err) {
    console.error('[Supabase Init Error]', err);
    return null;
  }
}

// =========================================================
// MAPPERS: SUPABASE (snake_case) <-> TYPESCRIPT (camelCase)
// =========================================================

export function mapProjectFromDb(row: any): PortfolioProject {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title || 'Untitled Project',
    tagline: row.tagline || '',
    clientName: row.client_name || 'Confidential Partner',
    clientLogo: row.client_logo || '',
    category: (row.category as ServicePillar) || 'website',
    subCategory: row.sub_category || '',
    services: Array.isArray(row.services) ? row.services : [],
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    coverImage: row.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : [row.cover_image || ''],
    summary: row.summary || '',
    challenge: row.challenge || '',
    solution: row.solution || '',
    results: Array.isArray(row.results) ? row.results : [],
    externalUrl: row.external_url || '',
    isFeatured: Boolean(row.is_featured),
    isPublished: row.is_published !== false,
    displayOrder: typeof row.display_order === 'number' ? row.display_order : 1,
    seoTitle: row.seo_title || row.meta_title || `${row.title || 'Project'} | Velora Labs`,
    seoDescription: row.seo_description || row.meta_description || row.summary || '',
    metaTitle: row.meta_title || row.seo_title || `${row.title || 'Project'} | Velora Labs`,
    metaDescription: row.meta_description || row.seo_description || row.summary || '',
    testimonial: row.testimonial && typeof row.testimonial === 'object' && row.testimonial.quote ? row.testimonial : undefined,
    publishedAt: row.published_at || row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapProjectToDb(p: Partial<PortfolioProject>): any {
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.title !== undefined) row.title = p.title;
  if (p.tagline !== undefined) row.tagline = p.tagline;
  if (p.clientName !== undefined) row.client_name = p.clientName;
  if (p.clientLogo !== undefined) row.client_logo = p.clientLogo;
  if (p.category !== undefined) row.category = p.category;
  if (p.subCategory !== undefined) row.sub_category = p.subCategory;
  if (p.services !== undefined) row.services = p.services;
  if (p.technologies !== undefined) row.technologies = p.technologies;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.gallery !== undefined) row.gallery = p.gallery;
  if (p.summary !== undefined) row.summary = p.summary;
  if (p.challenge !== undefined) row.challenge = p.challenge;
  if (p.solution !== undefined) row.solution = p.solution;
  if (p.results !== undefined) row.results = p.results;
  if (p.externalUrl !== undefined) row.external_url = p.externalUrl;
  if (p.isFeatured !== undefined) row.is_featured = Boolean(p.isFeatured);
  if (p.isPublished !== undefined) row.is_published = p.isPublished !== false;
  if (p.displayOrder !== undefined) row.display_order = Number(p.displayOrder) || 1;
  if (p.seoTitle !== undefined || p.metaTitle !== undefined) row.seo_title = p.seoTitle || p.metaTitle;
  if (p.seoDescription !== undefined || p.metaDescription !== undefined) row.seo_description = p.seoDescription || p.metaDescription;
  if (p.metaTitle !== undefined || p.seoTitle !== undefined) row.meta_title = p.metaTitle || p.seoTitle;
  if (p.metaDescription !== undefined || p.seoDescription !== undefined) row.meta_description = p.metaDescription || p.seoDescription;
  if (p.testimonial !== undefined) row.testimonial = p.testimonial || null;
  if (p.publishedAt !== undefined) row.published_at = p.publishedAt;
  row.updated_at = new Date().toISOString();
  return row;
}

export function mapClientFromDb(row: any): ClientPartner {
  return {
    id: row.id,
    name: row.name || 'Partner',
    logo: row.logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    website: row.website || '',
    description: row.description || '',
    category: row.category || 'client',
    relationshipType: row.relationship_type || 'Digital Partner',
    isFeatured: Boolean(row.is_featured),
    isPublished: row.is_published !== false,
    displayOrder: typeof row.display_order === 'number' ? row.display_order : 1,
    seoTitle: row.seo_title || row.meta_title || `${row.name || 'Partner'} | Velora Labs`,
    seoDescription: row.seo_description || row.meta_description || row.description || '',
    metaTitle: row.meta_title || row.seo_title || `${row.name || 'Partner'} | Velora Labs`,
    metaDescription: row.meta_description || row.seo_description || row.description || '',
    testimonial: row.testimonial && typeof row.testimonial === 'object' && row.testimonial.quote ? row.testimonial : undefined,
    linkedProjectSlugs: Array.isArray(row.linked_project_slugs) ? row.linked_project_slugs : []
  };
}

export function mapClientToDb(c: Partial<ClientPartner>): any {
  const row: any = {};
  if (c.id !== undefined) row.id = c.id;
  if (c.name !== undefined) row.name = c.name;
  if (c.logo !== undefined) row.logo = c.logo;
  if (c.website !== undefined) row.website = c.website;
  if (c.description !== undefined) row.description = c.description;
  if (c.category !== undefined) row.category = c.category;
  if (c.relationshipType !== undefined) row.relationship_type = c.relationshipType;
  if (c.isFeatured !== undefined) row.is_featured = Boolean(c.isFeatured);
  if (c.isPublished !== undefined) row.is_published = c.isPublished !== false;
  if (c.displayOrder !== undefined) row.display_order = Number(c.displayOrder) || 1;
  if (c.seoTitle !== undefined || c.metaTitle !== undefined) row.seo_title = c.seoTitle || c.metaTitle;
  if (c.seoDescription !== undefined || c.metaDescription !== undefined) row.seo_description = c.seoDescription || c.metaDescription;
  if (c.metaTitle !== undefined || c.seoTitle !== undefined) row.meta_title = c.metaTitle || c.seoTitle;
  if (c.metaDescription !== undefined || c.seoDescription !== undefined) row.meta_description = c.metaDescription || c.seoDescription;
  if (c.testimonial !== undefined) row.testimonial = c.testimonial || null;
  if (c.linkedProjectSlugs !== undefined) row.linked_project_slugs = c.linkedProjectSlugs;
  row.updated_at = new Date().toISOString();
  return row;
}

export function mapTeamFromDb(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name || 'Team Member',
    role: row.role || 'Specialist',
    specialty: row.specialty || 'Digital Systems',
    bio: row.bio || '',
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    experience: row.experience || 'Industry Veteran',
    displayOrder: typeof row.display_order === 'number' ? row.display_order : 1,
    isPublished: row.is_published !== false,
    socialLinkedin: row.social_linkedin || '',
    socialTwitter: row.social_twitter || '',
    socialGithub: row.social_github || ''
  };
}

export function mapTeamToDb(t: Partial<TeamMember>): any {
  const row: any = {};
  if (t.id !== undefined) row.id = t.id;
  if (t.name !== undefined) row.name = t.name;
  if (t.role !== undefined) row.role = t.role;
  if (t.specialty !== undefined) row.specialty = t.specialty;
  if (t.bio !== undefined) row.bio = t.bio;
  if (t.avatar !== undefined) row.avatar = t.avatar;
  if (t.experience !== undefined) row.experience = t.experience;
  if (t.displayOrder !== undefined) row.display_order = Number(t.displayOrder) || 1;
  if (t.isPublished !== undefined) row.is_published = t.isPublished !== false;
  if (t.socialLinkedin !== undefined) row.social_linkedin = t.socialLinkedin;
  if (t.socialTwitter !== undefined) row.social_twitter = t.socialTwitter;
  if (t.socialGithub !== undefined) row.social_github = t.socialGithub;
  row.updated_at = new Date().toISOString();
  return row;
}

export function mapInquiryFromDb(row: any): Inquiry {
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    company: row.company || 'Undisclosed',
    service: row.service || 'full_systems',
    budget: row.budget || 'Flexible',
    timeline: row.timeline || 'Flexible',
    message: row.message || '',
    status: row.status || 'new',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapInquiryToDb(i: Partial<Inquiry>): any {
  const row: any = {};
  if (i.id !== undefined) row.id = i.id;
  if (i.name !== undefined) row.name = i.name;
  if (i.email !== undefined) row.email = i.email;
  if (i.company !== undefined) row.company = i.company;
  if (i.service !== undefined) row.service = i.service;
  if (i.budget !== undefined) row.budget = i.budget;
  if (i.timeline !== undefined) row.timeline = i.timeline;
  if (i.message !== undefined) row.message = i.message;
  if (i.status !== undefined) row.status = i.status;
  if (i.createdAt !== undefined) row.created_at = i.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
}

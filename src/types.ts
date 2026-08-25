export type ServicePillar = 'website' | 'automation' | 'saas' | 'marketing';

export interface ProjectResult {
  metric: string;
  label: string;
  description?: string;
}

export interface ProjectTestimonial {
  author: string;
  role: string;
  avatar?: string;
  quote: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  clientName: string;
  clientLogo?: string;
  category: ServicePillar;
  subCategory?: string;
  services: string[];
  technologies: string[];
  coverImage: string;
  gallery: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: ProjectResult[];
  externalUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string;
  updatedAt: string;
  testimonial?: ProjectTestimonial;
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description: string;
  category: 'client' | 'agency_partner' | 'technology_partner' | 'enterprise';
  relationshipType: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    rating?: number;
  };
  linkedProjectSlugs?: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service: ServicePillar | 'full_systems';
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  createdAt: string;
}

export interface ServiceDetail {
  id: ServicePillar;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  iconName: string;
  deliverables: string[];
  technologies: string[];
  idealFor: string[];
  features: {
    title: string;
    description: string;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
}

export interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  avatar: string;
  experience: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  scopingData?: {
    suggestedServices: string[];
    techStack: string[];
    estimatedTimeline: string;
    recommendedApproach: string;
  };
}

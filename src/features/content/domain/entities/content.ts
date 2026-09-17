export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  tools: string[];
  sort_order: number;
}

export interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface MissionVision {
  id: string;
  tab_key: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  points: string[];
  sort_order: number;
}

export interface AboutPillar {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface CompanyStory {
  id: string;
  year: string;
  paragraph_1: string;
  paragraph_2: string;
  sort_order: number;
}

export interface ExpertiseDomain {
  id: string;
  icon: string;
  label: string;
  description: string;
  technologies: string[];
  sort_order: number;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
}

export interface Client {
  id: string;
  name: string;
  sort_order: number;
}

export interface WhyUsReason {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta_label: string;
  cta_to: string;
  accent: string;
  mockup: string;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  project_type: string;
  message: string;
  status: string;
  created_at: string;
}

export interface QuotationRequest {
  id: string;
  project_type: string;
  description: string;
  features: string;
  budget: string;
  timeline: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

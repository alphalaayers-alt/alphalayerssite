export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
  image: string;
}

export interface ProductItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  metrics: string;
  features: string[];
  image: string;
  demoUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: 'Cloud' | 'FinTech' | 'Enterprise IT' | 'AI & Analytics';
  impact: string;
  description: string;
  image: string;
  year: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string;
}

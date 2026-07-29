import { ProductItem, ProjectItem, TestimonialItem, BlogPost, TeamMember, ServiceItem } from '../types';

export const productsData: ProductItem[] = [
  {
    id: 'prod-optipulse',
    title: 'OptiPulse FinTech AI Suite',
    badge: 'Flagship SaaS',
    tagline: 'Real-time financial analytics & automated compliance engine',
    description: 'An end-to-end enterprise platform combining predictive treasury management, automated risk assessment, and real-time ledger auditing built for high-growth firms.',
    metrics: '$1.2B+ Audited Annually',
    features: [
      'Real-time cash flow forecasting',
      'Automated ISO20022 payment routing',
      'Multi-currency ledger reconciliation',
      'AI risk detection & alert triggers'
    ],
    image: '/src/assets/images/product_fintech_dashboard_1785300898682.jpg'
  },
  {
    id: 'prod-cloudnexus',
    title: 'CloudNexus ERP & Operations',
    badge: 'Enterprise Platform',
    tagline: 'Unified resource planning for modern IT & consulting firms',
    description: 'Designed specifically for professional service providers, CloudNexus unifies project profitability tracking, resource allocation, and automated client billing.',
    metrics: '35% Efficiency Gain',
    features: [
      'Smart resource utilization matrix',
      'Milestone-based automated invoicing',
      'Cross-department workflow engine',
      'SOC2 Type II certified security'
    ],
    image: '/src/assets/images/product_cloud_erp_1785300916178.jpg'
  },
  {
    id: 'prod-cyberguard',
    title: 'OptiGuard Zero-Trust Shield',
    badge: 'Cybersecurity',
    tagline: 'Continuous threat intelligence & automated perimeter defense',
    description: 'Protect your enterprise cloud infrastructure with AI-driven anomaly detection, tokenized identity verification, and instant compliance reporting.',
    metrics: '99.99% Uptime Protection',
    features: [
      'Automated vulnerability mitigation',
      'Zero-Trust IAM integration',
      'Real-time SIEM log monitoring',
      'GDPR & HIPAA compliance templates'
    ],
    image: '/src/assets/images/blog_ai_finance_1785300931668.jpg'
  }
];

export const projectsData: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Next-Gen Core Banking Platform Migration',
    client: 'Global Prime Capital',
    category: 'FinTech',
    impact: 'Reduced transaction processing latency by 68%',
    description: 'Architected and deployed a distributed microservices cloud environment for over 4.2 million active banking customers with zero downtime.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    year: '2025'
  },
  {
    id: 'proj-2',
    title: 'AI-Driven Supply Chain Logistics Engine',
    client: 'AeroTrans Logistics',
    category: 'AI & Analytics',
    impact: 'Saved $14M in fuel & idle container costs',
    description: 'Engineered a real-time IoT tracking and predictive route optimization system serving 12,000+ fleet vehicles across Europe & North America.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    year: '2025'
  },
  {
    id: 'proj-3',
    title: 'Multi-Cloud Infrastructure Transformation',
    client: 'OmniHealth Tech',
    category: 'Cloud',
    impact: '100% HIPAA compliance & 40% cost reduction',
    description: 'Migrated legacy healthcare databases to AWS & GCP hybrid clusters with automated backup pipelines and quantum-safe encryption.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    year: '2024'
  },
  {
    id: 'proj-4',
    title: 'Enterprise ERP Implementation',
    client: 'Vanguard Industrial Group',
    category: 'Enterprise IT',
    impact: 'Unified 18 global subsidiaries into 1 platform',
    description: 'Customized and deployed Optibiz CloudNexus ERP to streamline inventory management, procurement, and HR across 45,000 employees.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    year: '2024'
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Marcus Vance',
    role: 'Chief Technology Officer',
    company: 'Apex Global Financial',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Optibiz delivered beyond our expectations. Their in-house SaaS tools merged effortlessly with our core banking infrastructure. Their team operates with unmatched precision and deep domain expertise.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    role: 'VP of Engineering',
    company: 'QuantX Capital',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    content: 'The strategy consulting and IT architecture provided by Optibiz helped us scale our transaction throughput threefold while cutting operational overhead by 32%. Highly recommended.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'David Sterling',
    role: 'Director of Operations',
    company: 'Nova Logistics Enterprise',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'OptiGuard Zero-Trust Shield has secured our remote IT infrastructure. The Optibiz engineering team is responsive, highly knowledgeable, and dedicated to client success.',
    rating: 5
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Future of AI in Financial Services: 2026 Enterprise Trends',
    category: 'Artificial Intelligence',
    readTime: '5 min read',
    date: 'July 18, 2026',
    excerpt: 'Explore how generative intelligence and predictive neural models are redefining risk assessment, portfolio management, and automated trading compliance.',
    content: `Artificial Intelligence is no longer just a buzzword in institutional finance; it has become the fundamental backbone of strategic decision-making...`,
    author: {
      name: 'Dr. Sarah Lin',
      role: 'Chief AI Scientist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    image: '/src/assets/images/blog_ai_finance_1785300931668.jpg'
  },
  {
    id: 'blog-2',
    title: 'Migrating Legacy Core Banking Systems to Hybrid Cloud Architecture',
    category: 'Cloud Engineering',
    readTime: '7 min read',
    date: 'June 29, 2026',
    excerpt: 'Step-by-step framework for financial institutions transitioning from monolithic mainframe legacy servers to resilient, SOC2-compliant microservices.',
    content: `Legacy core banking software often struggles with high latency and inflexible scaling during peak volume spikes...`,
    author: {
      name: 'Alex Rivera',
      role: 'Head of Cloud Solutions',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'blog-3',
    title: 'Zero-Trust Cybersecurity Frameworks for Enterprise Modernization',
    category: 'Cybersecurity',
    readTime: '4 min read',
    date: 'June 14, 2026',
    excerpt: 'How leading enterprises implement tokenized identity verification, perimeter defense, and automated threat detection to safeguard high-value assets.',
    content: `In an era of decentralized workforces and cloud-native applications, perimeter-based security model is obsolete...`,
    author: {
      name: 'Michael Chen',
      role: 'Principal Security Consultant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
  }
];

export const teamMembersData: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Robert Sterling',
    role: 'Founder & Managing Director',
    bio: 'Former senior advisor at McKinsey with 20+ years guiding Fortune 500 digital transformations.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    linkedin: '#'
  },
  {
    id: 'tm-2',
    name: 'Sophia Williams',
    role: 'Chief Technology Officer',
    bio: 'Pioneer in distributed cloud architectures and FinTech system resilience.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    linkedin: '#'
  },
  {
    id: 'tm-3',
    name: 'David Vance',
    role: 'Head of Product Engineering',
    bio: 'Architect behind OptiPulse and CloudNexus SaaS platforms.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    linkedin: '#'
  },
  {
    id: 'tm-4',
    name: 'Amara Okafor',
    role: 'VP of Financial Strategy',
    bio: 'Expert in corporate valuation, tax optimization, and cross-border M&A strategy.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    linkedin: '#'
  }
];

export const servicesData: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Operational Consulting',
    category: 'Enterprise Strategy',
    shortDesc: 'Streamline workflows, reduce operational costs, and boost organizational output.',
    fullDesc: 'We evaluate your end-to-end operational pipelines, remove bottlenecks, and integrate automated software solutions to maximize team efficiency.',
    features: ['Process Re-engineering', 'Supply Chain Optimization', 'Resource Allocation', 'Cost Reduction Frameworks'],
    icon: 'Settings',
    image: '/src/assets/images/service_business_strategies_1785300397999.jpg'
  },
  {
    id: 'srv-2',
    title: 'Strategy Consulting',
    category: 'Corporate Growth',
    shortDesc: 'Data-driven business positioning, competitive strategy, and market expansion.',
    fullDesc: 'Align your business leadership with long-term strategic growth roadmaps, revenue diversification models, and digital transformation initiatives.',
    features: ['Market Penetration Plans', 'Digital Transformation', 'Mergers & Acquisitions Advisory', 'Growth Modeling'],
    icon: 'Compass',
    image: '/src/assets/images/about_us_team_1785300385474.jpg'
  },
  {
    id: 'srv-3',
    title: 'Financial Consulting',
    category: 'Capital & Risk',
    shortDesc: 'Comprehensive corporate finance, treasury management, and risk mitigation.',
    fullDesc: 'Gain complete visibility over capital management, audit readiness, cash flow forecasting, and debt restructuring.',
    features: ['Treasury & Liquidity Control', 'Financial Risk Audits', 'Capital Structure Optimization', 'Valuation Services'],
    icon: 'DollarSign',
    image: '/src/assets/images/service_financial_planning_1785300427909.jpg'
  },
  {
    id: 'srv-4',
    title: 'Enterprise IT & Cloud Solutions',
    category: 'Technology Services',
    shortDesc: 'Custom software development, hybrid cloud migration, and cybersecurity.',
    fullDesc: 'Build resilient IT infrastructure with tailored SaaS tools, secure API integrations, and continuous 24/7 cloud management.',
    features: ['Custom SaaS Development', 'Multi-Cloud Migration', 'Zero-Trust Cybersecurity', '24/7 Managed IT Support'],
    icon: 'Cpu',
    image: '/src/assets/images/product_cloud_erp_1785300916178.jpg'
  },
  {
    id: 'srv-5',
    title: 'Taxes & Accounting Advisory',
    category: 'Compliance',
    shortDesc: 'Precision corporate tax planning, international compliance, and bookkeeping.',
    fullDesc: 'Navigate complex global tax regulations with confidence while optimizing corporate tax structures legally and efficiently.',
    features: ['Corporate Tax Structuring', 'International Tax Compliance', 'Automated Payroll & Ledger', 'Audit Representation'],
    icon: 'Calculator',
    image: '/src/assets/images/service_taxes_accounting_1785300412746.jpg'
  },
  {
    id: 'srv-6',
    title: 'AI & Data Analytics',
    category: 'Innovation',
    shortDesc: 'Predictive intelligence, business dashboards, and machine learning models.',
    fullDesc: 'Turn raw corporate data into actionable business foresight with custom business intelligence dashboards and neural algorithms.',
    features: ['Predictive Analytics', 'Custom BI Dashboards', 'Big Data Engineering', 'Automated ML Pipelines'],
    icon: 'BarChart3',
    image: '/src/assets/images/product_fintech_dashboard_1785300898682.jpg'
  }
];

import {
  productsData,
  projectsData,
  testimonialsData,
  teamMembersData,
  servicesData,
} from '@/data/mockData';
import type { SiteContent } from '@/types/site-content';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  updatedAt: new Date().toISOString(),
  brand: {
    name: 'Alpha Layers',
    tagline: 'IT Services Agency',
    logoNav: '/src/assets/images/ilalogo.png',
    logoFooter: '/src/assets/images/lalogo1.png',
    favicon: '/src/assets/images/few.png',
    seoTitle: 'Alpha Layers - IT Services Agency',
    seoDescription:
      'Alpha Layers provides custom software engineering, cloud infrastructure, and IT agency solutions for global enterprises.',
  },
  nav: {
    ctaLabel: 'Get A Quote',
    contactLabel: 'Contact Us',
    items: [
      { id: 'home', label: 'Home', visible: true },
      { id: 'about', label: 'About Us', visible: true },
      { id: 'services', label: 'Services', visible: true },
      { id: 'products', label: 'In-House Products', visible: false },
      { id: 'projects', label: 'Case Studies', visible: true },
      { id: 'blog', label: 'Blog', visible: true },
      { id: 'faq', label: 'FAQ', visible: true },
    ],
  },
  footer: {
    blurb:
      'Where technical precision meets enterprise growth. Global IT services agency providing in-house software platforms, cloud infrastructure, and strategic digital transformation.',
    address: '124 Tech Park Plaza, Silicon Avenue, NY',
    phone: '+91 9635301453',
    email: 'alphalaayers@gmail.com',
    newsletterHeading: 'Newsletter',
    newsletterBlurb: 'Get the latest IT insights and product updates.',
    copyrightName: 'Alpha Layers IT Services Agency',
  },
  home: {
    hero: {
      welcomeTag: 'Welcome To Alpha Layers',
      headline: 'Where Technical Precision Meets',
      headlineAccent: 'Excellence',
      description:
        'Empowering global enterprises with custom software engineering, cloud infrastructure, and innovative IT agency solutions.',
      primaryCta: "Let's Get Started",
      teamLabel: 'Join Our Team Now:',
      floatingBadge: 'Guiding Financial Journey To Elevating Your Business Destiny',
      experienceNumber: '25+',
      experienceLabel: 'Years Of Experience',
      image: '/src/assets/images/hero_mobile_mockup_1785300358613.jpg',
      teamAvatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      ],
    },
    aboutTeaser: {
      badge: 'About Us',
      headline: 'The Premier IT Services & Technology Agency',
      visionTitle: 'Company Vision',
      visionText:
        'To empower enterprise organizations with high-performing software technology and reliable financial advisory that accelerates operational scaling.',
      missionTitle: 'Company Mission',
      missionText:
        'Delivering customer-first software platforms and financial models that streamline complexity and protect multi-million dollar portfolios.',
      ctaText: 'Join us to achieve sustainable growth and reach your financial goals with the right strategies.',
      ctaLabel: 'Learn More',
      image: '/src/assets/images/about_us_team_1785300385474.jpg',
    },
    servicesTeaser: {
      badge: 'Our Services',
      headline: 'Financial & IT Services To Grow And Secure Your Wealth',
      blurb: 'From strategy consulting to cloud engineering — complete services for modern enterprises.',
      ctaLabel: 'Explore All Services',
      cards: [
        {
          id: 'business-strategies',
          title: 'Business Strategies',
          image: '/src/assets/images/service_business_strategies_1785300397999.jpg',
          icon: 'DollarSign',
          desc: 'Expert business growth models, market expansion plans, and strategic advisory.',
        },
        {
          id: 'taxes-accounting',
          title: 'Taxes & Accounting',
          image: '/src/assets/images/service_taxes_accounting_1785300412746.jpg',
          icon: 'Calculator',
          desc: 'Comprehensive corporate tax management, financial auditing, and compliance.',
        },
        {
          id: 'financial-planning',
          title: 'Financial Planning',
          image: '/src/assets/images/service_financial_planning_1785300427909.jpg',
          icon: 'BarChart3',
          desc: 'Tailored wealth building, asset allocation, and risk management strategies.',
        },
      ],
    },
    productsSection: {
      badge: 'In-House Products',
      headline: 'Enterprise SaaS Platforms Built In-House',
      description: 'Purpose-built software products engineered by Alpha Layers for finance, operations, and security teams.',
      viewAllLabel: 'View All Products',
    },
    projectsSection: {
      badge: 'Case Studies',
      headline: 'Projects That Deliver Measurable Impact',
      description: 'Selected enterprise engagements across FinTech, cloud, and AI.',
      viewAllLabel: 'View All Projects',
    },
    testimonialsSection: {
      badge: 'Testimonials',
      headline: 'What Our Clients Say',
      description: 'Trusted by enterprise leaders worldwide.',
    },
    blogSection: {
      badge: 'Insights',
      headline: 'Latest From Our Blog',
      description: 'Practical guides on AI, cloud, and enterprise IT.',
      viewAllLabel: 'View All Posts',
    },
    stats: [
      { id: 'stat-1', number: '25', symbol: '+', label: 'A legacy of expertise spanning 24+ years.' },
      { id: 'stat-2', number: '150K', symbol: '+', label: 'Where ideas flourish and projects thrive.' },
      { id: 'stat-3', number: '98', symbol: '%', label: 'Striving for customer satisfaction is top priority.' },
      { id: 'stat-4', number: '$40M', symbol: '+', label: 'This is our pure benefit to our clients' },
    ],
  },
  pages: {
    about: {
      badge: 'About Alpha Layers',
      headline: 'Building Digital Excellence For Modern Enterprises',
      description:
        'We are an IT services agency specializing in custom software, cloud infrastructure, and strategic consulting.',
      missionTitle: 'Our Mission',
      missionBody:
        'Deliver precision-engineered IT solutions and strategic consulting that drive measurable growth.',
      visionTitle: 'Our Vision',
      visionBody:
        'To be the trusted technology partner for enterprises seeking scalable digital transformation.',
      teamEyebrow: 'Our Team',
      teamHeadline: 'Leadership Behind The Work',
      teamSubtext: 'Experienced operators, engineers, and strategists.',
      ctaHeadline: 'Ready to work with us?',
      ctaSubtext: 'Tell us about your next initiative and we will craft a clear roadmap.',
      ctaButtonLabel: 'Get A Quote',
    },
    services: {
      badge: 'Services',
      headline: 'End-to-End IT & Consulting Services',
      description: 'Strategy, engineering, cloud, security, and analytics under one roof.',
      inquireLabel: 'Inquire About Service',
    },
    products: {
      badge: 'Products',
      headline: 'In-House Enterprise Products',
      description: 'SaaS platforms designed and maintained by Alpha Layers.',
      demoCtaLabel: 'Request Product Demo',
    },
    projects: {
      badge: 'Projects',
      headline: 'Selected Case Studies',
      description: 'Outcomes from recent enterprise engagements.',
      caseStudyCtaLabel: 'Discuss Similar Project',
    },
    blog: {
      badge: 'Blog',
      headline: 'Insights & Resources',
      description: 'Guides and perspectives from the Alpha Layers team.',
      searchPlaceholder: 'Search articles...',
    },
    contact: {
      badge: 'Contact',
      headline: "Let's Build Something Great",
      description: 'Reach out for project inquiries, partnerships, or support.',
      hqTitle: 'Headquarters',
      hqBlurb: 'We work with clients globally from our core operations hub.',
      address: '124 Tech Park Plaza, Silicon Avenue, NY',
      phone: '+91 9635301453',
      email: 'alphalaayers@gmail.com',
      hours: 'Mon–Fri, 9:00 AM – 6:00 PM IST',
      submitLabel: 'Send Message',
      successTitle: 'Message Sent',
      successBody: 'Thanks for reaching out. We will get back to you shortly.',
    },
    faq: {
      badge: 'FAQ',
      title: 'Frequently Asked Questions',
      subtitle:
        'Everything you need to know about Alpha Layers IT services, engineering process, and consulting solutions.',
      ctaEyebrow: 'Still have questions?',
      ctaHeadline: 'Talk to our team',
      ctaSubtext: 'We are happy to walk through your requirements in detail.',
      ctaButtonLabel: 'Contact Us',
    },
  },
  collections: {
    services: servicesData,
    products: productsData,
    projects: projectsData,
    testimonials: testimonialsData,
    team: teamMembersData,
    faqs: [
      {
        id: 'faq-1',
        category: 'IT Services',
        question: 'What core IT services does Alpha Layers provide?',
        answer:
          'Alpha Layers specializes in end-to-end IT services including enterprise software development, cloud infrastructure management, cyber security auditing, custom web/mobile app engineering, and operational IT consulting.',
      },
      {
        id: 'faq-2',
        category: 'Custom Software',
        question: 'How do you handle custom software development projects?',
        answer:
          'We follow an agile, full-lifecycle engineering process: discovery & architecture design, rapid MVP prototyping, full-stack development with rigorous CI/CD automation, and post-launch maintenance & scaling support.',
      },
      {
        id: 'faq-3',
        category: 'Cloud & Security',
        question: 'Can Alpha Layers help migrate our infrastructure to the Cloud?',
        answer:
          'Yes! We provide seamless migration to AWS, Google Cloud, and Azure. We optimize cloud workloads for performance, cost-efficiency, and implement zero-trust security protocols to keep your enterprise data protected.',
      },
      {
        id: 'faq-4',
        category: 'IT Services',
        question: 'What is your typical project delivery timeline?',
        answer:
          'Timelines vary based on scope: specialized technical audits or advisory projects typically take 1–2 weeks, while full-scale custom enterprise platforms take 6–12 weeks from initial architectural blueprint to production deployment.',
      },
      {
        id: 'faq-5',
        category: 'Pricing & Consulting',
        question: 'How do you structure project pricing and retainer contracts?',
        answer:
          'We offer flexible pricing models: fixed-scope milestone contracts for custom development projects, hourly dedicated engineering teams, and monthly managed IT & security retainers tailored to your business budget.',
      },
      {
        id: 'faq-6',
        category: 'Cloud & Security',
        question: 'Do you offer ongoing technical maintenance and SLA support?',
        answer:
          'Absolutely. We provide 24/7 proactive system monitoring, automated security patch updates, daily cloud backups, and guaranteed response SLAs to ensure maximum uptime for your mission-critical applications.',
      },
      {
        id: 'faq-7',
        category: 'Custom Software',
        question: 'Can you integrate modern AI models and automated workflows into our existing apps?',
        answer:
          'Yes. We specialize in embedding Generative AI capabilities, smart document processing, predictive analytics dashboards, and automated workflow pipelines directly into legacy or modern enterprise software stack.',
      },
    ],
  },
  modals: {
    quote: {
      badge: 'Request A Quote',
      title: 'Tell Us About Your Project',
      subtitle: 'Share a few details and our team will follow up with a tailored proposal.',
      serviceOptions: [
        'IT Services & Advisory',
        'Enterprise IT Advisory',
        'Custom Software Development',
        'Cloud Migration',
        'Cybersecurity',
        'General Inquiry',
      ],
      submitLabel: 'Submit Quote Request',
      successTitle: 'Request Received',
      successBody: 'Thanks! We will contact you shortly with next steps.',
    },
    video: {
      title: 'How We Work',
      headline: 'See Alpha Layers in action',
      description: 'A quick look at our delivery process and client outcomes.',
      thumbImage: '/src/assets/images/how_it_works_thumb_1785300372810.jpg',
      videoUrl: '',
    },
  },
};

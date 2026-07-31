import React from "react";
import { Hero } from "../components/Hero";
import { AboutUs } from "../components/AboutUs";
import { StatsCounter } from "../components/StatsCounter";
import { Services } from "../components/Services";
import { InHouseProducts } from "../components/InHouseProducts";
import { ProjectsShowcase } from "../components/ProjectsShowcase";
import { ClientFeedback } from "../components/ClientFeedback";
import { BlogSection } from "../components/BlogSection";
import { FAQSection } from "../components/FAQSection";

interface HomePageProps {
  onOpenQuote: (serviceTitle?: string) => void;
  onOpenVideo: () => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenQuote,
  onOpenVideo,
  onNavigate,
}) => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero
        onOpenQuote={() => onOpenQuote("Let's Get Started")}
        onOpenVideo={onOpenVideo}
      />

      {/* About Summary */}
      <AboutUs onLearnMore={() => onNavigate("about")} />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Services Grid */}
      <Services
        onSelectService={(title) => onOpenQuote(title)}
        onLearnMore={() => onNavigate("services")}
      />

      {/* In-House Products Section */}
      <InHouseProducts
        onOpenQuote={(productTitle) => onOpenQuote(productTitle)}
        onViewAllProducts={() => onNavigate("products")}
      />

      {/* Featured Projects & Case Studies */}
      <ProjectsShowcase
        onOpenQuote={(projectTitle) => onOpenQuote(projectTitle)}
        onViewAllProjects={() => onNavigate("projects")}
      />

      {/* Testimonials */}
      <ClientFeedback />

      {/* FAQ Section */}
      <FAQSection onOpenQuote={() => onOpenQuote("IT Consulting Inquiry")} />

      {/* Recent Blog Posts */}
      <BlogSection onViewAllBlogs={() => onNavigate("blog")} />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { VideoModal } from './components/VideoModal';
import { FAQSection } from './components/FAQSection';
import { SiteContentProvider } from './components/SiteContentProvider';
import { trackSitePage } from './components/GoogleAnalytics';

// Pages
import { HomePage } from './views/HomePage';
import { AboutPage } from './views/AboutPage';
import { ServicesPage } from './views/ServicesPage';
import { ProductsPage } from './views/ProductsPage';
import { ProjectsPage } from './views/ProjectsPage';
import { BlogPage } from './views/BlogPage';
import { ContactPage } from './views/ContactPage';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('IT Services & Advisory');

  useEffect(() => {
    trackSitePage(activePage);
  }, [activePage]);

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuote = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedService(serviceTitle);
    }
    setIsQuoteModalOpen(true);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            onOpenQuote={handleOpenQuote}
            onOpenVideo={() => setIsVideoModalOpen(true)}
            onNavigate={navigateTo}
          />
        );
      case 'about':
        return <AboutPage onOpenQuote={() => handleOpenQuote('Enterprise IT Advisory')} />;
      case 'services':
        return <ServicesPage onOpenQuote={handleOpenQuote} />;
      case 'products':
        return <ProductsPage onOpenQuote={handleOpenQuote} />;
      case 'projects':
        return <ProjectsPage onOpenQuote={handleOpenQuote} />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQSection onOpenQuote={() => handleOpenQuote('General Inquiry')} />;
      default:
        return (
          <HomePage
            onOpenQuote={handleOpenQuote}
            onOpenVideo={() => setIsVideoModalOpen(true)}
            onNavigate={navigateTo}
          />
        );
    }
  };

  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-[#0d151c] text-slate-100 antialiased selection:bg-[#2563eb] selection:text-white flex flex-col justify-between">
        <Navbar
          onOpenQuote={() => handleOpenQuote()}
          activePage={activePage}
          setActivePage={navigateTo}
        />

        <main className="flex-grow">
          {renderActivePage()}
        </main>

        <Footer
          onOpenQuote={() => handleOpenQuote()}
          setActivePage={navigateTo}
        />

        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          defaultService={selectedService}
        />

        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      </div>
    </SiteContentProvider>
  );
}

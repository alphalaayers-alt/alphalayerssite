'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-M4RGV60LEP';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Loads GA only on public website routes — never on /admin */
export function GoogleAnalytics() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true,
            page_path: window.location.pathname
          });
        `}
      </Script>
    </>
  );
}

const PAGE_PATHS: Record<string, { path: string; title: string }> = {
  home: { path: '/', title: 'Home' },
  about: { path: '/about', title: 'About Us' },
  services: { path: '/services', title: 'Services' },
  projects: { path: '/case-studies', title: 'Case Studies' },
  blog: { path: '/blog', title: 'Blog' },
  faq: { path: '/faq', title: 'FAQ' },
  contact: { path: '/contact', title: 'Contact Us' },
  products: { path: '/products', title: 'In-House Products' },
};

/** Track public site section changes (Home, About, Services, etc.) */
export function trackSitePage(pageId: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (window.location.pathname.startsWith('/admin')) return;

  const page = PAGE_PATHS[pageId] || { path: `/${pageId}`, title: pageId };
  window.gtag('event', 'page_view', {
    page_path: page.path,
    page_title: `${page.title} | Alpha Layers`,
    page_location: `${window.location.origin}${page.path}`,
  });
}

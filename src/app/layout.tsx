import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { ServiceWorkerCleanup } from '../components/ServiceWorkerCleanup';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Alpha Layers - IT Services Agency',
  description: 'Where technical precision meets excellence. Custom software engineering, cloud infrastructure, and innovative IT agency solutions.',
  icons: {
    icon: '/src/assets/images/few.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-[#0d151c] text-slate-100 font-sans antialiased selection:bg-[#2563eb] selection:text-white min-h-screen flex flex-col`}>
        <GoogleAnalytics />
        <ServiceWorkerCleanup />
        {children}
      </body>
    </html>
  );
}

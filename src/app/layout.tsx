import type { Metadata } from 'next';
import Script from 'next/script';
import { Michroma } from 'next/font/google';
import './globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-M4RGV60LEP';

const michroma = Michroma({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-michroma',
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
      <body className={`${michroma.variable} bg-[#0d151c] text-slate-100 font-sans antialiased selection:bg-[#2563eb] selection:text-white min-h-screen flex flex-col`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

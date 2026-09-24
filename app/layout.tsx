import type { Metadata } from 'next';
import { CustomCursor } from './components/CustomCursor';
import { ScrollBar } from './components/ScrollBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hayden Cai — Full Stack & AI Engineer',
  description: 'Full Stack & AI Engineer building performant web applications and intelligent systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollBar />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

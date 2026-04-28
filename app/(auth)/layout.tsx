// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import type { Metadata } from 'next';
import {
  Geist_Mono,
  Noto_Sans,
  Noto_Sans_Sinhala,
  Noto_Sans_Tamil,
} from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { Toaster } from 'sonner';

const notoSansLatin = Noto_Sans({
  variable: '--font-noto-sans-core',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: '--font-noto-sans-tamil',
  subsets: ['tamil'],
  display: 'swap',
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: '--font-noto-sans-sinhala',
  subsets: ['sinhala'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Modern admin dashboard built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${notoSansLatin.variable} ${notoSansTamil.variable} ${notoSansSinhala.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
         {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
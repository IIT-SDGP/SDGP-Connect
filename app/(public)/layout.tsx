// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import Script from "next/script";
import ClientLayout from "@/components/Clientlayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sdgp.lk"),

  title: "SDGP",
  description: "Where Your Future is Shaped",
  icons: {
    icon: "/iconw.svg",
  },
  openGraph: {
    title: "SDGP",
    description: "Where Your Future is Shaped",
    url: "https://sdgp.lk",
    siteName: "SDGP",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "SDGP Cover Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDGP",
    description: "Where Your Future is Shaped",
    images: ["/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/iconw.svg" type="image/png" sizes="128x128" />
        <link
          rel="preload"
          href="/iconw.svg"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
        <Script
          src="https://api.psycodelabs.lk/widget.js"
          data-key="pk_b3a99bccdb1c43c3d49599b7f2ad4fa3857306cd7cce0b2f"
          data-api="https://api.psycodelabs.lk"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

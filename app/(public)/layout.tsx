// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import {
  Geist_Mono,
  Noto_Sans,
  Noto_Sans_Sinhala,
  Noto_Sans_Tamil,
} from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "@/components/Clientlayout";

/** Latin + Tamil + Sinhala: one Noto Sans design via stacked regional families */
const notoSansLatin = Noto_Sans({
  variable: "--font-noto-sans-core",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-noto-sans-tamil",
  subsets: ["tamil"],
  display: "swap",
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-noto-sans-sinhala",
  subsets: ["sinhala"],
  display: "swap",
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
    <html lang="en" suppressHydrationWarning className="public-site">
      <head>
        <link rel="icon" href="/iconw.svg" type="image/png" sizes="128x128" />
        <link
          rel="preload"
          href="/iconw.svg"
          as="image"
          type="image/svg+xml"
        />
        <script
          defer
          src="https://api.psycodelabs.lk/widget.js"
          data-key="pk_b3a99bccdb1c43c3d49599b7f2ad4fa3857306cd7cce0b2f"
          data-api="https://api.psycodelabs.lk"
        ></script>

      </head>
      <body
        className={`public-site ${notoSansLatin.variable} ${notoSansTamil.variable} ${notoSansSinhala.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

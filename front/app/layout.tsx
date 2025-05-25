import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Développeur Web Fullstack",
    template: "%s | Portfolio",
  },
  description: "Portfolio moderne, responsive et mobile first. Découvrez mes projets, mon parcours, et contactez-moi facilement.",
  keywords: [
    "portfolio",
    "développeur web",
    "fullstack",
    "projets",
    "react",
    "symfony",
    "nextjs",
    "javascript",
    "typescript",
    "mobile first",
    "SEO"
  ],
  openGraph: {
    title: "Portfolio | Développeur Web Fullstack",
    description: "Portfolio moderne, responsive et mobile first. Découvrez mes projets, mon parcours, et contactez-moi facilement.",
    url: "https://localhost:3000/",
    siteName: "Portfolio Fullstack",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/file.svg",
        width: 1200,
        height: 630,
        alt: "Portfolio Fullstack"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Développeur Web Fullstack",
    description: "Portfolio moderne, responsive et mobile first. Découvrez mes projets, mon parcours, et contactez-moi facilement.",
    images: ["/file.svg"]
  },
  icons: {
    icon: "/favicon.ico"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/"
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
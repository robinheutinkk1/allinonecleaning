import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.companyName} Enschede | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.companyName,
  keywords: [
    "gevelreiniging Enschede",
    "gevel reinigen Enschede",
    "dakpanreiniging Enschede",
    "trespa reinigen",
    "zonnepanelen reinigen Enschede",
    "bestrating reinigen Enschede",
    "gevelspecialist Enschede",
    "gevelreiniging Twente",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: siteConfig.companyName,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/images/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#111c30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

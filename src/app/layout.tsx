import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { DemoBanner } from "@/components/ui/demo-banner";
import { PWARegister } from "@/components/pwa-register";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicGrid — See. Understand. Prioritise. Act.",
  description: "AI-powered public intelligence platform for safer, healthier and more resilient communities. Designed for public-sector deployment.",
  keywords: ["civic intelligence","public infrastructure","disaster management","flood risk","heat risk","public health","smart city","India"],
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  applicationName: "CivicGrid",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "CivicGrid" },
  icons: { icon: "/icon.jpg", apple: "/apple-icon.jpg" },
  openGraph: {
    title: "CivicGrid — See. Understand. Prioritise. Act.",
    description: "AI-powered public intelligence for safer, healthier and more resilient communities.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={geistSans.variable + " " + geistMono.variable + " antialiased bg-gray-50 text-gray-900"}>
        <PWARegister />
        <AuthProvider>
          {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && <DemoBanner />}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

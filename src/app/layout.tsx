import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { DemoBanner } from "@/components/ui/demo-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicGrid — See. Understand. Prioritise. Act.",
  description:
    "AI-powered public intelligence platform for safer, healthier and more resilient communities. Designed for public-sector deployment.",
  keywords: [
    "civic intelligence",
    "public infrastructure",
    "disaster management",
    "flood risk",
    "heat risk",
    "public health",
    "smart city",
    "India",
  ],
  robots: { index: false, follow: false }, // Prototype — do not index
  openGraph: {
    title: "CivicGrid — See. Understand. Prioritise. Act.",
    description:
      "AI-powered public intelligence for safer, healthier and more resilient communities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <AuthProvider>
          {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && <DemoBanner />}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

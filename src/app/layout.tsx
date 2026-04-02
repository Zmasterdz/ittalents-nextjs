import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CvOptimizer ITTalentsdzpro - Optimisez votre carrière IT en Algérie",
  description:
    "Collez le contenu de votre CV et obtenez des recommandations personnalisées pour décrocher le poste de vos rêves en Algérie. Propulsé par l'IA.",
  keywords: [
    "CV",
    "optimiseur",
    "Algérie",
    "IT",
    "talents",
    "carrière",
    "recommandations",
    "emploi",
    "ITTalentsdzpro",
  ],
  authors: [{ name: "ITTalentsdzpro" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CvOptimizer ITTalentsdzpro",
    description:
      "Optimisez votre carrière IT en Algérie avec des recommandations IA personnalisées.",
    siteName: "ITTalentsdzpro",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

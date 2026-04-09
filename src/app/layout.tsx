import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Home, BarChart3, BookOpen, Settings, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"

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
    "Collez le contenu de votre CV et obtenez des recommandations personnalisées pour décrocher votre opportunités. Propulsé par l'IA.",
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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold tracking-tight text-foreground">
                      CvOptimizer
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      ITTalentsdzpro
                    </p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="#home" className="hover:bg-accent/50">
                            <Home className="h-4 w-4" />
                            <span>Optimiser CV</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="#salary" className="hover:bg-accent/50">
                            <BarChart3 className="h-4 w-4" />
                            <span>Salaires IT</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="#examples" className="hover:bg-accent/50">
                            <BookOpen className="h-4 w-4" />
                            <span>Exemples</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="p-4 border-t">
                <div className="flex items-center gap-3">
                  <a
                    href="https://ittalentsdzpro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    ITTalentsdzpro.com
                  </a>
                </div>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

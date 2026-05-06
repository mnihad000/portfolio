import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, VT323 } from "next/font/google";
import NavHeader from "@/components/ui/nav-header";
import ProtocolTerminal from "@/components/ui/protocol-terminal";
import { SiteThemeProvider } from "@/components/providers/site-theme-provider";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mohammed Nihad | Portfolio",
  description: "Retro-inspired portfolio landing page for Mohammed Nihad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${geist.variable} ${vt323.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background text-foreground"
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        <SiteThemeProvider>
          <NavHeader />
          {children}
          <ProtocolTerminal />
        </SiteThemeProvider>
      </body>
    </html>
  );
}

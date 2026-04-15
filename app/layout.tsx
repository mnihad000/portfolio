import type { Metadata } from "next";
import { IBM_Plex_Mono, VT323 } from "next/font/google";
import NavHeader from "@/components/ui/nav-header";
import ProtocolTerminal from "@/components/ui/protocol-terminal";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      suppressHydrationWarning
      className={`${ibmPlexMono.variable} ${vt323.variable} h-full antialiased`}
    >
      <head>
        <script
          id="portfolio-theme-bootstrap"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col"
      >
        <NavHeader />
        {children}
        <ProtocolTerminal />
      </body>
    </html>
  );
}

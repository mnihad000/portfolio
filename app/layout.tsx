import type { Metadata } from "next";
import { IBM_Plex_Mono, VT323 } from "next/font/google";
import NavHeader from "@/components/ui/nav-header";
import ProtocolTerminal from "@/components/ui/protocol-terminal";
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
      className={`${ibmPlexMono.variable} ${vt323.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-black text-white"
      >
        <NavHeader />
        {children}
        <ProtocolTerminal />
      </body>
    </html>
  );
}

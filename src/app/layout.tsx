import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GymBarrio App",
    template: "%s · GymBarrio",
  },
  description:
    "Rutinas guiadas con video y temporizador para gimnasios de barrios privados.",
  applicationName: "GymBarrio",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GymBarrio",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${body.variable} ${display.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

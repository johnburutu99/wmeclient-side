import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WME Client Portal",
  description: "William Morris Endeavor Client Portal - Secure, Modern, Beautiful.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#C9A14D" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#181818] text-white`}
        style={{
          '--color-gold': '#C9A14D',
          '--color-black': '#181818',
          '--color-white': '#fff',
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}

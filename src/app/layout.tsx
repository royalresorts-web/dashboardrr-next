import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/Context';  

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - Royal Resorts",
  description: "Administrador de servicios y aplicaciones para usuarios en Royal Resorts",
  icons: {
    icon: [
        { url: 'https://www.royalresorts.com/img/logo/favicon96x96.png' },
        { url: 'https://www.royalresorts.com/img/logo/favicon32x32.png', sizes: '32x32', type: 'image/png' },
        { url: 'https://www.royalresorts.com/img/logo/favicon16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: 'https://www.royalresorts.com/img/logo/touch-ipad-ret.png', sizes: '180x180' }],
  }    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>        
      </body>
    </html>
  );
}

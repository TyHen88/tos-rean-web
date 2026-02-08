import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  title: "TosRean - Learn Anything, Anywhere",
  description: "Master new skills with our comprehensive online courses. Learn from industry experts and advance your career.",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TosRean",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  keywords: ["e-learning", "online courses", "education", "skills", "career growth"],
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.jpg" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <AuthProvider>
          {children}
          <PWAInstallPrompt />
          <OfflineIndicator />
        </AuthProvider>
      </body>
    </html>
  )
}

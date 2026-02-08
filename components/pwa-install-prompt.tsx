"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PWAInstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(true) // Default to true to prevent flash

  useEffect(() => {
    // Check localStorage on mount
    const dismissed = localStorage.getItem("tosrean_pwa_dismissed")
    setIsDismissed(!!dismissed)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Only show if not previously dismissed
      const dismissed = localStorage.getItem("tosrean_pwa_dismissed")
      if (!dismissed) {
        setShowPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice // eslint-disable-line @typescript-eslint/no-explicit-any

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
      localStorage.setItem("tosrean_pwa_dismissed", "true")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("tosrean_pwa_dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-md">
      <Card className="shadow-lg border-2 animate-in slide-in-from-bottom-5 fade-in duration-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">Install TosRean</h3>
              <p className="text-sm text-muted-foreground">Get quick access from your home screen</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6 -mt-1 -mr-2">
              <span className="sr-only">Dismiss</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleInstall} className="flex-1 h-9">
              Install App
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="h-9">
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

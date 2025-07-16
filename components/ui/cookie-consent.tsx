"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { X, Settings } from "lucide-react"

type ConsentPreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie_consent")
      if (!consent) {
        setShowBanner(true)
      }
    }
  }, [])

  const savePreferences = (newPreferences: ConsentPreferences) => {
    localStorage.setItem("cookie_consent", "true")
    localStorage.setItem("cookie_preferences", JSON.stringify(newPreferences))
    setShowBanner(false)
  }

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = { necessary: true, analytics: true, marketing: true }
    setPreferences(allAccepted)
    savePreferences(allAccepted)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const handleClose = () => {
    // Temporarily hide banner for the session if closed without consent
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 text-white max-w-4xl mx-auto">
        <CardContent className="p-6 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <h2 className="text-lg font-semibold text-blue-400">Our Use of Cookies</h2>
            </div>
            <div className="flex-grow text-sm text-slate-300">
              <p>
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Allow All", you consent to our use of cookies. You can read our{" "}
                <Link href="/privacy-policy" className="underline text-blue-400 hover:text-white">
                  Privacy Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4 mt-4 md:mt-0">
              <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Allow All
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="px-6 bg-transparent border-slate-500 hover:bg-slate-800 hover:text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 text-white border-slate-700">
                  <DialogHeader>
                    <DialogTitle>Customize Cookie Preferences</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="necessary-cookies" className="font-semibold">
                        Necessary Cookies
                        <p className="text-xs text-slate-400 font-normal">These cookies are essential for the website to function and cannot be switched off.</p>
                      </Label>
                      <Switch id="necessary-cookies" checked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics-cookies" className="font-semibold">
                        Analytics Cookies
                        <p className="text-xs text-slate-400 font-normal">These cookies allow us to count visits and traffic sources to measure and improve site performance.</p>
                      </Label>
                      <Switch
                        id="analytics-cookies"
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-cookies" className="font-semibold">
                        Marketing Cookies
                        <p className="text-xs text-slate-400 font-normal">These cookies may be set through our site by our advertising partners to build a profile of your interests.</p>
                      </Label>
                      <Switch
                        id="marketing-cookies"
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
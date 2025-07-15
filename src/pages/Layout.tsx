import type React from "react"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

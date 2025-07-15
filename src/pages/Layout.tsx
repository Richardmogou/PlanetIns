// RootLayout.tsx
import type React from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}

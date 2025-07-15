

import { useAuth } from "@/components/providers/AuthProvider"
import { AdminDashboard } from "./AdminDashboard"
import { StudentDashboard } from "./StudentDashboard"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function DashboardLayout() {
  const { user, isLoading } = useAuth()
  const router = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      router("/auth")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />
}

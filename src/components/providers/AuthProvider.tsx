
import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "student" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler la vérification du token au chargement
    const token = localStorage.getItem("auth-token")
    if (token) {
      // Simuler la récupération des données utilisateur
      setUser({
        id: "1",
        email: "user@example.com",
        name: "Utilisateur Test",
        role: "student",
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simuler l'authentification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@university.com" && password === "admin123") {
      const adminUser = {
        id: "1",
        email: "admin@university.com",
        name: "Administrateur",
        role: "admin" as const,
      }
      setUser(adminUser)
      localStorage.setItem("auth-token", "admin-token")
      setIsLoading(false)
      return true
    } else if (email === "student@example.com" && password === "student123") {
      const studentUser = {
        id: "2",
        email: "student@example.com",
        name: "Étudiant Test",
        role: "student" as const,
      }
      setUser(studentUser)
      localStorage.setItem("auth-token", "student-token")
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
  }

  return(
     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
    {children}
    </AuthContext.Provider>)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

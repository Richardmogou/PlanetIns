

import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Clock } from "lucide-react"

export function StudentDashboard() {
  const { user, logout } = useAuth()

  // Mock application data for the student
  const application = {
    status: "pending", // "pending", "approved", "rejected"
    progress: 60, // Percentage
    documentsSubmitted: 5,
    documentsRequired: 7,
    lastUpdated: "2024-02-29",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            En attente
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
            Approuvé
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
            Rejeté
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800 ring-1 ring-inset ring-gray-600/20">
            Inconnu
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-gray-600">Bienvenue, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Application Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statut de votre candidature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Statut:</span>
                  {getStatusBadge(application.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Progression:</span>
                  <span>{application.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Documents soumis:</span>
                  <span>
                    {application.documentsSubmitted} / {application.documentsRequired}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dernière mise à jour:</span>
                  <span>{application.lastUpdated}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir les documents
                </Button>
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Vérifier l'état
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Suivre l'avancement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

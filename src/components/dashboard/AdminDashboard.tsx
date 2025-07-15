

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Clock,
  CheckCircle,
  Download,
  Search,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Données simulées pour les candidatures
const mockApplications = [
  {
    id: "INS-2024-ABC123",
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@email.com",
    telephone: "+33 1 23 45 67 89",
    status: "pending",
    dateSubmission: "2024-01-15",
    progress: 75,
    documents: 5,
    documentsValidated: 4,
    niveau: "Licence 3",
    specialisation: "Informatique",
  },
  {
    id: "INS-2024-DEF456",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@email.com",
    telephone: "+33 1 98 76 54 32",
    status: "approved",
    dateSubmission: "2024-01-14",
    progress: 100,
    documents: 6,
    documentsValidated: 6,
    niveau: "Master 2",
    specialisation: "Analyse de données",
  },
  {
    id: "INS-2024-GHI789",
    nom: "Leroy",
    prenom: "Pierre",
    email: "pierre.leroy@email.com",
    telephone: "+33 1 11 22 33 44",
    status: "rejected",
    dateSubmission: "2024-01-13",
    progress: 60,
    documents: 4,
    documentsValidated: 2,
    niveau: "Licence 1",
    specialisation: "Mathématiques",
  },
  {
    id: "INS-2024-JKL012",
    nom: "Zitouni",
    prenom: "Sarah",
    email: "sarah.zitouni@email.com",
    telephone: "+33 1 55 66 77 88",
    status: "approved",
    dateSubmission: "2024-01-12",
    progress: 100,
    documents: 5,
    documentsValidated: 5,
    niveau: "Licence 2",
    specialisation: "Physique",
  },
  {
    id: "INS-2024-MNO345",
    nom: "Hamii",
    prenom: "Sarahh",
    email: "sarahh.hamii@email.com",
    telephone: "+33 1 77 88 99 00",
    status: "approved",
    dateSubmission: "2024-01-11",
    progress: 100,
    documents: 6,
    documentsValidated: 6,
    niveau: "Master 2",
    specialisation: "Intelligence Artificielle",
  },
]

const stats = {
  totalApplications: 1247,
  pendingApplications: 89,
  approvedApplications: 1098,
  rejectedApplications: 60,
  averageProcessingTime: "36h",
  completionRate: 88,
  // Nouvelles statistiques pour les graphiques
  byLevel: {
    "Licence 1": 312,
    "Licence 2": 298,
    "Licence 3": 445,
    "Master 1": 156,
    "Master 2": 36,
  },
  byMonth: [
    { month: "Jan", applications: 120 },
    { month: "Fév", applications: 150 },
    { month: "Mar", applications: 180 },
    { month: "Avr", applications: 200 },
    { month: "Mai", applications: 170 },
    { month: "Juin", applications: 160 },
  ],
  byStatus: {
    pending: 89,
    approved: 1098,
    rejected: 60,
  },
}

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [applications, setApplications] = useState(mockApplications)
  const [newStatus, setNewStatus] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewApplication = (app: any) => {
    setSelectedApplication(app)
    setShowDetailsModal(true)
  }

  const handleEditApplication = (app: any) => {
    setSelectedApplication(app)
    setNewStatus(app.status)
    setShowEditModal(true)
  }

  const handleStatusChange = (appId: string, status: string) => {
    // Mettre à jour l'application dans l'état local
    setApplications((prevApps) => prevApps.map((app) => (app.id === appId ? { ...app, status: status } : app)))

    // Simuler l'appel API
    console.log(`Statut changé pour ${appId}: ${status}`)

    // Fermer la modal
    setShowEditModal(false)
    setSelectedApplication(null)
    setNewStatus("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
              <p className="text-gray-600">Bienvenue, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="applications">Dossiers</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground">Nécessitent une action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approvedApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    Taux d'approbation: {Math.round((stats.approvedApplications / stats.totalApplications) * 100)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rejectedApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    Taux de rejet: {Math.round((stats.rejectedApplications / stats.totalApplications) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Candidatures Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {app.prenom.charAt(0)}
                            {app.nom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {app.prenom} {app.nom}
                          </p>
                          <p className="text-sm text-gray-500">
                            {app.niveau} - {app.specialisation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{app.dateSubmission}</p>
                          <p className="text-sm">Progression: {app.progress}%</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            {/* Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Liste des Candidatures ({filteredApplications.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>ID Dossier</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Spécialisation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {app.prenom} {app.nom}
                            </p>
                            <p className="text-sm text-gray-500">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{app.id}</TableCell>
                        <TableCell>{app.niveau}</TableCell>
                        <TableCell>{app.specialisation}</TableCell>
                        <TableCell>{app.dateSubmission}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${app.progress}%` }}></div>
                            </div>
                            <span className="text-sm">{app.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewApplication(app)}>
                              Voir
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditApplication(app)}>
                              Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par niveau */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Répartition par Niveau</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.byLevel).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{level}</span>
                        <div className="flex items-center space-x-2 flex-1 ml-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${(count / stats.totalApplications) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold min-w-[3rem] text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Évolution Mensuelle</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byMonth.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center space-x-2 flex-1 ml-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-green-600 h-3 rounded-full"
                              style={{ width: `${(month.applications / 200) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold min-w-[3rem] text-right">{month.applications}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statut des candidatures */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut des Candidatures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">En attente</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-yellow-500 h-3 rounded-full"
                            style={{ width: `${(stats.byStatus.pending / stats.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold min-w-[3rem] text-right">{stats.byStatus.pending}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Approuvées</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${(stats.byStatus.approved / stats.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold min-w-[3rem] text-right">{stats.byStatus.approved}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rejetées</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full"
                            style={{ width: `${(stats.byStatus.rejected / stats.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold min-w-[3rem] text-right">{stats.byStatus.rejected}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques de performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Temps de traitement moyen</span>
                      <span className="text-lg font-bold text-blue-600">{stats.averageProcessingTime}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Taux de completion</span>
                      <span className="text-lg font-bold text-green-600">{stats.completionRate}%</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Satisfaction étudiants</span>
                      <span className="text-lg font-bold text-purple-600">4.8/5</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Documents validés</span>
                      <span className="text-lg font-bold text-orange-600">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Notifications Email</h3>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les nouvelles candidatures
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Validation Automatique</h3>
                      <p className="text-sm text-gray-500">Activer la validation automatique des documents</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Sauvegarde Automatique</h3>
                      <p className="text-sm text-gray-500">Sauvegarder automatiquement les données</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Modal de détails */}
      {showDetailsModal && selectedApplication && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Détails de la candidature - {selectedApplication.prenom} {selectedApplication.nom}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Informations Personnelles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Nom</Label>
                      <p className="text-sm">{selectedApplication.nom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                      <p className="text-sm">{selectedApplication.prenom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-sm">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                      <p className="text-sm">{selectedApplication.telephone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations académiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Informations Académiques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Niveau</Label>
                      <p className="text-sm">{selectedApplication.niveau}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Spécialisation</Label>
                      <p className="text-sm">{selectedApplication.specialisation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statut et progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Statut et Progression</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Statut actuel</span>
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{selectedApplication.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedApplication.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documents</span>
                      <span className="text-sm">
                        {selectedApplication.documentsValidated}/{selectedApplication.documents} validés
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedApplication && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Modifier la candidature - {selectedApplication.prenom} {selectedApplication.nom}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Changer le statut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Statut actuel</Label>
                    {getStatusBadge(selectedApplication.status)}
                  </div>

                  <div className="space-y-2">
                    <Label>Nouveau statut</Label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Commentaire (optionnel)</Label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Ajouter un commentaire sur cette modification..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowEditModal(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => handleStatusChange(selectedApplication.id, newStatus)}>Sauvegarder</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  FileText,
  User,
  GraduationCap,
  MapPin,
  Send,
  Download,
} from "lucide-react"

interface ValidationStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function ValidationStep({ data, onUpdate, onNext, onPrevious }: ValidationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionProgress, setSubmissionProgress] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [dossierNumber, setDossierNumber] = useState("")
  const [validationResults, setValidationResults] = useState({
    personalInfo: "success",
    documents: "success",
    academic: "success",
    contact: "success",
  })

  const generateDossierNumber = () => {
    return `INS-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  }

  const downloadReceipt = () => {
    // Créer le contenu HTML du récépissé
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Récépissé d'inscription - ${dossierNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
            color: #6b7280;
          }
          .value {
            color: #111827;
          }
          .status {
            background-color: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          .important {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .important-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🎓 UniPortal</div>
          <div class="title">RÉCÉPISSÉ D'INSCRIPTION</div>
          <div>Année universitaire 2024-2025</div>
        </div>

        <div class="section">
          <div class="section-title">📋 Informations du dossier</div>
          <div class="info-row">
            <span class="label">Numéro de dossier:</span>
            <span class="value">${dossierNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Date de soumission:</span>
            <span class="value">${new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div class="info-row">
            <span class="label">Heure de soumission:</span>
            <span class="value">${new Date().toLocaleTimeString("fr-FR")}</span>
          </div>
          <div class="info-row">
            <span class="label">Statut:</span>
            <span class="status">Soumis avec succès</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">👤 Informations personnelles</div>
          <div class="info-row">
            <span class="label">Nom:</span>
            <span class="value">${data.nom || "Non renseigné"}</span>
          </div>
          <div class="info-row">
            <span class="label">Prénom(s):</span>
            <span class="value">${data.prenoms?.join(", ") || "Non renseigné"}</span>
          </div>
          <div class="info-row">
            <span class="label">Date de naissance:</span>
            <span class="value">${
              data.dateNaissance ? new Date(data.dateNaissance).toLocaleDateString("fr-FR") : "Non renseignée"
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Nationalité:</span>
            <span class="value">${data.nationalite || "Non renseignée"}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📧 Coordonnées</div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${data.email || "Non renseigné"}</span>
          </div>
          <div class="info-row">
            <span class="label">Téléphone:</span>
            <span class="value">${data.telephone || "Non renseigné"}</span>
          </div>
          <div class="info-row">
            <span class="label">Adresse:</span>
            <span class="value">${data.adresse || "Non renseignée"}, ${data.ville || ""} ${data.codePostal || ""}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">🎓 Parcours académique</div>
          <div class="info-row">
            <span class="label">Dernier établissement:</span>
            <span class="value">${data.dernierEtablissement || "Non renseigné"}</span>
          </div>
          <div class="info-row">
            <span class="label">Nombre de formations:</span>
            <span class="value">${data.formations?.length || 0} formation(s)</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📎 Documents soumis</div>
          ${
            data.documents
              ?.map(
                (doc: any) => `
            <div class="info-row">
              <span class="label">${doc.name}:</span>
              <span class="value">✅ Validé</span>
            </div>
          `,
              )
              .join("") || "<div>Aucun document</div>"
          }
        </div>

        <div class="important">
          <div class="important-title">⚠️ Informations importantes</div>
          <ul>
            <li><strong>Délai de traitement:</strong> Votre dossier sera traité dans un délai de 24 à 48 heures ouvrées.</li>
            <li><strong>Notifications:</strong> Vous recevrez un email et un SMS à chaque étape du traitement.</li>
            <li><strong>Suivi:</strong> Vous pouvez suivre l'avancement de votre dossier sur votre espace personnel.</li>
            <li><strong>Contact:</strong> En cas de question, contactez le service des inscriptions.</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">📞 Contact</div>
          <div class="info-row">
            <span class="label">Service des inscriptions:</span>
            <span class="value">inscriptions@university.com</span>
          </div>
          <div class="info-row">
            <span class="label">Téléphone:</span>
            <span class="value">+33 1 23 45 67 89</span>
          </div>
          <div class="info-row">
            <span class="label">Horaires:</span>
            <span class="value">Lundi - Vendredi: 9h00 - 17h00</span>
          </div>
        </div>

        <div class="footer">
          <p>Ce document a été généré automatiquement le ${new Date().toLocaleString("fr-FR")}</p>
          <p>Conservez précieusement ce récépissé jusqu'à la validation définitive de votre inscription.</p>
          <p>© 2024 UniPortal - Plateforme d'inscription universitaire</p>
        </div>
      </body>
      </html>
    `

    // Créer un blob avec le contenu HTML
    const blob = new Blob([receiptContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    // Créer un lien de téléchargement
    const link = document.createElement("a")
    link.href = url
    link.download = `recepisse-inscription-${dossierNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Nettoyer l'URL
    URL.revokeObjectURL(url)

    // Alternative: ouvrir dans un nouvel onglet pour impression
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmissionStatus("submitting")
    setSubmissionProgress(0)

    // Générer le numéro de dossier
    const newDossierNumber = generateDossierNumber()
    setDossierNumber(newDossierNumber)

    // Simulation du processus de soumission
    const steps = [
      "Validation des informations personnelles...",
      "Vérification des documents...",
      "Contrôle du parcours académique...",
      "Validation des coordonnées...",
      "Génération du dossier...",
      "Envoi des notifications...",
      "Finalisation...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSubmissionProgress(((i + 1) / steps.length) * 100)
    }

    // Simuler le résultat (95% de chance de succès)
    const success = Math.random() > 0.05

    if (success) {
      setSubmissionStatus("success")
      // Simuler l'envoi d'emails
      setTimeout(() => {
        // Email de confirmation envoyé
      }, 1000)
    } else {
      setSubmissionStatus("error")
    }

    setIsSubmitting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
      case "error":
        return <Badge variant="destructive">Erreur</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  if (submissionStatus === "success") {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription Soumise avec Succès !</h2>
          <p className="text-gray-600">
            Votre dossier d'inscription a été transmis avec succès. Vous recevrez un email de confirmation dans quelques
            minutes.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Numéro de dossier:</span>
                <Badge variant="outline" className="font-mono">
                  {dossierNumber}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Date de soumission:</span>
                <span>{new Date().toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Délai de traitement:</span>
                <span>24-48 heures</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Un email de confirmation a été envoyé à <strong>{data.email}</strong>. Vérifiez également vos spams.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={downloadReceipt}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger le récépissé
          </Button>
          <Button asChild>
            <a href="/dashboard">Accéder à mon espace</a>
          </Button>
        </div>
      </div>
    )
  }

  if (submissionStatus === "error") {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur lors de la Soumission</h2>
          <p className="text-gray-600">
            Une erreur s'est produite lors de la soumission de votre dossier. Veuillez réessayer ou contacter le
            support.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur technique temporaire. Vos données ont été sauvegardées automatiquement.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setSubmissionStatus("idle")}>Réessayer</Button>
          <Button variant="outline">Contacter le support</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Validation et Soumission</h2>
        <p className="text-gray-600">Vérifiez vos informations avant de soumettre votre dossier d'inscription</p>
      </div>

      {submissionStatus === "submitting" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Soumission en cours...</span>
                <span className="text-sm text-gray-500">{Math.round(submissionProgress)}%</span>
              </div>
              <Progress value={submissionProgress} />
              <p className="text-sm text-gray-600 text-center">Veuillez patienter, ne fermez pas cette page.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {submissionStatus === "idle" && (
        <>
          {/* Résumé des sections */}
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informations Personnelles</span>
                  </CardTitle>
                  {getStatusBadge(validationResults.personalInfo)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nom:</span> {data.nom}
                  </div>
                  <div>
                    <span className="font-medium">Prénom(s):</span> {data.prenoms?.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Date de naissance:</span>
                    {data.dateNaissance && new Date(data.dateNaissance).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <span className="font-medium">Nationalité:</span> {data.nationalite}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Documents</span>
                  </CardTitle>
                  {getStatusBadge(validationResults.documents)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.documents?.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{doc.name}</span>
                      {getStatusIcon(doc.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Parcours Académique</span>
                  </CardTitle>
                  {getStatusBadge(validationResults.academic)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Dernier établissement:</span> {data.dernierEtablissement}
                  </div>
                  <div>
                    <span className="font-medium">Formations:</span> {data.formations?.length || 0} formation(s)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Coordonnées</span>
                  </CardTitle>
                  {getStatusBadge(validationResults.contact)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span> {data.email}
                  </div>
                  <div>
                    <span className="font-medium">Téléphone:</span> {data.telephone}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Adresse:</span> {data.adresse}, {data.ville} {data.codePostal}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations importantes */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Délai de traitement:</strong> Votre dossier sera traité dans un délai de 24 à 48 heures. Vous
              recevrez une notification par email et SMS à chaque étape.
            </AlertDescription>
          </Alert>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Notifications:</strong> Un email de confirmation sera envoyé à {data.email}. Assurez-vous que
              cette adresse est correcte.
            </AlertDescription>
          </Alert>

          {/* Workflow de validation */}
          <Card>
            <CardHeader>
              <CardTitle>Processus de Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Pré-validation automatique (2 min)</p>
                    <p className="text-sm text-gray-600">Vérification des formats et détection de fraude</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Contrôle manuel (24-48h)</p>
                    <p className="text-sm text-gray-600">Attribution à un agent et vérification approfondie</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Notification finale</p>
                    <p className="text-sm text-gray-600">Email et SMS de confirmation ou de demande de complément</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Précédent
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Soumission...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Soumettre le dossier
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

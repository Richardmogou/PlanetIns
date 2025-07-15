"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye } from "lucide-react"

interface DocumentsStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

interface Document {
  id: string
  name: string
  type: string
  file?: File
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  preview?: string
  error?: string
}

const requiredDocuments = [
  {
    id: "baccalaureat",
    name: "Diplôme du Baccalauréat",
    description: "PDF uniquement, max 5Mo",
    required: true,
    accept: ".pdf",
  },
  {
    id: "cni_recto",
    name: "CNI Recto",
    description: "JPG/PNG, vérification OCR",
    required: true,
    accept: ".jpg,.jpeg,.png",
  },
  {
    id: "cni_verso",
    name: "CNI Verso",
    description: "JPG/PNG, vérification OCR",
    required: true,
    accept: ".jpg,.jpeg,.png",
  },
  {
    id: "acte_naissance",
    name: "Acte de Naissance",
    description: "PDF avec détection de filigrane",
    required: true,
    accept: ".pdf",
  },
  {
    id: "photo_identite",
    name: "Photo d'Identité",
    description: "JPG/PNG, ratio 3.5x4.5cm",
    required: true,
    accept: ".jpg,.jpeg,.png",
  },
  {
    id: "diplomes_sup",
    name: "Diplômes Supérieurs",
    description: "PDF, optionnel si applicable",
    required: false,
    accept: ".pdf",
  },
]

export function DocumentsStep({ data, onUpdate, onNext, onPrevious }: DocumentsStepProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialiser les documents une seule fois
  useEffect(() => {
    if (data.documents && !isInitialized) {
      setDocuments(data.documents)
      setIsInitialized(true)
    }
  }, [data.documents, isInitialized])

  // Mettre à jour le parent quand les documents changent (mais pas lors de l'initialisation)
  useEffect(() => {
    if (isInitialized) {
      onUpdate({ documents })
    }
  }, [documents, isInitialized, onUpdate])

  const handleFileSelect = useCallback(async (docId: string, file: File) => {
    // Validation de la taille
    if (file.size > 5 * 1024 * 1024) {
      updateDocumentStatus(docId, "error", 0, "Fichier trop volumineux (max 5Mo)")
      return
    }

    // Validation du type
    const docConfig = requiredDocuments.find((d) => d.id === docId)
    const allowedTypes = docConfig?.accept.split(",").map((t) => t.trim()) || []
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(fileExtension)) {
      updateDocumentStatus(docId, "error", 0, "Type de fichier non autorisé")
      return
    }

    // Créer un aperçu pour les images
    let preview = ""
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file)
    }

    // Mettre à jour le document
    setDocuments((prev) => {
      const existing = prev.find((d) => d.id === docId)
      if (existing) {
        return prev.map((d) =>
          d.id === docId ? { ...d, file, status: "uploading", progress: 0, preview, error: undefined } : d,
        )
      } else {
        return [
          ...prev,
          {
            id: docId,
            name: docConfig?.name || "",
            type: file.type,
            file,
            status: "uploading",
            progress: 0,
            preview,
          },
        ]
      }
    })

    // Simuler l'upload
    await simulateUpload(docId)
  }, [])

  const simulateUpload = useCallback(async (docId: string) => {
    // Simulation de l'upload avec progression
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      updateDocumentStatus(docId, "uploading", progress)
    }

    // Simulation de la validation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simuler une validation réussie (90% de chance)
    const isValid = Math.random() > 0.1
    if (isValid) {
      updateDocumentStatus(docId, "success", 100)
    } else {
      updateDocumentStatus(docId, "error", 100, "Document non conforme aux exigences")
    }
  }, [])

  const updateDocumentStatus = useCallback(
    (docId: string, status: Document["status"], progress: number, error?: string) => {
      setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, status, progress, error } : d)))
    },
    [],
  )

  const removeDocument = useCallback((docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault()
    setDragOver(docId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, docId: string) => {
      e.preventDefault()
      setDragOver(null)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(docId, files[0])
      }
    },
    [handleFileSelect],
  )

  const getDocumentStatus = useCallback(
    (docId: string) => {
      return documents.find((d) => d.id === docId)
    },
    [documents],
  )

  const canProceed = useCallback(() => {
    const requiredDocs = requiredDocuments.filter((d) => d.required)
    return requiredDocs.every((doc) => {
      const status = getDocumentStatus(doc.id)
      return status && status.status === "success"
    })
  }, [getDocumentStatus])

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-600 animate-pulse" />
      default:
        return <Upload className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "error":
        return <Badge variant="destructive">Erreur</Badge>
      case "uploading":
        return <Badge className="bg-blue-100 text-blue-800">Upload...</Badge>
      default:
        return <Badge variant="secondary">En attente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Tous les documents marqués d'un astérisque (*) sont obligatoires. Les fichiers sont automatiquement vérifiés
          et validés.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {requiredDocuments.map((docConfig) => {
          const docStatus = getDocumentStatus(docConfig.id)

          return (
            <Card key={docConfig.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(docStatus?.status || "pending")}
                    <CardTitle className="text-lg">
                      {docConfig.name}
                      {docConfig.required && <span className="text-red-500 ml-1">*</span>}
                    </CardTitle>
                  </div>
                  {docStatus && getStatusBadge(docStatus.status)}
                </div>
                <CardDescription>{docConfig.description}</CardDescription>
              </CardHeader>

              <CardContent>
                {!docStatus ? (
                  // Zone d'upload
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver === docConfig.id ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={(e) => handleDragOver(e, docConfig.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, docConfig.id)}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Glissez-déposez votre fichier ici ou</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = docConfig.accept
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileSelect(docConfig.id, file)
                        }
                        input.click()
                      }}
                    >
                      Sélectionner un fichier
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">{docConfig.accept.toUpperCase()} - Max 5Mo</p>
                  </div>
                ) : (
                  // Document uploadé
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {docStatus.type.startsWith("image/") ? (
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-bold">IMG</span>
                          </div>
                        ) : (
                          <FileText className="h-8 w-8 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{docStatus.file?.name}</p>
                          <p className="text-sm text-gray-500">
                            {docStatus.file && (docStatus.file.size / 1024 / 1024).toFixed(2)} Mo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {docStatus.preview && (
                          <Button variant="outline" size="sm" onClick={() => window.open(docStatus.preview, "_blank")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => removeDocument(docConfig.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {docStatus.status === "uploading" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Upload en cours...</span>
                          <span>{docStatus.progress}%</span>
                        </div>
                        <Progress value={docStatus.progress} />
                      </div>
                    )}

                    {docStatus.status === "error" && docStatus.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{docStatus.error}</AlertDescription>
                      </Alert>
                    )}

                    {docStatus.status === "success" && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">Document validé avec succès</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed()}>
          {canProceed() ? "Continuer" : "Veuillez compléter tous les documents requis"}
        </Button>
      </div>
    </div>
  )
}

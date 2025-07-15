"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, School, BookOpen } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AcademicStepProps {
  data: Partial<FormData>
  onUpdate: (data: FormData) => void
  onNext: () => void
  onPrevious: () => void
}

interface Formation {
  id: string
  etablissement: string
  specialisation: string
  niveau: string
  dateDebut: Date | undefined
  dateFin: Date | undefined
  diplomeObtenu: boolean
}

interface FormData {
  dernierEtablissement: string
  formations: Formation[]
}

const etablissements = [
  "Université de Paris",
  "Sorbonne Université",
  "Université Lyon 1",
  "Université Aix-Marseille",
  "Université de Bordeaux",
  "Université de Lille",
  "Université de Strasbourg",
  "Université de Nantes",
  "Université de Montpellier",
  "Autre établissement",
]

const specialisations = {
  Sciences: ["Mathématiques", "Physique", "Chimie", "Biologie", "Informatique"],
  Lettres: ["Littérature française", "Langues étrangères", "Histoire", "Géographie", "Philosophie"],
  Économie: ["Économie-Gestion", "Commerce", "Finance", "Marketing", "Ressources Humaines"],
  Droit: ["Droit privé", "Droit public", "Droit international", "Droit des affaires"],
  Médecine: ["Médecine générale", "Pharmacie", "Dentaire", "Kinésithérapie"],
  Ingénierie: ["Génie civil", "Génie électrique", "Génie mécanique", "Génie informatique"],
}

const niveaux = [
  "Baccalauréat",
  "BTS/DUT",
  "Licence (L1)",
  "Licence (L2)",
  "Licence (L3)",
  "Master (M1)",
  "Master (M2)",
  "Doctorat",
  "École d'ingénieur",
  "École de commerce",
]

export function AcademicStep({ data, onUpdate, onNext, onPrevious }: AcademicStepProps) {
  const [formData, setFormData] = useState<FormData>({
    dernierEtablissement: "",
    formations: [],
    ...data,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedDomaine, setSelectedDomaine] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialiser les données une seule fois
  useEffect(() => {
    if (Object.keys(data).length > 0 && !isInitialized) {
      setFormData((prev) => ({ ...prev, ...data }))
      setIsInitialized(true)
    }
  }, [data, isInitialized])

  // Mettre à jour le parent quand les données changent (mais pas lors de l'initialisation)
  useEffect(() => {
    if (isInitialized) {
      onUpdate(formData)
    }
  }, [formData, isInitialized, onUpdate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dernierEtablissement.trim()) {
      newErrors.dernierEtablissement = "Le dernier établissement est requis"
    }

    if (formData.formations.length === 0) {
      newErrors.formations = "Au moins une formation doit être renseignée"
    } else {
      formData.formations.forEach((formation, index) => {
        if (!formation.etablissement.trim()) {
          newErrors[`formation_${index}_etablissement`] = "L'établissement est requis"
        }
        if (!formation.specialisation) {
          newErrors[`formation_${index}_specialisation`] = "La spécialisation est requise"
        }
        if (!formation.niveau) {
          newErrors[`formation_${index}_niveau`] = "Le niveau est requis"
        }
        if (!formation.dateDebut) {
          newErrors[`formation_${index}_dateDebut`] = "La date de début est requise"
        }
        if (!formation.dateFin) {
          newErrors[`formation_${index}_dateFin`] = "La date de fin est requise"
        }
        if (formation.dateDebut && formation.dateFin && formation.dateDebut >= formation.dateFin) {
          newErrors[`formation_${index}_dates`] = "La date de fin doit être postérieure à la date de début"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const addFormation = useCallback(() => {
    const newFormation: Formation = {
      id: Date.now().toString(),
      etablissement: "",
      specialisation: "",
      niveau: "",
      dateDebut: undefined,
      dateFin: undefined,
      diplomeObtenu: false,
    }

    setFormData((prev) => ({
      ...prev,
      formations: [...prev.formations, newFormation],
    }))
  }, [])

  const updateFormation = useCallback((id: string, field: keyof Formation, value: any) => {
    setFormData((prev) => ({
      ...prev,
      formations: prev.formations.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }))
  }, [])

  const removeFormation = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      formations: prev.formations.filter((f) => f.id !== id),
    }))
  }, [])

  const checkDateOverlap = (formations: Formation[]) => {
    for (let i = 0; i < formations.length; i++) {
      for (let j = i + 1; j < formations.length; j++) {
        const f1 = formations[i]
        const f2 = formations[j]

        if (f1.dateDebut && f1.dateFin && f2.dateDebut && f2.dateFin) {
          if (
            (f1.dateDebut <= f2.dateFin && f1.dateFin >= f2.dateDebut) ||
            (f2.dateDebut <= f1.dateFin && f2.dateFin >= f1.dateDebut)
          ) {
            return true
          }
        }
      }
    }
    return false
  }

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <div className="space-y-6">
      {/* Dernier établissement */}
      <div className="space-y-2">
        <Label htmlFor="dernierEtablissement" className="flex items-center space-x-2">
          <School className="h-4 w-4" />
          <span>Dernier établissement fréquenté *</span>
        </Label>
        <Select
          value={formData.dernierEtablissement}
          onValueChange={(value) => updateFormData({ dernierEtablissement: value })}
        >
          <SelectTrigger className={errors.dernierEtablissement ? "border-red-500" : ""}>
            <SelectValue placeholder="Sélectionner votre dernier établissement" />
          </SelectTrigger>
          <SelectContent>
            {etablissements.map((etab) => (
              <SelectItem key={etab} value={etab}>
                {etab}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.dernierEtablissement && <p className="text-sm text-red-500">{errors.dernierEtablissement}</p>}
      </div>

      {/* Formations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Parcours académique *</span>
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addFormation}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une formation
          </Button>
        </div>

        {formData.formations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucune formation ajoutée</p>
                <Button onClick={addFormation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre première formation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.formations.map((formation, index) => (
          <Card key={formation.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Formation {index + 1}</CardTitle>
                <div className="flex items-center space-x-2">
                  {formation.diplomeObtenu && <Badge className="bg-green-100 text-green-800">Diplôme obtenu</Badge>}
                  <Button variant="outline" size="sm" onClick={() => removeFormation(formation.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Établissement */}
                <div className="space-y-2">
                  <Label>Établissement *</Label>
                  <Input
                    value={formation.etablissement}
                    onChange={(e) => updateFormation(formation.id, "etablissement", e.target.value)}
                    placeholder="Nom de l'établissement"
                    className={errors[`formation_${index}_etablissement`] ? "border-red-500" : ""}
                  />
                  {errors[`formation_${index}_etablissement`] && (
                    <p className="text-sm text-red-500">{errors[`formation_${index}_etablissement`]}</p>
                  )}
                </div>

                {/* Niveau */}
                <div className="space-y-2">
                  <Label>Niveau *</Label>
                  <Select
                    value={formation.niveau}
                    onValueChange={(value) => updateFormation(formation.id, "niveau", value)}
                  >
                    <SelectTrigger className={errors[`formation_${index}_niveau`] ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {niveaux.map((niveau) => (
                        <SelectItem key={niveau} value={niveau}>
                          {niveau}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`formation_${index}_niveau`] && (
                    <p className="text-sm text-red-500">{errors[`formation_${index}_niveau`]}</p>
                  )}
                </div>
              </div>

              {/* Spécialisation */}
              <div className="space-y-2">
                <Label>Spécialisation *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Select value={selectedDomaine} onValueChange={setSelectedDomaine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domaine d'études" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(specialisations).map((domaine) => (
                        <SelectItem key={domaine} value={domaine}>
                          {domaine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formation.specialisation}
                    onValueChange={(value) => updateFormation(formation.id, "specialisation", value)}
                    disabled={!selectedDomaine}
                  >
                    <SelectTrigger className={errors[`formation_${index}_specialisation`] ? "border-red-500" : ""}>
                      <SelectValue placeholder="Spécialisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDomaine &&
                        specialisations[selectedDomaine as keyof typeof specialisations]?.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors[`formation_${index}_specialisation`] && (
                  <p className="text-sm text-red-500">{errors[`formation_${index}_specialisation`]}</p>
                )}
              </div>

              {/* Période */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formation.dateDebut && "text-muted-foreground"
                        } ${errors[`formation_${index}_dateDebut`] ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formation.dateDebut ? (
                          format(formation.dateDebut, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formation.dateDebut}
                        onSelect={(date) => updateFormation(formation.id, "dateDebut", date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[`formation_${index}_dateDebut`] && (
                    <p className="text-sm text-red-500">{errors[`formation_${index}_dateDebut`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date de fin *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formation.dateFin && "text-muted-foreground"
                        } ${errors[`formation_${index}_dateFin`] ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formation.dateFin ? (
                          format(formation.dateFin, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formation.dateFin}
                        onSelect={(date) => updateFormation(formation.id, "dateFin", date)}
                        disabled={(date) => (formation.dateDebut ? date < formation.dateDebut : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[`formation_${index}_dateFin`] && (
                    <p className="text-sm text-red-500">{errors[`formation_${index}_dateFin`]}</p>
                  )}
                </div>
              </div>

              {errors[`formation_${index}_dates`] && (
                <p className="text-sm text-red-500">{errors[`formation_${index}_dates`]}</p>
              )}

              {/* Diplôme obtenu */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`diplome_${formation.id}`}
                  checked={formation.diplomeObtenu}
                  onChange={(e) => updateFormation(formation.id, "diplomeObtenu", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`diplome_${formation.id}`}>Diplôme obtenu</Label>
              </div>
            </CardContent>
          </Card>
        ))}

        {errors.formations && <p className="text-sm text-red-500">{errors.formations}</p>}

        {checkDateOverlap(formData.formations) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Attention: Certaines formations se chevauchent dans le temps. Veuillez vérifier les dates.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={handleSubmit}>Continuer</Button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, User, Users, Globe } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PersonalInfoStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

const nationalites = [
  "Française",
  "Algérienne",
  "Marocaine",
  "Tunisienne",
  "Sénégalaise",
  "Camerounaise",
  "Ivoirienne",
  "Malienne",
  "Burkinabé",
  "Autre",
]

const typesIdentite = [
  { value: "cni", label: "Carte Nationale d'Identité" },
  { value: "passeport", label: "Passeport" },
  { value: "acte_naissance", label: "Acte de Naissance" },
]

export function PersonalInfoStep({ data, onUpdate, onNext, onPrevious }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: [""],
    sexe: "",
    dateNaissance: null as Date | null,
    nationalite: "",
    typeIdentite: "",
    ...data,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
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

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.nom)) {
      newErrors.nom = "Le nom ne peut contenir que des lettres"
    }

    if (!formData.prenoms[0].trim()) {
      newErrors.prenoms = "Au moins un prénom est requis"
    }

    if (!formData.sexe) {
      newErrors.sexe = "Le sexe est requis"
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est requise"
    } else {
      const age = new Date().getFullYear() - formData.dateNaissance.getFullYear()
      if (age < 16) {
        newErrors.dateNaissance = "Vous devez avoir au moins 16 ans"
      }
    }

    if (!formData.nationalite) {
      newErrors.nationalite = "La nationalité est requise"
    }

    if (!formData.typeIdentite) {
      newErrors.typeIdentite = "Le type de pièce d'identité est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const updateFormData = useCallback((updates: any) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const addPrenom = useCallback(() => {
    updateFormData({
      prenoms: [...formData.prenoms, ""],
    })
  }, [formData.prenoms, updateFormData])

  const updatePrenom = useCallback(
    (index: number, value: string) => {
      updateFormData({
        prenoms: formData.prenoms.map((p, i) => (i === index ? value : p)),
      })
    },
    [formData.prenoms, updateFormData],
  )

  const removePrenom = useCallback(
    (index: number) => {
      if (formData.prenoms.length > 1) {
        updateFormData({
          prenoms: formData.prenoms.filter((_, i) => i !== index),
        })
      }
    },
    [formData.prenoms, updateFormData],
  )

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="nom" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Nom *</span>
          </Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => updateFormData({ nom: e.target.value })}
            placeholder="Votre nom de famille"
            className={errors.nom ? "border-red-500" : ""}
          />
          {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
        </div>

        {/* Sexe */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Sexe *</span>
          </Label>
          <RadioGroup
            value={formData.sexe}
            onValueChange={(value) => updateFormData({ sexe: value })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="masculin" />
              <Label htmlFor="masculin">Masculin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="feminin" />
              <Label htmlFor="feminin">Féminin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NB" id="non-binaire" />
              <Label htmlFor="non-binaire">Non-binaire</Label>
            </div>
          </RadioGroup>
          {errors.sexe && <p className="text-sm text-red-500">{errors.sexe}</p>}
        </div>
      </div>

      {/* Prénoms */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Prénom(s) *</span>
        </Label>
        {formData.prenoms.map((prenom, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={prenom}
              onChange={(e) => updatePrenom(index, e.target.value)}
              placeholder={`Prénom ${index + 1}`}
              className={errors.prenoms && index === 0 ? "border-red-500" : ""}
            />
            {index > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => removePrenom(index)}>
                Supprimer
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addPrenom} className="mt-2">
          Ajouter un prénom
        </Button>
        {errors.prenoms && <p className="text-sm text-red-500">{errors.prenoms}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date de naissance */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Date de naissance *</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !formData.dateNaissance && "text-muted-foreground"
                } ${errors.dateNaissance ? "border-red-500" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateNaissance ? (
                  format(formData.dateNaissance, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateNaissance}
                onSelect={(date) => updateFormData({ dateNaissance: date })}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateNaissance && <p className="text-sm text-red-500">{errors.dateNaissance}</p>}
        </div>

        {/* Nationalité */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Nationalité *</span>
          </Label>
          <Select value={formData.nationalite} onValueChange={(value) => updateFormData({ nationalite: value })}>
            <SelectTrigger className={errors.nationalite ? "border-red-500" : ""}>
              <SelectValue placeholder="Sélectionner votre nationalité" />
            </SelectTrigger>
            <SelectContent>
              {nationalites.map((nat) => (
                <SelectItem key={nat} value={nat}>
                  {nat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationalite && <p className="text-sm text-red-500">{errors.nationalite}</p>}
        </div>
      </div>

      {/* Type de pièce d'identité */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Type de pièce d'identité *</span>
        </Label>
        <Select value={formData.typeIdentite} onValueChange={(value) => updateFormData({ typeIdentite: value })}>
          <SelectTrigger className={errors.typeIdentite ? "border-red-500" : ""}>
            <SelectValue placeholder="Sélectionner le type de pièce d'identité" />
          </SelectTrigger>
          <SelectContent>
            {typesIdentite.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.typeIdentite && <p className="text-sm text-red-500">{errors.typeIdentite}</p>}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Continuer</Button>
      </div>
    </div>
  )
}

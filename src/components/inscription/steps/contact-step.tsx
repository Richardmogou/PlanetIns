"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, User, CheckCircle, AlertCircle } from "lucide-react"

interface PersonneUrgence {
  nom: string
  prenom: string
  telephone: string
  relation: string
}

interface FormData {
  email: string
  emailConfirmation: string
  telephone: string
  adresse: string
  ville: string
  codePostal: string
  pays: string
  personneUrgence: PersonneUrgence
}

interface ContactStepProps {
  data: Partial<FormData>
  onUpdate: (data: FormData) => void
  onNext: () => void
  onPrevious: () => void
}

export function ContactStep({ data, onUpdate, onNext, onPrevious }: ContactStepProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    emailConfirmation: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    personneUrgence: {
      nom: "",
      prenom: "",
      telephone: "",
      relation: "",
    },
    ...data,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    // Confirmation email
    if (!formData.emailConfirmation.trim()) {
      newErrors.emailConfirmation = "La confirmation d'email est requise"
    } else if (formData.email !== formData.emailConfirmation) {
      newErrors.emailConfirmation = "Les emails ne correspondent pas"
    }

    // Téléphone
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis"
    } else if (!validatePhone(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide"
    }

    // Adresse
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise"
    }

    if (!formData.ville.trim()) {
      newErrors.ville = "La ville est requise"
    }

    if (!formData.codePostal.trim()) {
      newErrors.codePostal = "Le code postal est requis"
    } else if (!/^\d{5}$/.test(formData.codePostal)) {
      newErrors.codePostal = "Code postal invalide (5 chiffres)"
    }

    // Personne d'urgence
    if (!formData.personneUrgence.nom.trim()) {
      newErrors.personneUrgenceNom = "Le nom de la personne à contacter est requis"
    }

    if (!formData.personneUrgence.prenom.trim()) {
      newErrors.personneUrgencePrenom = "Le prénom de la personne à contacter est requis"
    }

    if (!formData.personneUrgence.telephone.trim()) {
      newErrors.personneUrgenceTelephone = "Le téléphone de la personne à contacter est requis"
    } else if (!validatePhone(formData.personneUrgence.telephone)) {
      newErrors.personneUrgenceTelephone = "Format de téléphone invalide"
    }

    if (!formData.personneUrgence.relation.trim()) {
      newErrors.personneUrgenceRelation = "La relation est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const verifyEmail = useCallback(async () => {
    if (validateEmail(formData.email)) {
      // Simuler la vérification d'email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEmailVerified(true)
    }
  }, [formData.email])

  const verifyPhone = useCallback(async () => {
    if (validatePhone(formData.telephone)) {
      // Simuler la vérification de téléphone
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPhoneVerified(true)
    }
  }, [formData.telephone])

  const searchAddress = useCallback(async (query: string) => {
    if (query.length > 3) {
      // Simuler l'API de géolocalisation
      const suggestions = [
        `${query}, Paris 75001`,
        `${query}, Lyon 69000`,
        `${query}, Marseille 13000`,
        `${query}, Toulouse 31000`,
      ]
      setAddressSuggestions(suggestions)
    } else {
      setAddressSuggestions([])
    }
  }, [])

  const selectAddress = useCallback((address: string) => {
    const parts = address.split(", ")
    if (parts.length >= 2) {
      const cityPart = parts[1]
      const cityMatch = cityPart.match(/^(.+)\s(\d{5})$/)

      if (cityMatch) {
        setFormData((prev) => ({
          ...prev,
          adresse: parts[0],
          ville: cityMatch[1],
          codePostal: cityMatch[2],
        }))
      }
    }
    setAddressSuggestions([])
  }, [])

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <div className="space-y-6">
      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Adresse Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="votre@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                <Button variant="outline" onClick={verifyEmail} disabled={!formData.email || emailVerified}>
                  {emailVerified ? <CheckCircle className="h-4 w-4" /> : "Vérifier"}
                </Button>
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              {emailVerified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Email vérifié
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailConfirmation">Confirmation Email *</Label>
              <Input
                id="emailConfirmation"
                type="email"
                value={formData.emailConfirmation}
                onChange={(e) => updateFormData({ emailConfirmation: e.target.value })}
                placeholder="Confirmer votre email"
                className={errors.emailConfirmation ? "border-red-500" : ""}
              />
              {errors.emailConfirmation && <p className="text-sm text-red-500">{errors.emailConfirmation}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Téléphone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Téléphone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="telephone">Numéro de téléphone *</Label>
            <div className="flex space-x-2">
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => updateFormData({ telephone: e.target.value })}
                placeholder="+33 1 23 45 67 89"
                className={errors.telephone ? "border-red-500" : ""}
              />
              <Button variant="outline" onClick={verifyPhone} disabled={!formData.telephone || phoneVerified}>
                {phoneVerified ? <CheckCircle className="h-4 w-4" /> : "Vérifier"}
              </Button>
            </div>
            {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
            {phoneVerified && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Téléphone vérifié
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Adresse</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse complète *</Label>
            <div className="relative">
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => {
                  updateFormData({ adresse: e.target.value })
                  searchAddress(e.target.value)
                }}
                placeholder="123 rue de la République"
                className={errors.adresse ? "border-red-500" : ""}
              />
              {addressSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                      onClick={() => selectAddress(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.adresse && <p className="text-sm text-red-500">{errors.adresse}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ville">Ville *</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => updateFormData({ ville: e.target.value })}
                placeholder="Paris"
                className={errors.ville ? "border-red-500" : ""}
              />
              {errors.ville && <p className="text-sm text-red-500">{errors.ville}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codePostal">Code Postal *</Label>
              <Input
                id="codePostal"
                value={formData.codePostal}
                onChange={(e) => updateFormData({ codePostal: e.target.value })}
                placeholder="75001"
                className={errors.codePostal ? "border-red-500" : ""}
              />
              {errors.codePostal && <p className="text-sm text-red-500">{errors.codePostal}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pays">Pays *</Label>
              <Input
                id="pays"
                value={formData.pays}
                onChange={(e) => updateFormData({ pays: e.target.value })}
                placeholder="France"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personne à contacter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personne à Contacter (Urgence)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Ces informations seront utilisées uniquement en cas d'urgence.</AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgenceNom">Nom *</Label>
              <Input
                id="urgenceNom"
                value={formData.personneUrgence.nom}
                onChange={(e) =>
                  updateFormData({ personneUrgence: { ...formData.personneUrgence, nom: e.target.value } })
                }
                placeholder="Nom de famille"
                className={errors.personneUrgenceNom ? "border-red-500" : ""}
              />
              {errors.personneUrgenceNom && <p className="text-sm text-red-500">{errors.personneUrgenceNom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencePrenom">Prénom *</Label>
              <Input
                id="urgencePrenom"
                value={formData.personneUrgence.prenom}
                onChange={(e) =>
                  updateFormData({ personneUrgence: { ...formData.personneUrgence, prenom: e.target.value } })
                }
                placeholder="Prénom"
                className={errors.personneUrgencePrenom ? "border-red-500" : ""}
              />
              {errors.personneUrgencePrenom && <p className="text-sm text-red-500">{errors.personneUrgencePrenom}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgenceTelephone">Téléphone *</Label>
              <Input
                id="urgenceTelephone"
                type="tel"
                value={formData.personneUrgence.telephone}
                onChange={(e) =>
                  updateFormData({ personneUrgence: { ...formData.personneUrgence, telephone: e.target.value } })
                }
                placeholder="+33 1 23 45 67 89"
                className={errors.personneUrgenceTelephone ? "border-red-500" : ""}
              />
              {errors.personneUrgenceTelephone && (
                <p className="text-sm text-red-500">{errors.personneUrgenceTelephone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgenceRelation">Relation *</Label>
              <Input
                id="urgenceRelation"
                value={formData.personneUrgence.relation}
                onChange={(e) =>
                  updateFormData({ personneUrgence: { ...formData.personneUrgence, relation: e.target.value } })
                }
                placeholder="Père, Mère, Conjoint, etc."
                className={errors.personneUrgenceRelation ? "border-red-500" : ""}
              />
              {errors.personneUrgenceRelation && (
                <p className="text-sm text-red-500">{errors.personneUrgenceRelation}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={handleSubmit}>Continuer</Button>
      </div>
    </div>
  )
}

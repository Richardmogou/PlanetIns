"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ArrowLeft, ArrowRight, Save } from "lucide-react"


// Import des étapes
import { PersonalInfoStep } from "./steps/personal-info-step"
import { DocumentsStep } from "./steps/documents-step"
import { AcademicStep } from "./steps/academic-step"
import { ContactStep } from "./steps/contact-step"
import { ValidationStep } from "./steps/validation-step"
import { Link } from "react-router-dom"

const steps = [
  { id: 1, title: "Informations Personnelles", component: PersonalInfoStep },
  { id: 2, title: "Documents Officiels", component: DocumentsStep },
  { id: 3, title: "Parcours Académique", component: AcademicStep },
  { id: 4, title: "Coordonnées", component: ContactStep },
  { id: 5, title: "Validation", component: ValidationStep },
]

export function InscriptionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      autoSave()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const autoSave = async () => {
    setIsAutoSaving(true)
    // Simuler la sauvegarde automatique
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAutoSaving(false)
  }

  const updateFormData = useCallback((stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }, [])

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">UniPortal</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Universitaire</h1>
          <p className="text-gray-600">
            Étape {currentStep} sur {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progression</span>
          <div className="flex items-center space-x-2">
            {isAutoSaving && (
              <Badge variant="secondary" className="text-xs">
                <Save className="h-3 w-3 mr-1" />
                Sauvegarde...
              </Badge>
            )}
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  step.id === currentStep
                    ? "bg-blue-100 text-blue-700"
                    : step.id < currentStep
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <Button onClick={handleNext} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? "Terminer" : "Suivant"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

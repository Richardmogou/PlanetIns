
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, FileText, Shield, Clock, Users, CheckCircle, ArrowRight, Globe, Smartphone } from "lucide-react"
import { Link } from "react-router-dom"


export function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">InscripRichy</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link to="#process" className="text-gray-600 hover:text-blue-600 transition-colors">
              Processus
            </Link>
            <Link to="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/auth/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/inscription">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Nouveau système d'inscription 2024
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Inscription Universitaire
              <span className="text-blue-600 block">Simplifiée</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plateforme complète d'inscription en ligne avec workflow automatisé, validation intelligente des documents
              et suivi en temps réel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/inscription">
                  Commencer l'inscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link to="/demo">Voir la démo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Étudiants inscrits</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Taux de satisfaction</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <div className="text-gray-600">Validation moyenne</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-3xl font-bold text-orange-600 mb-2">5 min</div>
              <div className="text-gray-600">Temps d'inscription</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnalités Avancées</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète conçue pour simplifier le processus d'inscription
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Formulaire Intelligent</CardTitle>
                <CardDescription>
                  Processus en 5 étapes avec sauvegarde automatique et validation en temps réel
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Validation Automatisée</CardTitle>
                <CardDescription>
                  Vérification intelligente des documents avec OCR et détection de fraude
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Suivi Temps Réel</CardTitle>
                <CardDescription>Dashboard avec notifications multicanal et alertes de progression</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Espace Administrateur</CardTitle>
                <CardDescription>Gestion complète des dossiers avec analytics et export massif</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-pink-600 mb-4" />
                <CardTitle>Mobile-First</CardTitle>
                <CardDescription>Interface responsive optimisée pour tous les appareils</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Multi-Authentification</CardTitle>
                <CardDescription>Connexion sécurisée via email, Google, Microsoft avec CAPTCHA</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Processus d'Inscription</h2>
            <p className="text-xl text-gray-600">Un workflow optimisé en 5 étapes simples</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Informations Personnelles",
                  description: "Saisie des données personnelles avec validation intelligente",
                  icon: Users,
                },
                {
                  step: 2,
                  title: "Documents Officiels",
                  description: "Upload sécurisé avec preview et vérification automatique",
                  icon: FileText,
                },
                {
                  step: 3,
                  title: "Parcours Académique",
                  description: "Historique de formation avec autocomplete",
                  icon: GraduationCap,
                },
                {
                  step: 4,
                  title: "Coordonnées",
                  description: "Contact et adresse avec géolocalisation",
                  icon: Globe,
                },
                {
                  step: 5,
                  title: "Validation",
                  description: "Contrôle automatique et notification multicanal",
                  icon: CheckCircle,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <item.icon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à commencer votre inscription ?</h2>
          <p className="text-xl mb-8 opacity-90">Rejoignez des milliers d'étudiants qui ont choisi notre plateforme</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
            <Link to="/inscription">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="text-lg font-bold">InscripRichy</span>
              </div>
              <p className="text-gray-400">Plateforme d'inscription universitaire nouvelle génération</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/inscription" className="hover:text-white">
                    Inscription
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login" className="hover:text-white">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white">
                    Administration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/aide" className="hover:text-white">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InscripRichy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

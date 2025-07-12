"use client"

import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {FolderOpen, Plus, Radio, Settings, User, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect} from "react"

interface User {
  first_name: string
  email: string
}

export default function HomePage() {
  // Simuler l'état de connexion - dans une vraie app, cela viendrait d'un contexte d'auth
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
    // Simuler une récupération de l'utilisateur connecté
    const token= localStorage.getItem("token")
    if(!token){
      setLoading(false)
      return 
    }

    fetch("http://localhost:8000/api/users/me",{
      headers:{
        Authorization : `Bearer ${token}`,
      }
    }) 
    .then(async(res)=>{
      if(!res.ok) throw new Error("Impossible de récupérer le profil")
       const data = await res.json()
       setUser(data)
    })
    .catch((err) =>{
        console.error(err)
        localStorage.removeItem("token") // On enléve le token invalide
    })
    .finally(() =>setLoading(false))
  }, [])
 
  if(Loading){
    return(
      <div className="min-h-screen flex items-center justify-center ">
        chargement ...
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">TelecomDim</h1>
              <p className="text-sm text-slate-600">Outil de dimensionnement GSM</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              // Menu utilisateur connecté
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    {user.first_name}
                  </Link>
                </Button>
                {/* <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button> */}
                <Button variant="outline" size="sm" onClick={() => {localStorage.removeItem("token") 
                setUser(null)}}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              // Menu utilisateur non connecté
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Se Connecter
                  </Link>
                </Button>
                <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto">
                {/* Welcome Section */}
                <div className="text-center mb-12">
             {user && user.first_name ? (
           <>     
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    Bienvenue {user.first_name} 
                  </h2>
                  
            </>
            ):(
                  <>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    Bienvenue dans TelecomDim
                  </h2>
                  
          </>
            )}
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Outil professionnel de dimensionnement et planification des réseaux GSM. Créez vos projets et effectuez
              vos calculs de dimensionnement en toute simplicité.
            </p>
          </div>

          {/* Action Cards */}
          {user ? (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <Plus className="w-8 h-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl">Créer un Projet</CardTitle>
                  <CardDescription className="text-base">
                    Démarrez un nouveau projet de dimensionnement GSM avec vos paramètres personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/projects">Nouveau Projet</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <FolderOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Ouvrir un Projet</CardTitle>
                  <CardDescription className="text-base">
                    Accédez à vos projets existants et continuez vos calculs de dimensionnement
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    asChild
                  >
                    <Link href="/projects">Mes Projets</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Call to action pour utilisateurs non connectés
            <div className="text-center mb-12">
              <Card className="max-w-md mx-auto border-2 border-emerald-200 bg-emerald-50/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-emerald-800">Commencez dès maintenant</CardTitle>
                  <CardDescription className="text-emerald-700">
                    Créez votre compte gratuit pour accéder à tous les outils de dimensionnement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/register">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Créer un compte gratuit
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/login">
                      <LogIn className="w-5 h-5 mr-2" />
                      J'ai déjà un compte
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Fonctionnalités Principales</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Radio className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Dimensionnement GSM</h4>
                <p className="text-sm text-slate-600">Calculs précis pour le dimensionnement des réseaux GSM</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Interface Intuitive</h4>
                <p className="text-sm text-slate-600">Saisie simple des paramètres et visualisation des résultats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Gestion de Projets</h4>
                <p className="text-sm text-slate-600">Sauvegarde et organisation de tous vos projets</p>
              </div>
            </div>
          </div>

          {/* Demo Button for non-logged users */}
          {/* {!isLoggedIn && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsLoggedIn(true)}
                className="bg-transparent border-emerald-200 hover:bg-emerald-50"
              >
                🎯 Essayer la démo (simulation connexion)
              </Button>
            </div>
          )} */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-600">
          <p>© 2025 TelecomDim - Outil de dimensionnement des systèmes de télécommunications</p>
          <p className="text-sm mt-1">M1_GLSI/DGI/ESP/UCAD - Dr FALL</p>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { set } from "date-fns"
import { Home, Radio, Save, Settings, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface User {
  first_name: string
  last_name: string
  email: string
  phone: string
  organization: string
  bio: string
}

export default function ProfilPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | undefined>()
  const roleLabels: Record<string, string> = {
    student: "Étudiant",
    engineer: "Ingénieur Télécoms",
    researcher: "Chercheur",
    professor: "Professeur",
    other: "Autre",
  };
  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    setIsLoading(true)

    fetch("http://localhost:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Impossible de récupérer le profil")
        const data = await res.json()
        setUser(data)
        setRole(data.role) // Définir le rôle 
      })
      .catch((err) => {
        console.error(err)
        localStorage.removeItem("token")
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Non authentifié")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: (e.target as any).firstName.value,
          last_name: (e.target as any).lastName.value,
          email: (e.target as any).email.value,
          phone: (e.target as any).phone.value,
          role: role,
          organization: (e.target as any).organization.value,
          bio: (e.target as any).bio.value,
        }),
      })

  if (res.status === 204) {
    // No content
    alert("Profil mis à jour !")
    return
  }

  const text = await res.text()

  if (!res.ok) {
    console.error("Réponse erreur :", text)
    throw new Error(`Erreur lors de la mise à jour: ${res.status}`)
  }

  const data = text ? JSON.parse(text) : null

  if (data) setUser(data)

  alert("Profil mis à jour !")
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        chargement ...
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">Profil Utilisateur</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-600" />
            <span className="font-bold">TelecomDim</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <CardTitle>{user? `${user.first_name} ${user.last_name}` : "Utilisateur"} </CardTitle>
              <CardDescription>{role ? roleLabels[role] : ""}</CardDescription>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>Gérez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" defaultValue={user?.first_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue={user?.last_name || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" defaultValue={user?.phone || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input id="organization" defaultValue={user?.organization || ""}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant</SelectItem>
                      <SelectItem value="engineer">Ingénieur Télécoms</SelectItem>
                      <SelectItem value="researcher">Chercheur</SelectItem>
                      <SelectItem value="professor">Professeur</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    placeholder="Parlez-nous de votre expérience en télécommunications..."
                    defaultValue={user?.bio || ""}
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du Compte</CardTitle>
              <CardDescription>Aperçu de votre activité sur TelecomDim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">12</div>
                  <div className="text-sm text-slate-600">Projets créés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">48</div>
                  <div className="text-sm text-slate-600">Calculs effectués</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-slate-600">Rapports générés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Gérez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Mot de passe</div>
                  <div className="text-sm text-slate-600">Dernière modification il y a 30 jours</div>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Authentification à deux facteurs</div>
                  <div className="text-sm text-slate-600">Sécurisez votre compte avec 2FA</div>
                </div>
                <Button variant="outline" size="sm">
                  Activer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

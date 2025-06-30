"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Home, Radio, Save, Settings, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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
              <CardTitle>Jean Dupont</CardTitle>
              <CardDescription>Ingénieur Télécommunications</CardDescription>
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
                    <Input id="firstName" defaultValue="Jean" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue="Dupont" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jean.dupont@esp.sn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" defaultValue="+221 77 123 45 67" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input id="organization" defaultValue="École Supérieure Polytechnique" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue="engineer">
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
                    defaultValue="Ingénieur spécialisé en réseaux mobiles avec 5 ans d'expérience dans le dimensionnement et la planification des réseaux GSM/UMTS."
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

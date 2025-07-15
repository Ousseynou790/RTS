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
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket"
import Navbar from "@/components/Navbar"
import { useAuth, apiCall } from "@/hooks/useAuth"

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
  const [role, setRole] = useState<string | undefined>()
  const roleLabels: Record<string, string> = {
    student: "Étudiant",
    engineer: "Ingénieur Télécoms",
    researcher: "Chercheur",
    professor: "Professeur",
    other: "Autre",
  };
  const [stats, setStats] = useState({ projects: 0, calculations: 0, reports: 0 });
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdError, setPwdError] = useState<string|null>(null)
  const [pwdSuccess, setPwdSuccess] = useState<string|null>(null)
  const oldPwdRef = useRef<HTMLInputElement>(null)
  const newPwdRef = useRef<HTMLInputElement>(null)
  const confirmPwdRef = useRef<HTMLInputElement>(null)
  const router = useRouter();
  const { user, loading, requireAuth } = useAuth()
  // Vérifier l'authentification
  useEffect(() => {
    if (!loading && !user) {
      requireAuth();
    }
  }, [loading, user, requireAuth]);
  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      setRole((user as any).role); // Définir le rôle
    }
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // Projets
    fetch("http://localhost:8000/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStats(s => ({ ...s, projects: data.length })))
      .catch(() => {});
    // Calculs
    fetch("http://localhost:8000/api/calculations", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStats(s => ({ ...s, calculations: data.length })))
      .catch(() => {});
    // Rapports
    fetch("http://localhost:8000/api/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStats(s => ({ ...s, reports: data.length })))
      .catch(() => {});
  }, []);

  useNotificationsSocket(user && (user as any).id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      toast({ title: "Erreur", description: "Non authentifié", variant: "destructive" });
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
    toast({ title: "Succès", description: "Profil mis à jour !" })
    return
  }

  const text = await res.text()

  if (!res.ok) {
    toast({ title: "Erreur", description: "Erreur lors de la mise à jour du profil", variant: "destructive" })
    throw new Error(`Erreur lors de la mise à jour: ${res.status}`)
  }

  const data = text ? JSON.parse(text) : null

  toast({ title: "Succès", description: "Profil mis à jour !" })
    } catch (err) {
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde du profil", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError(null)
    setPwdSuccess(null)
    if (!oldPwdRef.current || !newPwdRef.current || !confirmPwdRef.current) return
    const old_password = oldPwdRef.current.value
    const new_password = newPwdRef.current.value
    const confirm_password = confirmPwdRef.current.value
    if (new_password !== confirm_password) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return
    }
    if (new_password.length < 6) {
      toast({ title: "Erreur", description: "Le nouveau mot de passe doit contenir au moins 6 caractères.", variant: "destructive" });
      return
    }
    setPwdLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      toast({ title: "Erreur", description: "Non authentifié", variant: "destructive" });
      setPwdLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:8000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password, new_password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Erreur", description: data.detail || "Erreur lors du changement de mot de passe", variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Mot de passe modifié avec succès !" });
        oldPwdRef.current.value = ""
        newPwdRef.current.value = ""
        confirmPwdRef.current.value = ""
      }
    } catch (err) {
      toast({ title: "Erreur", description: "Erreur réseau ou serveur", variant: "destructive" });
    } finally {
      setPwdLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        chargement ...
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        showHome={true}
        showProjects={false}
        title="Profil Utilisateur"
        subtitle="Gestion du compte"
      />

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
                  <div className="text-2xl font-bold text-emerald-600">{stats.projects}</div>
                  <div className="text-sm text-slate-600">Projets créés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.calculations}</div>
                  <div className="text-sm text-slate-600">Calculs effectués</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.reports}</div>
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
              </div>
              <Separator />
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="old_password">Ancien mot de passe</Label>
                  <Input id="old_password" type="password" ref={oldPwdRef} required autoComplete="current-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input id="new_password" type="password" ref={newPwdRef} required autoComplete="new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirm_password" type="password" ref={confirmPwdRef} required autoComplete="new-password" />
                </div>
                {pwdError && <div className="text-red-600 text-sm">{pwdError}</div>}
                {pwdSuccess && <div className="text-green-600 text-sm">{pwdSuccess}</div>}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={pwdLoading}>
                  {pwdLoading ? "Changement..." : "Changer le mot de passe"}
                </Button>
              </form>
              {/* Section 2FA supprimée */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

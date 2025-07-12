"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Radio } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const [Loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] =useState("")
  const [organization, setOrganization] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] =useState("")
  const [password, setPassword] =useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
      setLoading(true)
      
    try{
      const res = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          organization,
          email,
          role,
          password
        }),
      })
      if(!res.ok){
        const errData =await res.json()
        throw new Error(errData.detail || "Erreur de l'inscription") 
      }
      alert("Compte créer avec succès, vous pouvez maintenant vous connecter")
      window.location.href = "/login"
    }catch(error: any){
      console.error("Erreur", error)
      alert(error.message || "Une erreur s'est produite lors de l'inscription")
    }finally{
      setLoading(false)
    }
  
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TelecomDim</h1>
          <p className="text-slate-600">Créer votre compte</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>Créez votre compte pour accéder à l'outil de dimensionnement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Jean" required value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Dupont" required value={lastName}
                    onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jean.dupont@example.com" required  value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organisation</Label>
                <Input id="organization" placeholder="Université, Entreprise..." required value={organization}
                    onChange={(e) => setOrganization(e.target.value)}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select required value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre rôle" />
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
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••" required value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" required value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={Loading}>
                {Loading ? "Création du compte..." : "Créer le compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-slate-600">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Se connecter
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2024 TelecomDim</p>
          <p>DIC2_INFO/M1_GLSI/DGI/ESP/UCAD</p>
        </div>
      </div>
    </div>
  )
}

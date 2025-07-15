"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Radio } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  useEffect(() => {
    const timeout = setTimeout(() => {
      const autofilledPassword = (document.getElementById("password") as HTMLInputElement)?.value
      if (autofilledPassword && password === "") {
        setPassword(autofilledPassword)
      }
    }, 200)
    return () => clearTimeout(timeout)
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        const message =
        typeof errorData.detail === "string"
          ? errorData.detail
          : JSON.stringify(errorData.detail);
      throw new Error(message);
      } 
      const data = await res.json()
      if (!data.access_token) {
        throw new Error("Réponse invalide du serveur")
      }

      localStorage.setItem("token", data.access_token)
      toast({ title: "Succès", description: "Connexion réussie!" })
   
      //  Rediriger
      window.location.href = "/"
    }
    catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Erreur inconnue", variant: "destructive" })
    // Si c'est une erreur d'identifiants
    if (
      error.message.includes("Invalid credentials") ||
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      toast({ title: "Erreur", description: "Identifiants incorrects. Vérifiez votre email et mot de passe.", variant: "destructive" });
    } else {
      toast({ title: "Erreur", description: error.message || "Erreur inconnue", variant: "destructive" });
    }
    }
    finally{
        setIsLoading(false)
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
          <p className="text-slate-600">Connexion à votre compte</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••"  autoComplete="current-password" required value={password}  onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/login/forgot" className="text-sm text-emerald-600 hover:text-emerald-700">
                Mot de passe oublié ?
              </Link>
              <div className="text-sm text-slate-600">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  S'inscrire
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
        </div>
      </div>
    </div>
  )
}

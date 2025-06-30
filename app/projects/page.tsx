"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calculator, FileText, FolderOpen, Home, Plus, Radio, Search, Trash2, Edit, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProjectsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const projects = [
    {
      id: 1,
      name: "Projet Dakar Centre",
      date: "2024-12-28",
      type: "GSM 900",
      description: "Dimensionnement du réseau GSM pour le centre-ville de Dakar",
      status: "En cours",
    },
    {
      id: 2,
      name: "Couverture Thiès",
      date: "2024-12-27",
      type: "GSM 1800",
      description: "Extension de couverture pour la région de Thiès",
      status: "Terminé",
    },
    {
      id: 3,
      name: "Réseau Kaolack",
      date: "2024-12-25",
      type: "GSM 900/1800",
      description: "Nouveau déploiement réseau bi-bande",
      status: "En cours",
    },
    {
      id: 4,
      name: "Planification Ziguinchor",
      date: "2024-12-24",
      type: "GSM 900",
      description: "Planification réseau pour la région sud",
      status: "Brouillon",
    },
  ]

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler la création du projet et redirection vers le calculateur
    const newProjectId = Date.now()
    window.location.href = `/calculator?project=${newProjectId}`
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
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">Gestion des Projets</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Projet
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="w-4 h-4 mr-2" />
                Jean D.
              </Link>
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <Radio className="w-6 h-6 text-emerald-600" />
              <span className="font-bold">TelecomDim</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mes Projets</h1>
              <p className="text-slate-600 mt-1">Gérez vos projets de dimensionnement GSM</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Projet
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type de réseau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="gsm900">GSM 900</SelectItem>
                    <SelectItem value="gsm1800">GSM 1800</SelectItem>
                    <SelectItem value="gsm900-1800">GSM 900/1800</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Create Project Form */}
          {showCreateForm && (
            <Card className="mb-6 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Créer un Nouveau Projet
                </CardTitle>
                <CardDescription>
                  Définissez les informations de base de votre projet de dimensionnement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nom du Projet *</Label>
                      <Input id="project-name" placeholder="Ex: Réseau Dakar Centre" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="network-type">Type de Réseau *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gsm900">GSM 900 MHz</SelectItem>
                          <SelectItem value="gsm1800">GSM 1800 MHz</SelectItem>
                          <SelectItem value="gsm900-1800">GSM 900/1800 MHz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Description du projet de dimensionnement..." rows={3} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      <Calculator className="w-4 h-4 mr-2" />
                      Créer et Commencer les Calculs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.type} • {project.date}
                      </CardDescription>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "Terminé"
                          ? "bg-green-100 text-green-700"
                          : project.status === "En cours"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {project.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" asChild>
                      <Link href={`/calculator?project=${project.id}`}>
                        <Calculator className="w-4 h-4 mr-2" />
                        Ouvrir
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm ? "Aucun projet ne correspond à votre recherche." : "Vous n'avez pas encore de projet."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier projet
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

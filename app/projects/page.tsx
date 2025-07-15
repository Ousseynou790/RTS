"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calculator, FileText, FolderOpen, Home, Plus, Radio, Search, Trash2, Edit, User, RefreshCcw, Settings } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import { useAuth, apiCall } from "@/hooks/useAuth"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface Project {
  id: number
  name: string
  date: string
  network_type: string
  description: string
  status: string
  etat?: string
}
interface User {
  first_name: string
  email: string
}
// Mapping des statuts en français
const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  active: "En cours",
  completed: "Terminé",
  Terminé: "Terminé",
  "En cours": "En cours",
  archived: "Archivé",
};

// Mapping des types de réseau en français
const NETWORK_TYPE_LABELS: Record<string, string> = {
  gsm_900: "GSM 900 MHz",
  gsm_1800: "GSM 1800 MHz",
  gsm_900_1800: "GSM 900/1800 MHz",
  umts: "UMTS",
  lte: "LTE",
};

export default function ProjectsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectType, setNewProjectType] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const router = useRouter();
  const { user, loading, requireAuth } = useAuth()
  const [projectToArchive, setProjectToArchive] = useState<Project | null>(null);
  const [projectToRestore, setProjectToRestore] = useState<Project | null>(null);

  // Vérifier l'authentification
  useEffect(() => {
    if (!loading && !user) {
      requireAuth();
    }
  }, [loading, user, requireAuth]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await apiCall("http://localhost:8000/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        toast({ title: "Erreur", description: "Impossible de charger les projets", variant: "destructive" });
      }
    };
    
    loadProjects();
  }, [])


  const filteredProjects = projects.filter(
    (project) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        project.name.toLowerCase().includes(search) ||
        project.network_type.toLowerCase().includes(search) ||
        (project.description || "").toLowerCase().includes(search) ||
        (project.etat || project.status || "").toLowerCase().includes(search);
      const matchesType = selectedType === "all" || project.network_type === selectedType;
      let projectStatus = (project.etat || project.status || "").toLowerCase();
      const statusMap: Record<string, string[]> = {
        draft: ["brouillon"],
        active: ["en cours", "active"],
        completed: ["terminé", "completed"],
        archived: ["archivé", "archived"]
      };
      // Par défaut, on exclut les archivés sauf si le filtre est explicitement sur 'archived'
      if (selectedStatus === "all" && statusMap["archived"].includes(projectStatus)) {
        return false;
      }
      const matchesStatus = selectedStatus === "all" ||
        (statusMap[selectedStatus] && statusMap[selectedStatus].some((val: string) => projectStatus === val));
      return matchesSearch && matchesType && matchesStatus;
    }
  )

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const name = formData.get("project-name") as string
    const description = formData.get("description") as string
    const type = newProjectType

    if (!type) {
      alert("Veuillez sélectionner le type de réseau")
      return
    }

    try {
      const response = await apiCall("http://localhost:8000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          network_type: type,
        }),
      });

      const newProject = await response.json();
      setProjects((prev) => [...prev, newProject]);

      setShowCreateForm(false);
      toast({ title: "Succès", description: "Projet créé avec succès !" });
      // Redirection vers le calculateur avec l'ID réel
      window.location.href = `/calculator?project=${newProject.id}`;
    } catch (err) {
      toast({ title: "Erreur", description: "Erreur lors de la création du projet", variant: "destructive" });
    }
  }


  

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        showHome={true}
        showProjects={false}
        title="Gestion des Projets"
        subtitle="Mes Projets"
      />

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
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type de réseau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="gsm_900">GSM 900 MHz</SelectItem>
                    <SelectItem value="gsm_1800">GSM 1800 MHz</SelectItem>
                    <SelectItem value="gsm_900_1800">GSM 900/1800 MHz</SelectItem>
                    <SelectItem value="umts">UMTS</SelectItem>
                    <SelectItem value="lte">LTE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
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
                      <Input id="project-name" name="project-name" placeholder="Ex: Réseau Dakar Centre" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="network-type">Type de Réseau *</Label>
                      <Select value={newProjectType} onValueChange={setNewProjectType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gsm_900">GSM 900 MHz</SelectItem>
                          <SelectItem value="gsm_1800">GSM 1800 MHz</SelectItem>
                          <SelectItem value="gsm_900_1800">GSM 900/1800 MHz</SelectItem>
                          <SelectItem value="umts">UMTS</SelectItem>
                          <SelectItem value="lte">LTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name = "description" placeholder="Description du projet de dimensionnement..." rows={3} />
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
                        {NETWORK_TYPE_LABELS[project.network_type] ?? project.network_type} • {project.date}
                      </CardDescription>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold border${
                        (project.etat === "Terminé" || project.status === "completed")
                          ? "border-green-500 text-green-600"
                          : (project.etat === "En cours" || project.status === "active")
                            ? "border-blue-500 text-blue-600"
                            : "border-gray-400 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[project.etat || project.status]}
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
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/calculator?project=${project.id}&tab=parameters`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/calculator?project=${project.id}&tab=reports`}>
                        <FileText className="w-4 h-4" />
                      </Link>
                    </Button>
                    {((project.etat || project.status)?.toLowerCase() === "archivé" || (project.etat || project.status)?.toLowerCase() === "archived") ? (
                      <AlertDialog open={!!projectToRestore && projectToRestore.id === project.id} onOpenChange={(open) => { if (!open) setProjectToRestore(null); }}>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 bg-transparent flex items-center justify-center p-0 w-9 h-9 rounded-full border-2 border-blue-200 bg-blue-50 shadow-sm" onClick={() => setProjectToRestore(project)}>
                            <span className="relative block w-7 h-7">
                              <Settings className="absolute inset-0 w-7 h-7 text-blue-200" strokeWidth={2.5} />
                              <RefreshCcw className="absolute inset-0 w-7 h-7 text-blue-800" strokeWidth={3} />
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restaurer ce projet ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Voulez-vous vraiment restaurer ce projet ? Il repassera en statut "En cours".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={async () => {
                              if (!projectToRestore) return;
                              try {
                                const res = await fetch(`http://localhost:8000/api/projects/${projectToRestore.id}`, {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                  body: JSON.stringify({
                                    name: projectToRestore.name,
                                    description: projectToRestore.description,
                                    network_type: projectToRestore.network_type,
                                    etat: "En cours"
                                  })
                                });
                                if (!res.ok) throw new Error("Erreur lors de la restauration du projet");
                                toast({ title: "Succès", description: "Projet restauré avec succès ✅" });
                                // Optionnel : recharger la liste si besoin
                              } catch (err) {
                                toast({ title: "Erreur", description: "Erreur lors de la restauration du projet", variant: "destructive" });
                              } finally {
                                setProjectToRestore(null);
                              }
                            }}>
                              Restaurer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog open={!!projectToArchive && projectToArchive.id === project.id} onOpenChange={(open) => { if (!open) setProjectToArchive(null); }}>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent" onClick={() => setProjectToArchive(project)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archiver ce projet ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Voulez-vous vraiment archiver ce projet ? Cette action est réversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={async () => {
                              if (!projectToArchive) return;
                              try {
                                const res = await fetch(`http://localhost:8000/api/projects/${projectToArchive.id}`, {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                  body: JSON.stringify({
                                    name: projectToArchive.name,
                                    description: projectToArchive.description,
                                    network_type: projectToArchive.network_type,
                                    etat: "Archivé"
                                  })
                                });
                                if (!res.ok) throw new Error("Erreur lors de l'archivage du projet");
                                setProjects((prev) => prev.filter((p) => p.id !== projectToArchive.id));
                                toast({ title: "Succès", description: "Projet archivé avec succès ✅" });
                              } catch (err) {
                                toast({ title: "Erreur", description: "Erreur lors de l'archivage du projet", variant: "destructive" });
                              } finally {
                                setProjectToArchive(null);
                              }
                            }}>
                              Archiver
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Radio, Home, FolderOpen, User, LogIn, UserPlus, HelpCircle } from "lucide-react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

interface User {
  first_name: string;
  email: string;
}

interface NavbarProps {
  showHome?: boolean;
  showProjects?: boolean;
  showProfile?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Navbar({ 
  showHome = true, 
  showProjects = false, 
  showProfile = true, 
  title = "TelecomDim",
  subtitle = "Outil de dimensionnement GSM"
}: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Impossible de récupérer le profil");
        const data = await res.json();
        setUser(data);
      })
      .catch((err) => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showHome && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
          )}
          
          {showProjects && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <FolderOpen className="w-4 h-4 mr-2" />
                Mes Projets
              </Link>
            </Button>
          )}

          {(showHome || showProjects) && <Separator orientation="vertical" className="h-6" />}
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            // Menu utilisateur connecté
            <>
              <NotificationBell />
              {showProfile && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    {user.first_name}
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
          <Link href="/help" className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 text-blue-700 font-medium transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Aide</span>
          </Link>
        </div>
      </div>
    </header>
  );
} 
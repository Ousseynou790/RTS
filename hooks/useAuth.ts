import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  bio: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token invalide ou expiré
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Erreur de vérification d'authentification:", error);
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const requireAuth = () => {
    if (!loading && !user) {
      toast({ 
        title: "Session expirée", 
        description: "Votre session a expiré. Veuillez vous reconnecter.", 
        variant: "destructive" 
      });
      router.push("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    checkAuth,
    logout,
    requireAuth,
  };
}

// Fonction utilitaire pour gérer les erreurs d'API avec redirection automatique
export async function apiCall(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Token invalide ou expiré
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response;
} 
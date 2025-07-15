"use client";

import { useEffect, useState } from "react";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { Toaster } from "@/components/ui/toaster";

export default function NotificationsProvider() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserId(data.id);
      })
      .catch(() => setUserId(null));
  }, []);

  useNotificationsSocket(userId || 0);

  return <Toaster />;
} 
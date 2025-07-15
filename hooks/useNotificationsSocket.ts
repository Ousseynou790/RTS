import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export function useNotificationsSocket(userId: number | string) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const ws = new window.WebSocket(`ws://localhost:8000/ws/notifications/${userId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);
        toast({
          title: notif.title || "Notification",
          description: notif.message,
          variant: notif.type === "error" ? "destructive" : "default",
        });
      } catch (e) {
        // ignore
      }
    };

    ws.onclose = () => {
      // Optionnel : reconnexion auto
    };

    return () => {
      ws.close();
    };
  }, [userId]);
} 
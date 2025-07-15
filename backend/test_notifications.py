#!/usr/bin/env python3
"""
Script de test pour créer des notifications de démonstration
Usage: python test_notifications.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from utils.notifications import (
    notify_welcome,
    notify_project_created,
    notify_calculation_complete,
    notify_report_ready,
    notify_system_update,
    notify_error
)

def create_demo_notifications():
    """Crée des notifications de démonstration pour l'utilisateur ID 1"""
    db = SessionLocal()
    
    try:
        user_id = 1  # Assurez-vous que cet utilisateur existe
        
        print("Création de notifications de démonstration...")
        
        # Notification de bienvenue
        notify_welcome(db, user_id, "Utilisateur Test")
        print("✅ Notification de bienvenue créée")
        
        # Notification de projet créé
        notify_project_created(db, user_id, "Projet GSM Dakar")
        print("✅ Notification de projet créé")
        
        # Notification de calcul terminé
        notify_calculation_complete(db, user_id, "Projet GSM Dakar", 1)
        print("✅ Notification de calcul terminé")
        
        # Notification de rapport prêt
        notify_report_ready(db, user_id, "Rapport Dimensionnement Dakar", 245)
        print("✅ Notification de rapport prêt")
        
        # Notification système
        notify_system_update(db, user_id, "Mise à jour disponible", "Une nouvelle version de TelecomDim est disponible avec des améliorations de performance.")
        print("✅ Notification système créée")
        
        # Notification d'erreur (pour tester)
        notify_error(db, user_id, "Erreur de connexion temporaire")
        print("✅ Notification d'erreur créée")
        
        print("\n🎉 Toutes les notifications de démonstration ont été créées !")
        print("Connectez-vous à l'application pour voir les notifications dans la cloche.")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des notifications: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_notifications() 
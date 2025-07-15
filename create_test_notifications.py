#!/usr/bin/env python3
"""
Script simple pour créer des notifications de test
"""

import requests
import json

def create_test_notifications():
    """Crée des notifications de test via l'API"""
    
    # URL de base
    base_url = "http://localhost:8000/api"
    
    # Token d'authentification (remplacez par un token valide)
    # Vous devez d'abord vous connecter pour obtenir un token
    token = "votre_token_ici"  # Remplacez par un vrai token
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Notifications de test
    test_notifications = [
        {
            "user_id": 1,
            "type": "system_update",
            "title": "Bienvenue sur TelecomDim !",
            "message": "Bonjour ! Bienvenue sur TelecomDim. Commencez par créer votre premier projet de dimensionnement GSM.",
            "priority": "normal"
        },
        {
            "user_id": 1,
            "type": "calculation_complete",
            "title": "Calcul terminé",
            "message": "Le calcul pour le projet 'GSM Dakar' est terminé. Consultez les résultats.",
            "priority": "normal"
        },
        {
            "user_id": 1,
            "type": "report_ready",
            "title": "Rapport PDF prêt",
            "message": "Votre rapport 'Dimensionnement Dakar' (245 KB) est prêt au téléchargement.",
            "priority": "normal"
        },
        {
            "user_id": 1,
            "type": "system_update",
            "title": "Mise à jour disponible",
            "message": "Une nouvelle version de TelecomDim est disponible avec des améliorations de performance.",
            "priority": "low"
        }
    ]
    
    print("Création de notifications de test...")
    
    for i, notification in enumerate(test_notifications, 1):
        try:
            response = requests.post(
                f"{base_url}/notifications",
                headers=headers,
                json=notification
            )
            
            if response.status_code == 201:
                print(f"✅ Notification {i} créée avec succès")
            else:
                print(f"❌ Erreur pour la notification {i}: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Erreur de connexion pour la notification {i}: {e}")
    
    print("\n🎉 Test terminé !")
    print("Connectez-vous à l'application pour voir les notifications dans la cloche.")

if __name__ == "__main__":
    print("⚠️  IMPORTANT: Vous devez d'abord vous connecter à l'application")
    print("et remplacer 'votre_token_ici' par un vrai token d'authentification.")
    print("Ou utilisez l'application pour créer des projets/calculs et voir les notifications automatiques.")
    
    # Décommentez la ligne suivante après avoir mis un vrai token
    # create_test_notifications() 
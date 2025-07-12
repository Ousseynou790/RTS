"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  FileText,
  FolderOpen,
  Home,
  Radio,
  Save,
  Plus,
  Settings,
  BarChart3,
  Download,
  TrendingUp,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Project {
  id: number
  name: string
  date: string
  network_type: string
  description: string
  status: string
  created_at: string
}
interface User {
  first_name: string
  email: string
}
export default function CalculatorPage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectId, setProjectId] = useState<string>("")
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<{
    name: string;
    network_type: string;
  } | null>(null)
 
  const [newResults, setNewResults] = useState({
    cellRadius: 2.5,
    coveredArea: 19.6,
    numberOfSites: 12,
    totalTraffic: 625,
    trxPerSite: 8,
    totalChannels: 96,
    spectralEfficiency: 0.65,
    siteEfficiency: 78,
    coverageReliability: 95,
  })
  const [parameters, setParameters] = useState({
    // Zone parameters
    surface: 100,
    population: 50000,
    zoneType: "urban_dense",
    penetrationRate: 85,
    bhcaPerSubscriber: 1.5,

    // Coverage parameters
    frequency: 900,
    txPower: 43,
    antennaGain: 18,
    sensitivity: -104,
    fadeMargin: 10,
    interferenceMargin: 3,

    // Traffic parameters
    subscribers: 10000,
    callDuration: 2.5,
  })

  const [results, setResults] = useState({
    cellRadius: 2.5,
    coveredArea: 19.6,
    numberOfSites: 12,
    totalTraffic: 625,
    trxPerSite: 8,
    totalChannels: 96,
    spectralEfficiency: 0.65,
    siteEfficiency: 78,
    coverageReliability: 95,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("project")
    if (id) {
    setProjectId(id) 
      fetch(`http://localhost:8000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Erreur lors du chargement du projet")
          const data = await res.json()
          console.log("Projet récupéré:", data)
          setSelectedProjectDetails({
            name: data.name,
            network_type: data.network_type,
          })
        })
        .catch((err) => {
          console.error(err)
          alert("Impossible de charger le projet")
        })
      }
  }, [])

   
  
   useEffect(() => {
      fetch("http://localhost:8000/api/recentprojects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Erreur lors du chargement des projets")
          const data = await res.json()
          setRecentProjects(data)
        })
        .catch((err) => {
          console.error(err)
          alert("Impossible de charger les projets")
        })
    }, [])

       useEffect(() => {
          // Simuler une récupération de l'utilisateur connecté
          const token= localStorage.getItem("token")
          if(!token){
            setLoading(false)
            return 
          }
      
          fetch("http://localhost:8000/api/users/me",{
            headers:{
              Authorization : `Bearer ${token}`,
            }
          }) 
          .then(async(res)=>{
            if(!res.ok) throw new Error("Impossible de récupérer le profil")
             const data = await res.json()
             setUser(data)
          })
          .catch((err) =>{
              console.error(err)
              localStorage.removeItem("token") // On enléve le token invalide
          })
          .finally(() =>setLoading(false))
        }, [])
const calculateDimensioning  = async  () => {
      if (!projectId) {
        alert("Projet non sélectionné.")
        return
      }

      const newResults = {
        cellRadius: Math.round(Math.sqrt(parameters.surface / Math.PI) * 0.8 * 10) / 10,
        coveredArea: parameters.surface,
        numberOfSites: Math.ceil(parameters.surface / 8.3),
        totalTraffic: Math.round((parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / 60),
        trxPerSite: Math.ceil(
          (parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / (60 * 12)
        ),
        totalChannels:
          Math.ceil((parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / (60 * 12)) *
          Math.ceil(parameters.surface / 8.3),
        spectralEfficiency: 0.65,
        siteEfficiency: Math.round(75 + Math.random() * 10),
        coverageReliability: Math.round(92 + Math.random() * 6),
      }

      setResults(newResults)
      try {
          console.log("Project ID:", parseInt(projectId));
          // Appeler l'API avec les nouveaux résultats
          const res = await fetch("http://localhost:8000/api/calculations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              project_id: parseInt(projectId),
              name: "Calcul automatique",
              surface_area: parameters.surface,
              population: parameters.population,
              zone_type: parameters.zoneType,
              penetration_rate: parameters.penetrationRate,
              bhca_per_subscriber: parameters.bhcaPerSubscriber,
              frequency: parameters.frequency,
              tx_power: parameters.txPower,
              antenna_gain: parameters.antennaGain,
              sensitivity: parameters.sensitivity,
              fade_margin: 10,
              interference_margin: 3,
              subscribers: parameters.subscribers,
              call_duration: parameters.callDuration,
              // 👇 Utiliser les résultats calculés
              cell_radius: newResults.cellRadius,
              covered_area: newResults.coveredArea,
              number_of_sites: newResults.numberOfSites,
              total_traffic: newResults.totalTraffic,
              trx_per_site: newResults.trxPerSite,
              total_channels: newResults.totalChannels,
              spectral_efficiency: newResults.spectralEfficiency,
              site_efficiency: newResults.siteEfficiency,
              coverage_reliability: newResults.coverageReliability,
            }),
          });

          if (!res.ok) throw new Error("Erreur lors de l'enregistrement du calcul");

          const data = await res.json()
          console.log("Calcul enregistré :", data);
          alert("Calcul de dimensionnement enregistré avec succès ✅");
        } catch (err) {
          console.error(err);
          alert("Erreur lors de l'enregistrement du calcul");
        }
      

}
  

  const generatePDFReport = () => {
    const projectName = "Projet Dakar Centre"
    const date = new Date().toLocaleDateString("fr-FR")

    // Créer le contenu HTML pour le PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Rapport de Dimensionnement GSM</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .title { font-size: 28px; font-weight: bold; margin: 10px 0; }
            .subtitle { color: #666; font-size: 16px; }
            .section { margin: 25px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
            .param-group { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .param-item { display: flex; justify-content: space-between; margin: 8px 0; }
            .param-label { font-weight: 500; }
            .param-value { color: #059669; font-weight: bold; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0; }
            .stat-value { font-size: 24px; font-weight: bold; color: #059669; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            .recommendations { background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📡 TelecomDim</div>
            <div class="title">RAPPORT DE DIMENSIONNEMENT GSM</div>
            <div class="subtitle">${projectName} - ${date}</div>
        </div>

        <div class="section">
            <div class="section-title">📋 Informations du Projet</div>
            <div class="grid">
                <div class="param-group">
                    <h4>Détails du Projet</h4>
                    <div class="param-item">
                        <span class="param-label">Nom du Projet:</span>
                        <span class="param-value">${projectName}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Type de Réseau:</span>
                        <span class="param-value">GSM ${parameters.frequency} MHz</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Date de Génération:</span>
                        <span class="param-value">${date}</span>
                    </div>
                </div>
                <div class="param-group">
                    <h4>Zone de Couverture</h4>
                    <div class="param-item">
                        <span class="param-label">Surface:</span>
                        <span class="param-value">${parameters.surface} km²</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Population:</span>
                        <span class="param-value">${parameters.population.toLocaleString()}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Type de Zone:</span>
                        <span class="param-value">Urbaine Dense</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">⚙️ Paramètres Techniques</div>
            <div class="grid">
                <div class="param-group">
                    <h4>Paramètres Radio</h4>
                    <div class="param-item">
                        <span class="param-label">Fréquence:</span>
                        <span class="param-value">${parameters.frequency} MHz</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Puissance TX:</span>
                        <span class="param-value">${parameters.txPower} dBm</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Gain Antenne:</span>
                        <span class="param-value">${parameters.antennaGain} dBi</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Sensibilité RX:</span>
                        <span class="param-value">${parameters.sensitivity} dBm</span>
                    </div>
                </div>
                <div class="param-group">
                    <h4>Paramètres de Trafic</h4>
                    <div class="param-item">
                        <span class="param-label">Nombre d'Abonnés:</span>
                        <span class="param-value">${parameters.subscribers.toLocaleString()}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">BHCA par Abonné:</span>
                        <span class="param-value">${parameters.bhcaPerSubscriber}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Durée Moyenne:</span>
                        <span class="param-value">${parameters.callDuration} min</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Taux de Pénétration:</span>
                        <span class="param-value">${parameters.penetrationRate}%</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📊 Résultats de Dimensionnement</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${results.cellRadius} km</div>
                    <div class="stat-label">Rayon de Cellule</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.numberOfSites}</div>
                    <div class="stat-label">Nombre de Sites</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.totalTraffic}</div>
                    <div class="stat-label">Trafic Total (Erlangs)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.trxPerSite}</div>
                    <div class="stat-label">TRX par Site</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.totalChannels}</div>
                    <div class="stat-label">Canaux Totaux</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.coverageReliability}%</div>
                    <div class="stat-label">Fiabilité de Couverture</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📈 Statistiques Détaillées</div>
            <table>
                <tr>
                    <th>Métrique</th>
                    <th>Valeur</th>
                    <th>Unité</th>
                    <th>Statut</th>
                </tr>
                <tr>
                    <td>Efficacité Spectrale</td>
                    <td>${results.spectralEfficiency}</td>
                    <td>bps/Hz</td>
                    <td>✅ Optimal</td>
                </tr>
                <tr>
                    <td>Efficacité des Sites</td>
                    <td>${results.siteEfficiency}</td>
                    <td>%</td>
                    <td>✅ Bon</td>
                </tr>
                <tr>
                    <td>Densité de Population</td>
                    <td>${(parameters.population / parameters.surface).toFixed(0)}</td>
                    <td>hab/km²</td>
                    <td>ℹ️ Urbain Dense</td>
                </tr>
                <tr>
                    <td>Abonnés par Site</td>
                    <td>${Math.round(parameters.subscribers / results.numberOfSites)}</td>
                    <td>abonnés</td>
                    <td>✅ Équilibré</td>
                </tr>
                <tr>
                    <td>Surface par Site</td>
                    <td>${(parameters.surface / results.numberOfSites).toFixed(1)}</td>
                    <td>km²</td>
                    <td>✅ Optimal</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">💡 Recommandations</div>
            <div class="recommendations">
                <h4>Recommandations Techniques:</h4>
                <ul>
                    <li><strong>Déploiement:</strong> Installer ${results.numberOfSites} sites BTS pour assurer une couverture complète de la zone</li>
                    <li><strong>Configuration:</strong> Configurer ${results.trxPerSite} TRX par site pour gérer le trafic prévu</li>
                    <li><strong>Capacité:</strong> Prévoir une marge de capacité de 20% pour la croissance future du trafic</li>
                    <li><strong>Qualité:</strong> Maintenir un niveau de service avec une fiabilité de ${results.coverageReliability}%</li>
                    <li><strong>Optimisation:</strong> Surveiller l'efficacité spectrale pour optimiser l'utilisation du spectre</li>
                </ul>
                
                <h4>Considérations Opérationnelles:</h4>
                <ul>
                    <li>Planifier la maintenance préventive des équipements</li>
                    <li>Mettre en place un système de monitoring en temps réel</li>
                    <li>Prévoir l'évolution vers les technologies 3G/4G</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📋 Conclusion</div>
            <p>Le dimensionnement proposé pour le <strong>${projectName}</strong> permet de couvrir efficacement une zone de ${parameters.surface} km² avec une population de ${parameters.population.toLocaleString()} habitants. Avec ${results.numberOfSites} sites BTS déployés, le réseau pourra servir ${parameters.subscribers.toLocaleString()} abonnés avec une qualité de service optimale.</p>
            
            <p>L'efficacité spectrale de ${results.spectralEfficiency} bps/Hz et l'efficacité des sites de ${results.siteEfficiency}% démontrent une utilisation optimale des ressources. La fiabilité de couverture de ${results.coverageReliability}% garantit une expérience utilisateur satisfaisante.</p>
        </div>

        <div class="footer">
            <p><strong>TelecomDim</strong> - Outil de dimensionnement des systèmes de télécommunications</p>
            <p>DIC2_INFO/M1_GLSI/DGI/ESP/UCAD - Dr FALL</p>
            <p>Rapport généré le ${new Date().toLocaleString("fr-FR")}</p>
        </div>
    </body>
    </html>
    `

    // Créer et télécharger le PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
    }
  }

  const downloadStatisticsReport = () => {
    const projectName = "Projet Dakar Centre"
    const date = new Date().toLocaleDateString("fr-FR")

    // Calculs statistiques avancés
    const populationDensity = parameters.population / parameters.surface
    const subscribersPerSite = Math.round(parameters.subscribers / results.numberOfSites)
    const areaPerSite = parameters.surface / results.numberOfSites
    const trafficPerSubscriber = (results.totalTraffic / parameters.subscribers).toFixed(3)
    const channelsPerSubscriber = (results.totalChannels / parameters.subscribers).toFixed(3)
    const costPerSubscriber = ((results.numberOfSites * 50000) / parameters.subscribers).toFixed(0) // Estimation coût
    const roi = (((parameters.subscribers * 25 * 12) / (results.numberOfSites * 50000)) * 100).toFixed(1) // ROI estimé

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Rapport Statistiques - Dimensionnement GSM</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { color: #3b82f6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .title { font-size: 28px; font-weight: bold; margin: 10px 0; }
            .subtitle { color: #666; font-size: 16px; }
            .section { margin: 25px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #bae6fd; }
            .stat-value { font-size: 20px; font-weight: bold; color: #3b82f6; }
            .stat-label { font-size: 11px; color: #666; margin-top: 5px; }
            .chart-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f1f5f9; font-weight: bold; color: #3b82f6; }
            .performance-indicator { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
            .excellent { background: #dcfce7; color: #166534; }
            .good { background: #dbeafe; color: #1d4ed8; }
            .average { background: #fef3c7; color: #92400e; }
            .poor { background: #fee2e2; color: #dc2626; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
            .kpi-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .kpi-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📊 TelecomDim Analytics</div>
            <div class="title">RAPPORT STATISTIQUES DÉTAILLÉ</div>
            <div class="subtitle">${projectName} - Analyse Quantitative - ${date}</div>
        </div>

        <div class="section">
            <div class="section-title">📈 Indicateurs Clés de Performance (KPI)</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${populationDensity.toFixed(0)}</div>
                    <div class="stat-label">Habitants/km²</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${subscribersPerSite}</div>
                    <div class="stat-label">Abonnés/Site</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${areaPerSite.toFixed(1)}</div>
                    <div class="stat-label">km²/Site</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${trafficPerSubscriber}</div>
                    <div class="stat-label">Erlangs/Abonné</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${channelsPerSubscriber}</div>
                    <div class="stat-label">Canaux/Abonné</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${costPerSubscriber}</div>
                    <div class="stat-label">€/Abonné (CAPEX)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${roi}%</div>
                    <div class="stat-label">ROI Annuel</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${((parameters.penetrationRate * parameters.population) / 100).toLocaleString()}</div>
                    <div class="stat-label">Abonnés Potentiels</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🎯 Analyse de Performance</div>
            <table>
                <tr>
                    <th>Métrique</th>
                    <th>Valeur Actuelle</th>
                    <th>Benchmark Industrie</th>
                    <th>Performance</th>
                    <th>Tendance</th>
                </tr>
                <tr>
                    <td>Efficacité Spectrale</td>
                    <td>${results.spectralEfficiency} bps/Hz</td>
                    <td>0.5-0.8 bps/Hz</td>
                    <td><span class="performance-indicator good">Bon</span></td>
                    <td>📈 Stable</td>
                </tr>
                <tr>
                    <td>Taux d'Utilisation Sites</td>
                    <td>${results.siteEfficiency}%</td>
                    <td>70-85%</td>
                    <td><span class="performance-indicator good">Bon</span></td>
                    <td>📈 Croissant</td>
                </tr>
                <tr>
                    <td>Couverture Population</td>
                    <td>${results.coverageReliability}%</td>
                    <td>≥95%</td>
                    <td><span class="performance-indicator excellent">Excellent</span></td>
                    <td>📈 Optimal</td>
                </tr>
                <tr>
                    <td>Densité de Sites</td>
                    <td>${(results.numberOfSites / parameters.surface).toFixed(2)} sites/km²</td>
                    <td>0.1-0.3 sites/km²</td>
                    <td><span class="performance-indicator average">Moyen</span></td>
                    <td>📊 À surveiller</td>
                </tr>
                <tr>
                    <td>Charge Trafic/TRX</td>
                    <td>${(results.totalTraffic / results.totalChannels).toFixed(2)} Erl/TRX</td>
                    <td>6-8 Erl/TRX</td>
                    <td><span class="performance-indicator good">Bon</span></td>
                    <td>📈 Équilibré</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">💰 Analyse Économique</div>
            <div class="kpi-section">
                <div class="kpi-card">
                    <h4>Investissement Initial (CAPEX)</h4>
                    <table>
                        <tr><td>Sites BTS (${results.numberOfSites} × 50k€)</td><td>${(results.numberOfSites * 50).toLocaleString()}k€</td></tr>
                        <tr><td>Équipements TRX (${results.totalChannels} × 2k€)</td><td>${(results.totalChannels * 2).toLocaleString()}k€</td></tr>
                        <tr><td>Installation et Déploiement</td><td>${(results.numberOfSites * 10).toLocaleString()}k€</td></tr>
                        <tr><td><strong>Total CAPEX</strong></td><td><strong>${(results.numberOfSites * 60 + results.totalChannels * 2).toLocaleString()}k€</strong></td></tr>
                    </table>
                </div>
                <div class="kpi-card">
                    <h4>Revenus Prévisionnels (ARPU)</h4>
                    <table>
                        <tr><td>ARPU Mensuel Moyen</td><td>25€</td></tr>
                        <tr><td>Revenus Mensuels</td><td>${((parameters.subscribers * 25) / 1000).toFixed(0)}k€</td></tr>
                        <tr><td>Revenus Annuels</td><td>${((parameters.subscribers * 25 * 12) / 1000).toFixed(0)}k€</td></tr>
                        <tr><td><strong>ROI (Retour sur Investissement)</strong></td><td><strong>${roi}%</strong></td></tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📊 Répartition et Distribution</div>
            <div class="chart-section">
                <h4>Distribution du Trafic par Heure de Pointe</h4>
                <table>
                    <tr>
                        <th>Tranche Horaire</th>
                        <th>% du Trafic Total</th>
                        <th>Trafic (Erlangs)</th>
                        <th>Canaux Requis</th>
                    </tr>
                    <tr>
                        <td>08h-10h (Matin)</td>
                        <td>25%</td>
                        <td>${Math.round(results.totalTraffic * 0.25)}</td>
                        <td>${Math.round(results.totalChannels * 0.25)}</td>
                    </tr>
                    <tr>
                        <td>12h-14h (Midi)</td>
                        <td>20%</td>
                        <td>${Math.round(results.totalTraffic * 0.2)}</td>
                        <td>${Math.round(results.totalChannels * 0.2)}</td>
                    </tr>
                    <tr>
                        <td>18h-21h (Soir)</td>
                        <td>35%</td>
                        <td>${Math.round(results.totalTraffic * 0.35)}</td>
                        <td>${Math.round(results.totalChannels * 0.35)}</td>
                    </tr>
                    <tr>
                        <td>Autres heures</td>
                        <td>20%</td>
                        <td>${Math.round(results.totalTraffic * 0.2)}</td>
                        <td>${Math.round(results.totalChannels * 0.2)}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🔮 Projections et Évolution</div>
            <table>
                <tr>
                    <th>Horizon</th>
                    <th>Croissance Abonnés</th>
                    <th>Abonnés Totaux</th>
                    <th>Sites Additionnels</th>
                    <th>Investissement</th>
                </tr>
                <tr>
                    <td>Année 1</td>
                    <td>+15%</td>
                    <td>${Math.round(parameters.subscribers * 1.15).toLocaleString()}</td>
                    <td>+2</td>
                    <td>120k€</td>
                </tr>
                <tr>
                    <td>Année 2</td>
                    <td>+30%</td>
                    <td>${Math.round(parameters.subscribers * 1.3).toLocaleString()}</td>
                    <td>+4</td>
                    <td>240k€</td>
                </tr>
                <tr>
                    <td>Année 3</td>
                    <td>+50%</td>
                    <td>${Math.round(parameters.subscribers * 1.5).toLocaleString()}</td>
                    <td>+6</td>
                    <td>360k€</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">⚠️ Risques et Recommandations</div>
            <div class="kpi-section">
                <div class="kpi-card">
                    <h4>Risques Identifiés</h4>
                    <ul>
                        <li><strong>Saturation:</strong> Risque de saturation en heure de pointe (35% du trafic)</li>
                        <li><strong>Croissance:</strong> Croissance rapide des abonnés (+15% an 1)</li>
                        <li><strong>Concurrence:</strong> Pression concurrentielle sur les tarifs</li>
                        <li><strong>Technologie:</strong> Évolution vers 3G/4G dans 2-3 ans</li>
                    </ul>
                </div>
                <div class="kpi-card">
                    <h4>Actions Recommandées</h4>
                    <ul>
                        <li><strong>Court terme:</strong> Monitoring temps réel du trafic</li>
                        <li><strong>Moyen terme:</strong> Prévoir 2 sites additionnels en année 1</li>
                        <li><strong>Long terme:</strong> Planifier migration vers 3G/4G</li>
                        <li><strong>Optimisation:</strong> Algorithmes de répartition de charge</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>TelecomDim Analytics</strong> - Rapport statistiques avancé</p>
            <p>DIC2_INFO/M1_GLSI/DGI/ESP/UCAD - Dr FALL</p>
            <p>Rapport généré le ${new Date().toLocaleString("fr-FR")}</p>
        </div>
    </body>
    </html>
    `

    // Créer et télécharger le PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
    }
  }

  // const calculateDimensioning = () => {
  //   if (!projectId) {
  //     alert("Projet non sélectionné.")
  //     return
  //   }

  //   const newResults = {
  //     cellRadius: Math.round(Math.sqrt(parameters.surface / Math.PI) * 0.8 * 10) / 10,
  //     coveredArea: parameters.surface,
  //     numberOfSites: Math.ceil(parameters.surface / 8.3),
  //     totalTraffic: Math.round((parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / 60),
  //     trxPerSite: Math.ceil(
  //       (parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / (60 * 12)
  //     ),
  //     totalChannels:
  //       Math.ceil((parameters.subscribers * parameters.bhcaPerSubscriber * parameters.callDuration) / (60 * 12)) *
  //       Math.ceil(parameters.surface / 8.3),
  //     spectralEfficiency: 0.65,
  //     siteEfficiency: Math.round(75 + Math.random() * 10),
  //     coverageReliability: Math.round(92 + Math.random() * 6),
  //   }

  //   setResults(newResults)
  // }
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <FolderOpen className="w-4 h-4 mr-2" />
                Mes Projets
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-semibold">{selectedProjectDetails? selectedProjectDetails.name : null}</span>
                <span className="text-sm text-slate-500 ml-2">{selectedProjectDetails? selectedProjectDetails.network_type : null}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" size="sm" onClick={generatePDFReport}>
              <Download className="w-4 h-4 mr-2" />
              Rapport PDF
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <User className="w-4 h-4 mr-2" />
                {user? user.first_name : "Mon Compte"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Projets Récents
              </h3>
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      selectedProject === project.id.toString() ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
                    }`}
                    onClick={() => (window.location.href = `/calculator?project=${project.id}`)}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium text-sm text-slate-900">{project.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{project.network_type}</div>
                       <div className="text-xs text-slate-400 mt-1">
                        {new Date(project.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/projects">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Projet
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="parameters" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Résultats
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Rapports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="parameters" className="space-y-6">
                {/* Zone Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Paramètres de Zone
                    </CardTitle>
                    <CardDescription>Définissez les caractéristiques de la zone à couvrir</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="surface">Surface (km²)</Label>
                        <Input
                          id="surface"
                          type="number"
                          value={parameters.surface}
                          onChange={(e) => setParameters({ ...parameters, surface: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="population">Population</Label>
                        <Input
                          id="population"
                          type="number"
                          value={parameters.population}
                          onChange={(e) => setParameters({ ...parameters, population: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zone-type">Type de Zone</Label>
                      <Select
                        value={parameters.zoneType}
                        onValueChange={(value) => setParameters({ ...parameters, zoneType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urban_dense">Urbaine Dense</SelectItem>
                          <SelectItem value="urban">Urbaine</SelectItem>
                          <SelectItem value="suburban">Suburbaine</SelectItem>
                          <SelectItem value="rural">Rurale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="penetration">Taux de Pénétration (%)</Label>
                        <Input
                          id="penetration"
                          type="number"
                          value={parameters.penetrationRate}
                          onChange={(e) => setParameters({ ...parameters, penetrationRate: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bhca">BHCA par abonné</Label>
                        <Input
                          id="bhca"
                          type="number"
                          step="0.1"
                          value={parameters.bhcaPerSubscriber}
                          onChange={(e) => setParameters({ ...parameters, bhcaPerSubscriber: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres Techniques</CardTitle>
                    <CardDescription>Configuration des paramètres radio et de trafic</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Paramètres Radio</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Fréquence (MHz)</Label>
                          <Input
                            id="frequency"
                            type="number"
                            value={parameters.frequency}
                            onChange={(e) => setParameters({ ...parameters, frequency: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tx-power">Puissance TX (dBm)</Label>
                          <Input
                            id="tx-power"
                            type="number"
                            value={parameters.txPower}
                            onChange={(e) => setParameters({ ...parameters, txPower: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="antenna-gain">Gain Antenne (dBi)</Label>
                          <Input
                            id="antenna-gain"
                            type="number"
                            value={parameters.antennaGain}
                            onChange={(e) => setParameters({ ...parameters, antennaGain: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={calculateDimensioning}>
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculer le Dimensionnement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Résultats et Statistiques
                    </CardTitle>
                    <CardDescription>Analyse détaillée des résultats de dimensionnement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600">{results.numberOfSites}</div>
                        <div className="text-sm text-slate-600">Sites BTS</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{results.totalTraffic}</div>
                        <div className="text-sm text-slate-600">Erlangs</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{results.coverageReliability}%</div>
                        <div className="text-sm text-slate-600">Fiabilité</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Couverture</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Rayon de Cellule:</span>
                            <span className="font-medium">{results.cellRadius} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Surface Couverte:</span>
                            <span className="font-medium">{results.coveredArea} km²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Efficacité Spectrale:</span>
                            <span className="font-medium">{results.spectralEfficiency} bps/Hz</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Capacité</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">TRX par Site:</span>
                            <span className="font-medium">{results.trxPerSite} TRX</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Canaux Totaux:</span>
                            <span className="font-medium">{results.totalChannels} canaux</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Efficacité des Sites:</span>
                            <span className="font-medium">{results.siteEfficiency}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Génération de Rapports
                    </CardTitle>
                    <CardDescription>Exportez vos résultats sous différents formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button className="h-20 flex-col gap-2" onClick={generatePDFReport}>
                        <FileText className="w-6 h-6" />
                        <span>Rapport PDF Complet</span>
                      </Button>
                      <Button
                        className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={downloadStatisticsReport}
                      >
                        <TrendingUp className="w-6 h-6" />
                        <span>Rapport Statistiques</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

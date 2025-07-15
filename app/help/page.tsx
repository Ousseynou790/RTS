import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { HelpCircle, Home, FolderOpen, Calculator, User } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showHome={true} showProjects={true} showProfile={true} title="RTS Telecom" subtitle="Aide & Support" />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <HelpCircle className="w-6 h-6" />
              Aide & Support
            </CardTitle>
            <CardDescription>
              Retrouvez ici toutes les informations pour bien utiliser l'application RTS Telecom.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">À quoi sert l'application ?</h2>
              <p>
                <strong>RTS Telecom</strong> est une application web moderne dédiée à la gestion de projets de télécommunications et au <strong>dimensionnement de réseaux mobiles</strong> (GSM, UMTS, LTE). Elle permet de créer, suivre et archiver des projets, d'effectuer des calculs de dimensionnement, de générer des rapports PDF, d'obtenir des statistiques, et de recevoir des notifications en temps réel.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">Fonctionnalités principales</h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li>Création, gestion, archivage et restauration de projets de dimensionnement</li>
                <li>Calculs automatiques des besoins en sites, trafic, TRX, canaux, etc.</li>
                <li>Génération de rapports PDF professionnels</li>
                <li>Statistiques détaillées sur vos projets et calculs</li>
                <li>Notifications persistantes et en temps réel (WebSocket)</li>
                <li>Protection des accès et gestion sécurisée des sessions</li>
                <li>Interface moderne, responsive et expérience utilisateur professionnelle</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">Comment se font les calculs de dimensionnement ?</h2>
              <p>
                L'application propose un <strong>calculateur intelligent</strong> qui adapte les formules selon le type de réseau choisi :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li><strong>GSM (2G)</strong> : calcul du nombre de sites à partir de la surface, de la population, du taux de pénétration, du trafic (Erlangs), du BHCA, de la durée moyenne d'appel, de la capacité TRX, etc.</li>
                <li><strong>UMTS (3G)</strong> : prise en compte de la capacité cellulaire, de l'efficacité spectrale, du débit par abonné, de la couverture, et de la gestion de l'interférence.</li>
                <li><strong>LTE (4G)</strong> : dimensionnement basé sur la bande passante, l'efficacité spectrale, le débit utilisateur cible, la densité de population, et la couverture.</li>
              </ul>
              <p>
                Pour chaque projet, il suffit de renseigner les paramètres de la zone (surface, population, type, etc.) et l'application effectue automatiquement :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700">
                <li>Le calcul du <strong>rayon de cellule</strong> et de la <strong>surface couverte</strong></li>
                <li>Le <strong>nombre optimal de sites</strong> à déployer</li>
                <li>Le <strong>trafic total</strong> et la <strong>capacité requise</strong> (TRX, canaux, etc.)</li>
                <li>Des <strong>indicateurs de performance</strong> (efficacité spectrale, fiabilité, etc.)</li>
                <li>Des <strong>recommandations techniques</strong> pour optimiser le réseau</li>
              </ul>
              <p>
                Les formules utilisées sont issues des standards internationaux (3GPP, ITU) et adaptées aux besoins des opérateurs. Les résultats sont présentés de façon pédagogique, avec des explications et des graphiques.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mt-6">Navigation rapide</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <Link href="/" className="underline hover:text-emerald-700">Accueil</Link>
                </li>
                <li className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <Link href="/projects" className="underline hover:text-blue-700">Mes Projets</Link>
                </li>
                <li className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <span>Calculateur : accessible depuis chaque projet</span>
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-600" />
                  <Link href="/profile" className="underline hover:text-slate-700">Profil & Statistiques</Link>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mt-6">FAQ</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Comment créer un projet ?</strong> Cliquez sur « Nouveau Projet » depuis la page d'accueil ou l'onglet projets.</li>
                <li><strong>Comment archiver ou restaurer un projet ?</strong> Utilisez les boutons dédiés dans la liste de vos projets. Une confirmation vous sera demandée.</li>
                <li><strong>Comment recevoir des notifications ?</strong> Les notifications s'affichent en temps réel via la cloche en haut à droite.</li>
                <li><strong>Problème d'accès ou bug ?</strong> Déconnectez-vous puis reconnectez-vous. Si le problème persiste, contactez le support.</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
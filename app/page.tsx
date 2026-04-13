import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Bell, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">QuincaStock</span>
          </div>
          <Link href="/auth/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            Plateforme SaaS pour quincailleries
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Gestion intelligente de stock pour quincailleries
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Suivez votre inventaire en temps réel, recevez des alertes de stock faible et optimisez vos ventes avec une plateforme moderne et intuitive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Créer ma quincaillerie
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Découvrir les fonctionnalités
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des outils puissants pour gérer votre quincaillerie efficacement
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Package className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Gestion des produits</CardTitle>
              <CardDescription>
                Organisez vos produits par catégories et suivez les stocks en temps réel
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Bell className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Alertes de stock faible</CardTitle>
              <CardDescription>
                Recevez des notifications automatiques quand vos produits arrivent à rupture
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Suivi des ventes</CardTitle>
              <CardDescription>
                Enregistrez vos ventes et analysez vos performances quotidiennes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Rapports simples</CardTitle>
              <CardDescription>
                Visualisez vos données avec des graphiques clairs et des statistiques utiles
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Conçu pour les petites entreprises
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                QuincaStock est une solution complète qui vous permet de gérer votre quincaillerie sans complications. Pas besoin de formation, tout est intuitif.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Données sécurisées</div>
                    <div className="text-sm text-muted-foreground">Vos informations sont protégées et sauvegardées</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Interface rapide</div>
                    <div className="text-sm text-muted-foreground">Accédez à vos données instantanément, où que vous soyez</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">Multi-tenant</div>
                    <div className="text-sm text-muted-foreground">Chaque quincaillerie a son propre espace isolé</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Card className="p-8 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Prêt à commencer ?</CardTitle>
                  <CardDescription className="text-base">
                    Créez votre compte en quelques minutes et commencez à gérer votre stock efficacement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Link href="/auth/register">
                    <Button size="lg" className="w-full">
                      Créer ma quincaillerie gratuitement
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Aucune carte bancaire requise
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">QuincaStock</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 QuincaStock. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

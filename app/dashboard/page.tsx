'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const { store, categories } = useApp();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (store?.id) {
      loadData();
    }
  }, [store?.id]);

  const loadData = async () => {
    if (!store?.id) return;
    setIsLoading(true);

    const [productsRes, salesRes] = await Promise.all([
      api.products.list(store.id),
      api.sales.list(store.id)
    ]);

    if (productsRes.error) {
      toast({ title: 'Erreur', description: productsRes.error, variant: 'destructive' });
    } else {
      setProducts(productsRes.data || []);
    }

    if (salesRes.error) {
      toast({ title: 'Erreur', description: salesRes.error, variant: 'destructive' });
    } else {
      setSales(salesRes.data || []);
    }

    setIsLoading(false);
  };

  const getProductStatus = (product: any) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: store?.currency || 'XOF' }).format(value);
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(s => s.createdAt?.startsWith(today));
  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
  const todayRevenue = todaysSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
  const lowStockProducts = products.filter(p => getProductStatus(p) === 'low-stock');
  const outOfStockProducts = products.filter(p => getProductStatus(p) === 'out-of-stock');

  const salesByCategory = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const catSales = sales.filter(s => catProducts.some(p => p.id === s.productId));
    const revenue = catSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    return { category: cat.name, revenue };
  }).filter(item => item.revenue > 0);

  const chartConfig = {
    revenue: { label: 'Revenus', color: 'hsl(var(--primary))' },
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre quincaillerie</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">{categories.length} catégories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ventes aujourd&apos;hui</CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{todaysSales.length}</div>
                <p className="text-xs text-muted-foreground">transaction(s)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus aujourd&apos;hui</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(todayRevenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stock bas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {lowStockProducts.length + outOfStockProducts.length}
                </div>
                <p className="text-xs text-muted-foreground">produit(s) à surveiller</p>
              </CardContent>
            </Card>
          </div>

          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Alertes de stock</CardTitle>
                <CardDescription>Produits nécessitant une attention immédiate</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.quantity} {product.unit}</TableCell>
                        <TableCell>
                          {getProductStatus(product) === 'out-of-stock' ? (
                            <Badge variant="destructive">Rupture</Badge>
                          ) : (
                            <Badge variant="outline" className="border-orange-500 text-orange-500">Stock faible</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Link href="/dashboard/stock" className="text-sm text-primary hover:underline">
                    Voir tous les produits en alerte →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenus par catégorie</CardTitle>
                <CardDescription>Répartition des ventes</CardDescription>
              </CardHeader>
              <CardContent>
                {salesByCategory.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={salesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques globales</CardTitle>
                <CardDescription>Vue d&apos;ensemble</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Revenus totaux</span>
                    <span className="font-bold">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total ventes</span>
                    <span className="font-bold">{sales.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Produits en rupture</span>
                    <span className="font-bold text-destructive">{outOfStockProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Produits en stock</span>
                    <span className="font-bold text-green-500">
                      {products.length - outOfStockProducts.length - lowStockProducts.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

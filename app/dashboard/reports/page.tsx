'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingCart,
  AlertTriangle,
  Award,
  Calendar
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReportsPage() {
  const { store, categories } = useApp();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('all');

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: store?.currency || 'XOF' }).format(value);
  };

  const getProductStatus = (product: any) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const filteredSales = useMemo(() => {
    if (period === 'all') return sales;
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return sales;
    }
    
    return sales.filter(s => new Date(s.createdAt) >= startDate);
  }, [sales, period]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    const totalSales = filteredSales.length;
    const totalItemsSold = filteredSales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= (p.lowStockThreshold || 10)).length;
    
    const topProducts = [...filteredSales]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 5)
      .map(s => ({
        name: s.productName || 'Inconnu',
        quantity: s.quantity || 0,
        revenue: s.totalPrice || 0
      }));

    return { totalRevenue, totalSales, totalItemsSold, avgSaleValue, outOfStock, lowStock, topProducts };
  }, [filteredSales, products]);

  const topCategories = useMemo(() => {
    const categoryMap = new Map();
    
    filteredSales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product?.categoryId) {
        const current = categoryMap.get(product.categoryId) || { name: product.categoryName || 'Inconnu', revenue: 0, count: 0 };
        current.revenue += sale.totalPrice || 0;
        current.count += sale.quantity || 0;
        categoryMap.set(product.categoryId, current);
      }
    });

    return Array.from(categoryMap.entries())
      .map(([id, data]: [any, any]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSales, products]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-muted-foreground">Analysez vos performances</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd&apos;hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(metrics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">{filteredSales.length} vente(s)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Articles vendus</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalItemsSold}</div>
                <p className="text-xs text-muted-foreground">pièce(s)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.avgSaleValue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {metrics.outOfStock + metrics.lowStock}
                </div>
                <p className="text-xs text-muted-foreground">produit(s) à surveiller</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 5 des produits</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.topProducts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Revenus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.topProducts.map((product, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories performantes</CardTitle>
                <CardDescription>Top 5 des catégories</CardDescription>
              </CardHeader>
              <CardContent>
                {topCategories.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Ventes</TableHead>
                        <TableHead>Revenus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCategories.map((cat, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell>{cat.count}</TableCell>
                          <TableCell>{formatCurrency(cat.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>État du stock</CardTitle>
              <CardDescription>Répartition des produits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {products.filter(p => getProductStatus(p) === 'in-stock').length}
                  </div>
                  <div className="text-sm text-green-700">En stock</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {metrics.lowStock}
                  </div>
                  <div className="text-sm text-orange-700">Stock faible</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {metrics.outOfStock}
                  </div>
                  <div className="text-sm text-red-700">Rupture</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

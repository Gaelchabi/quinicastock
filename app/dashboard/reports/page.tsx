'use client';

import { useMemo } from 'react';
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
  Award
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { formatCurrency, getProductStatus } from '@/lib/mock-data';
import { Empty } from '@/components/ui/empty';

export default function ReportsPage() {
  const { sales, products, categories, store } = useApp();

  // Calculate various metrics
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalSales = sales.length;
    const totalProducts = products.length;
    const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    // Today's metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    // This week's metrics
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSales = sales.filter(sale => new Date(sale.date) >= weekAgo);
    const weekRevenue = weekSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    // Stock alerts
    const outOfStock = products.filter(p => getProductStatus(p) === 'out-of-stock').length;
    const lowStock = products.filter(p => getProductStatus(p) === 'low-stock').length;

    // Product sales ranking
    const productSalesMap = new Map<string, { quantity: number; revenue: number }>();
    sales.forEach(sale => {
      const current = productSalesMap.get(sale.productId) || { quantity: 0, revenue: 0 };
      productSalesMap.set(sale.productId, {
        quantity: current.quantity + sale.quantity,
        revenue: current.revenue + sale.totalPrice,
      });
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([productId, stats]) => ({
        product: products.find(p => p.id === productId),
        ...stats,
      }))
      .filter(item => item.product)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Category sales
    const categorySalesMap = new Map<string, { quantity: number; revenue: number }>();
    sales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        const current = categorySalesMap.get(product.categoryId) || { quantity: 0, revenue: 0 };
        categorySalesMap.set(product.categoryId, {
          quantity: current.quantity + sale.quantity,
          revenue: current.revenue + sale.totalPrice,
        });
      }
    });

    const topCategories = Array.from(categorySalesMap.entries())
      .map(([categoryId, stats]) => ({
        category: categories.find(c => c.id === categoryId),
        ...stats,
      }))
      .filter(item => item.category)
      .sort((a, b) => b.revenue - a.revenue);

    // Stock value
    const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

    return {
      totalRevenue,
      totalSales,
      totalProducts,
      totalItemsSold,
      todayRevenue,
      weekRevenue,
      outOfStock,
      lowStock,
      topProducts,
      topCategories,
      totalStockValue,
    };
  }, [sales, products, categories]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Rapports et analyses</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalRevenue, store?.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cette semaine: {formatCurrency(metrics.weekRevenue, store?.currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total ventes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalItemsSold} articles vendus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalStockValue, store?.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalProducts} produits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {metrics.outOfStock + metrics.lowStock}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.outOfStock} ruptures, {metrics.lowStock} faibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Top 10 des produits les plus vendus
          </CardTitle>
          <CardDescription>Classement par chiffre d&apos;affaires généré</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.topProducts.length === 0 ? (
            <Empty
              icon={TrendingUp}
              title="Aucune vente"
              description="Les statistiques apparaîtront après vos premières ventes"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Quantité vendue</TableHead>
                  <TableHead className="text-right">Revenu généré</TableHead>
                  <TableHead className="text-right">Stock actuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.topProducts.map((item, index) => (
                  <TableRow key={item.product?.id}>
                    <TableCell>
                      <Badge 
                        variant={index < 3 ? 'default' : 'secondary'}
                        className={index === 0 ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      >
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.product?.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity} {item.product?.unit}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.revenue, store?.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          getProductStatus(item.product!) === 'out-of-stock'
                            ? 'destructive'
                            : getProductStatus(item.product!) === 'low-stock'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {item.product?.quantity} {item.product?.unit}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance par catégorie
          </CardTitle>
          <CardDescription>Analyse des ventes par catégorie de produits</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.topCategories.length === 0 ? (
            <Empty
              icon={BarChart3}
              title="Aucune donnée"
              description="Les statistiques par catégorie apparaîtront après vos ventes"
            />
          ) : (
            <div className="space-y-4">
              {metrics.topCategories.map((item, index) => {
                const percentage = (item.revenue / metrics.totalRevenue) * 100;
                return (
                  <div key={item.category?.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{item.category?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} articles vendus
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.revenue, store?.currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}% du total
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

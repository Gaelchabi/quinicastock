'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { getProductStatus, getTodaysSales, getTotalRevenue, formatCurrency } from '@/lib/mock-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function DashboardPage() {
  const { products, sales, store, categories } = useApp();

  const todaysSales = getTodaysSales(sales);
  const totalRevenue = getTotalRevenue(todaysSales);
  const lowStockProducts = products.filter(p => getProductStatus(p) === 'low-stock');
  const outOfStockProducts = products.filter(p => getProductStatus(p) === 'out-of-stock');

  // Chart data - sales by category
  const salesByCategory = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    const categorySales = sales.filter(sale => 
      categoryProducts.some(p => p.id === sale.productId)
    );
    const revenue = getTotalRevenue(categorySales);
    
    return {
      category: category.name,
      revenue,
    };
  }).filter(item => item.revenue > 0);

  const chartConfig = {
    revenue: {
      label: 'Revenus',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre quincaillerie</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.length} catégories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits en rupture</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockProducts.length} en stock faible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventes du jour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSales.length}</div>
            <p className="text-xs text-muted-foreground">
              transactions aujourd&apos;hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenus du jour</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue, store?.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              depuis ce matin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {salesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenus par catégorie</CardTitle>
            <CardDescription>Performance de vente par type de produit</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-revenue)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Low Stock Alert */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
            <CardDescription>Dernières transactions enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysSales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysSales.slice(0, 5).map((sale) => {
                    const product = products.find(p => p.id === sale.productId);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                          {product?.name || 'Produit inconnu'}
                        </TableCell>
                        <TableCell className="text-right">{sale.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sale.totalPrice, store?.currency)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune vente aujourd&apos;hui
              </p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes de stock</CardTitle>
            <CardDescription>Produits nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent>
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) ? (
              <div className="space-y-3">
                {outOfStockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-destructive/50 bg-destructive/5"
                  >
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {categories.find(c => c.id === product.categoryId)?.name}
                      </p>
                    </div>
                    <Badge variant="destructive">Rupture</Badge>
                  </div>
                ))}
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.quantity} {product.unit}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-orange-500 text-orange-500">
                      Stock faible
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tous les produits sont en stock suffisant
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PackageX, PackageCheck } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { getProductStatus, formatCurrency } from '@/lib/mock-data';
import { Empty } from '@/components/ui/empty';

export default function StockPage() {
  const { products, categories, store } = useApp();

  const outOfStockProducts = products.filter(p => getProductStatus(p) === 'out-of-stock');
  const lowStockProducts = products.filter(p => getProductStatus(p) === 'low-stock');
  const inStockProducts = products.filter(p => getProductStatus(p) === 'in-stock');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestion du stock</h1>
        <p className="text-muted-foreground">Surveillez l&apos;état de votre inventaire</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits en rupture</CardTitle>
            <PackageX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Nécessitent réapprovisionnement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Sous le seuil d&apos;alerte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En stock</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{inStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Niveau optimal</p>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock */}
      {outOfStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageX className="h-5 w-5 text-destructive" />
              Produits en rupture de stock
            </CardTitle>
            <CardDescription>Ces produits nécessitent un réapprovisionnement urgent</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outOfStockProducts.map((product) => {
                  const category = categories.find(c => c.id === product.categoryId);
                  return (
                    <TableRow key={product.id} className="bg-destructive/5">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell className="text-right">
                        {product.quantity} {product.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.price, store?.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Rupture</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Low Stock */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Produits en stock faible
            </CardTitle>
            <CardDescription>Ces produits approchent du seuil d&apos;alerte</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Seuil</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => {
                  const category = categories.find(c => c.id === product.categoryId);
                  return (
                    <TableRow key={product.id} className="bg-orange-500/5">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell className="text-right">
                        {product.quantity} {product.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.lowStockThreshold || 10}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.price, store?.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-orange-500 text-orange-500">
                          Stock faible
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Good */}
      {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <Empty
              icon={PackageCheck}
              title="Tout va bien !"
              description="Tous vos produits sont en stock suffisant. Aucune action requise."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

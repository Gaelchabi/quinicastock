'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PackageX, PackageCheck, Package } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  categoryId?: string;
  categoryName?: string;
  tenantId: string;
  lowStockThreshold?: number;
}

export default function StockPage() {
  const { store, categories } = useApp();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (store?.id) {
      loadProducts();
    }
  }, [store?.id]);

  const loadProducts = async () => {
    if (!store?.id) return;
    setIsLoading(true);
    const { data, error } = await api.products.list(store.id);
    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const getProductStatus = (product: Product) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: store?.currency || 'XOF' }).format(value);
  };

  const outOfStockProducts = products.filter(p => getProductStatus(p) === 'out-of-stock');
  const lowStockProducts = products.filter(p => getProductStatus(p) === 'low-stock');
  const inStockProducts = products.filter(p => getProductStatus(p) === 'in-stock');

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion du stock</h1>
        <p className="text-muted-foreground">Surveillez l&apos;état de votre inventaire</p>
      </div>

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

      {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Alertes de stock</CardTitle>
            <CardDescription>
              Produits nécessitant une attention immédiate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Seuil</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...outOfStockProducts, ...lowStockProducts].map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName || '-'}</TableCell>
                    <TableCell>
                      {product.quantity} {product.unit}
                    </TableCell>
                    <TableCell>{product.lowStockThreshold || 10}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tous les produits</CardTitle>
          <CardDescription>
            Vue d&apos;ensemble de l&apos;inventaire complet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun produit dans l&apos;inventaire</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/products">Ajouter des produits</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName || '-'}</TableCell>
                    <TableCell>
                      {product.quantity} {product.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {getProductStatus(product) === 'out-of-stock' ? (
                        <Badge variant="destructive">Rupture</Badge>
                      ) : getProductStatus(product) === 'low-stock' ? (
                        <Badge variant="outline" className="border-orange-500 text-orange-500">Stock faible</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">En stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

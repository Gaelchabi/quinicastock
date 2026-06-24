'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Plus, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tenantId: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit?: string;
}

export default function SalesPage() {
  const { store, products: contextProducts, setProducts } = useApp();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProductsData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
  });

  useEffect(() => {
    if (store?.id) {
      loadData();
    }
  }, [store?.id]);

  const loadData = async () => {
    if (!store?.id) return;
    setIsLoading(true);
    
    const [salesRes, productsRes] = await Promise.all([
      api.sales.list(store.id),
      api.products.list(store.id)
    ]);

    if (salesRes.error) {
      toast({ title: 'Erreur', description: salesRes.error, variant: 'destructive' });
    } else {
      const salesWithProducts = (salesRes.data || []).map((s: any) => {
        const product = productsRes.data?.find((p: any) => p.id === s.productId);
        return { ...s, productName: product?.name || 'Inconnu' };
      });
      setSales(salesWithProducts);
    }

    if (productsRes.error) {
      toast({ title: 'Erreur', description: productsRes.error, variant: 'destructive' });
    } else {
      setProductsData(productsRes.data || []);
      setProducts((productsRes.data || []).map((p: any) => ({
        id: p.id,
        storeId: p.tenantId,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        categoryId: p.categoryId,
        lowStockThreshold: p.lowStockThreshold,
        unit: p.unit,
      })));
    }
    setIsLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: store?.currency || 'XOF' }).format(value);
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.createdAt?.startsWith(today));
  
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + s.quantity, 0);

  const handleOpenDialog = () => {
    setFormData({ productId: '', quantity: 1 });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({ productId: '', quantity: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;

    const product = products.find(p => p.id === formData.productId);
    if (!product) {
      toast({ title: 'Erreur', description: 'Produit non trouvé', variant: 'destructive' });
      return;
    }

    if (formData.quantity > product.quantity) {
      toast({ 
        title: 'Stock insuffisant', 
        description: `Stock disponible: ${product.quantity} ${product.unit || 'pièce(s)'}`, 
        variant: 'destructive' 
      });
      return;
    }

    const saleData = {
      productId: product.id,
      quantity: formData.quantity,
      unitPrice: product.price,
      totalPrice: product.price * formData.quantity,
      tenantId: store.id,
    };

    const { error } = await api.sales.create(saleData);
    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Vente enregistrée', description: `${formData.quantity} x ${product.name}` });
      
      const newQuantity = product.quantity - formData.quantity;
      await api.products.update(product.id, { quantity: newQuantity });
      
      loadData();
    }
    handleCloseDialog();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ventes</h1>
          <p className="text-muted-foreground">Enregistrez et suivre vos ventes</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle vente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventes aujourd&apos;hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales.length}</div>
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
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Articles vendus</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground">pièce(s)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des ventes</CardTitle>
          <CardDescription>
            {sales.length} vente(s) enregistrée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune vente enregistrée</p>
              <Button className="mt-4" onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Enregistrer une vente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.slice().reverse().map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('fr-FR') : '-'}
                    </TableCell>
                    <TableCell className="font-medium">{sale.productName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(sale.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle vente</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle vente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Produit *</FieldLabel>
                <Select 
                  value={formData.productId} 
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.filter(p => p.quantity > 0).map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)} ({product.quantity} en stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Quantité *</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  max={products.find(p => p.id === formData.productId)?.quantity || 1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  required
                />
              </Field>
            </FieldGroup>
            {formData.productId && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">
                  {formatCurrency(
                    (products.find(p => p.id === formData.productId)?.price || 0) * formData.quantity
                  )}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="submit" disabled={!formData.productId}>
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

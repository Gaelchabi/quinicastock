'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Plus, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Empty } from '@/components/ui/empty';
import { formatCurrency } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import type { Sale } from '@/lib/mock-data';

export default function SalesPage() {
  const { sales, products, store, setSales, updateProduct } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });

  // Calculate stats
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  const handleOpenDialog = () => {
    setFormData({
      productId: '',
      quantity: '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      productId: '',
      quantity: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find(p => p.id === formData.productId);
    if (!product) {
      toast({
        title: 'Erreur',
        description: 'Produit non trouvé',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity <= 0) {
      toast({
        title: 'Erreur',
        description: 'La quantité doit être supérieure à 0',
        variant: 'destructive',
      });
      return;
    }

    if (quantity > product.quantity) {
      toast({
        title: 'Stock insuffisant',
        description: `Stock disponible: ${product.quantity} ${product.unit}`,
        variant: 'destructive',
      });
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      storeId: store?.id || 'default',
      productId: product.id,
      quantity,
      totalPrice: product.price * quantity,
      date: new Date(),
    };

    setSales([newSale, ...sales]);

    // Update product quantity
    updateProduct(product.id, {
      quantity: product.quantity - quantity,
    });

    toast({
      title: 'Vente enregistrée',
      description: `${quantity} ${product.unit} de ${product.name} vendu(s)`,
    });

    handleCloseDialog();
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Produit inconnu';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Sort sales by date (newest first)
  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ventes</h1>
          <p className="text-muted-foreground">Suivez toutes vos transactions</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle vente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total ventes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventes aujourd&apos;hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue, store?.currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu aujourd&apos;hui</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(todayRevenue, store?.currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des ventes</CardTitle>
          <CardDescription>Liste de toutes les transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSales.length === 0 ? (
            <Empty
              icon={TrendingUp}
              title="Aucune vente"
              description="Enregistrez votre première vente pour commencer"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSales.map((sale) => {
                  const product = products.find(p => p.id === sale.productId);
                  return (
                    <TableRow key={sale.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sale.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getProductName(sale.productId)}
                      </TableCell>
                      <TableCell className="text-center">
                        {sale.quantity} {product?.unit}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(sale.totalPrice, store?.currency)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Sale Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle vente</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle transaction
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Produit *</FieldLabel>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => setFormData({ ...formData, productId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter(p => p.quantity > 0)
                        .map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (Stock: {product.quantity} {product.unit})
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
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Quantité vendue"
                    required
                  />
                </Field>
              </FieldGroup>

              {formData.productId && formData.quantity && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Montant total:</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(
                        (products.find(p => p.id === formData.productId)?.price || 0) *
                          parseInt(formData.quantity || '0'),
                        store?.currency
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer la vente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

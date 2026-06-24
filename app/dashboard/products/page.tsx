'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  unit?: string;
  categoryId?: string;
  categoryName?: string;
  tenantId: string;
  lowStockThreshold?: number;
  description?: string;
}

export default function ProductsPage() {
  const { categories, store } = useApp();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: 0,
    price: 0,
    unit: '',
    lowStockThreshold: 10,
    description: '',
  });

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
      const productsWithCategory = await Promise.all((data || []).map(async (p: any) => {
        let categoryName = '';
        if (p.categoryId) {
          const { data: cats } = await api.categories.list(store.id);
          const cat = cats?.find((c: any) => c.id === p.categoryId);
          categoryName = cat?.name || '';
        }
        return { ...p, categoryName };
      }));
      setProducts(productsWithCategory);
    }
    setIsLoading(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        categoryId: product.categoryId || '',
        quantity: product.quantity,
        price: product.price,
        unit: product.unit || '',
        lowStockThreshold: product.lowStockThreshold || 10,
        description: product.description || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        quantity: 0,
        price: 0,
        unit: '',
        lowStockThreshold: 10,
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;

    const productData = {
      ...formData,
      tenantId: store.id,
      categoryId: formData.categoryId || undefined,
    };

    if (editingProduct) {
      const { data, error } = await api.products.update(editingProduct.id, productData);
      if (error) {
        toast({ title: 'Erreur', description: error, variant: 'destructive' });
      } else {
        toast({ title: 'Produit mis à jour', description: 'Les modifications ont été enregistrées' });
        loadProducts();
      }
    } else {
      const { data, error } = await api.products.create(productData);
      if (error) {
        toast({ title: 'Erreur', description: error, variant: 'destructive' });
      } else {
        toast({ title: 'Produit ajouté', description: 'Le nouveau produit a été créé avec succès' });
        loadProducts();
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    const { error } = await api.products.delete(productToDelete);
    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Produit supprimé', description: 'Le produit a été supprimé de votre inventaire' });
      loadProducts();
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (product: Product) => {
    const threshold = product.lowStockThreshold || 10;
    if (product.quantity === 0) {
      return <Badge variant="destructive">Rupture</Badge>;
    }
    if (product.quantity <= threshold) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Stock faible</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-500">En stock</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: store?.currency || 'XOF' }).format(value);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">Gérez votre inventaire de produits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre inventaire'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Nom du produit *</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Catégorie *</FieldLabel>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Quantité *</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Unité</FieldLabel>
                    <Input
                      placeholder="pièce, sac, bidon..."
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Prix *</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Seuil stock bas</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 10 })}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
          <CardDescription>
            {filteredProducts.length} produit(s) dans votre inventaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun produit trouvé</p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier produit
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName || '-'}</TableCell>
                    <TableCell>
                      {product.quantity} {product.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        description="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}

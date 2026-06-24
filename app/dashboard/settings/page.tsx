'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, User, Bell, Shield, MapPin, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const { store, setStore, user, setLocations: setContextLocations } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [storeData, setStoreData] = useState({
    name: store?.name || '',
    owner: store?.owner || '',
    phone: store?.phone || '',
    country: store?.country || '',
    city: store?.city || '',
    currency: store?.currency || 'XOF',
  });

  const [preferences, setPreferences] = useState({
    lowStockThreshold: store?.lowStockThreshold || 10,
    notificationsEnabled: store?.notificationsEnabled ?? true,
  });

  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    if (store?.id) {
      loadTenant();
    }
  }, [store?.id]);

  const loadTenant = async () => {
    if (!store?.id) return;
    setIsLoading(true);
    const { data, error } = await api.tenants.get(store.id);
    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else if (data) {
      setStoreData({
        name: data.name || '',
        owner: data.owner || '',
        phone: data.phone || '',
        country: data.country || '',
        city: data.city || '',
        currency: data.currency || 'XOF',
      });
      setPreferences({
        lowStockThreshold: data.lowStockThreshold || 10,
        notificationsEnabled: data.notificationsEnabled ?? true,
      });
    }
    setIsLoading(false);
  };

  const handleSaveStore = async () => {
    if (!store?.id) return;
    setIsSaving(true);

    const { error } = await api.tenants.update(store.id, {
      ...storeData,
      lowStockThreshold: preferences.lowStockThreshold,
      notificationsEnabled: preferences.notificationsEnabled,
    });

    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else {
      setStore({
        ...store,
        ...storeData,
        lowStockThreshold: preferences.lowStockThreshold,
        notificationsEnabled: preferences.notificationsEnabled,
      });
      toast({ title: 'Paramètres enregistrés', description: 'Vos modifications ont été sauvegardées' });
    }
    setIsSaving(false);
  };

  const handleAddLocation = async () => {
    if (!store?.id || !newLocationData.name || !newLocationData.city) {
      toast({ title: 'Erreur', description: 'Le nom et la ville sont obligatoires', variant: 'destructive' });
      return;
    }

    const { error } = await api.locations.create({
      ...newLocationData,
      tenantId: store.id,
    });

    if (error) {
      toast({ title: 'Erreur', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Lieu ajouté' });
      setIsAddLocationOpen(false);
      setNewLocationData({ name: '', address: '', city: '', phone: '' });
    }
  };

  const currencies = [
    { value: 'XOF', label: 'XOF (Franc CFA)' },
    { value: 'EUR', label: 'EUR (Euro)' },
    { value: 'USD', label: 'USD (Dollar)' },
    { value: 'GHS', label: 'GHS (Cedi)' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre quincaillerie</p>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store">Magasin</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="locations">Lieux</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informations du magasin
              </CardTitle>
              <CardDescription>
                Les informations de base de votre quincaillerie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Nom du magasin</FieldLabel>
                    <Input
                      value={storeData.name}
                      onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Propriétaire</FieldLabel>
                    <Input
                      value={storeData.owner}
                      onChange={(e) => setStoreData({ ...storeData, owner: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Téléphone</FieldLabel>
                    <Input
                      value={storeData.phone}
                      onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Devise</FieldLabel>
                    <Select
                      value={storeData.currency}
                      onValueChange={(value) => setStoreData({ ...storeData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Pays</FieldLabel>
                    <Input
                      value={storeData.country}
                      onChange={(e) => setStoreData({ ...storeData, country: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Ville</FieldLabel>
                    <Input
                      value={storeData.city}
                      onChange={(e) => setStoreData({ ...storeData, city: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <Button onClick={handleSaveStore} disabled={isSaving} className="mt-4">
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences
              </CardTitle>
              <CardDescription>
                Configurez les alertes et notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Seuil d&apos;alerte stock bas</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    value={preferences.lowStockThreshold}
                    onChange={(e) => setPreferences({ ...preferences, lowStockThreshold: parseInt(e.target.value) || 10 })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Vous serez alerté quand un produit atteint cette quantité
                  </p>
                </Field>
              </FieldGroup>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des alertes quand le stock est bas
                  </p>
                </div>
                <Switch
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notificationsEnabled: checked })}
                />
              </div>

              <Button onClick={handleSaveStore} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Lieux / Magasins
              </CardTitle>
              <CardDescription>
                Gérez les différents lieux de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Gestion des lieux à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

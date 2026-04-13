'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import type { Location } from '@/lib/mock-data';
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
  const { store, setStore, user, locations, addLocation, updateLocation, deleteLocation } = useApp();
  const { toast } = useToast();

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

  const handleSaveStore = () => {
    if (store) {
      setStore({
        ...store,
        ...storeData,
      });
      toast({
        title: 'Paramètres enregistrés',
        description: 'Les informations de la quincaillerie ont été mises à jour',
      });
    }
  };

  const handleSavePreferences = () => {
    if (store) {
      setStore({
        ...store,
        ...preferences,
      });
      toast({
        title: 'Préférences enregistrées',
        description: 'Vos préférences ont été mises à jour',
      });
    }
  };

  const handleAddLocation = () => {
    if (!newLocationData.name || !newLocationData.city) {
      toast({
        title: 'Informations manquantes',
        description: 'Le nom et la ville sont requis',
        variant: 'destructive',
      });
      return;
    }

    const location: Location = {
      id: Date.now().toString(),
      storeId: store?.id || 'default',
      name: newLocationData.name,
      address: newLocationData.address,
      city: newLocationData.city,
      phone: newLocationData.phone,
      isMain: false,
      createdAt: new Date(),
    };

    addLocation(location);
    setNewLocationData({ name: '', address: '', city: '', phone: '' });
    setIsAddLocationOpen(false);

    toast({
      title: 'Magasin ajouté',
      description: `${location.name} a été ajouté avec succès`,
    });
  };

  const handleDeleteLocation = (id: string, isMain: boolean) => {
    if (isMain) {
      toast({
        title: 'Action impossible',
        description: 'Vous ne pouvez pas supprimer le magasin principal',
        variant: 'destructive',
      });
      return;
    }

    deleteLocation(id);
    toast({
      title: 'Magasin supprimé',
      description: 'Le magasin a été supprimé avec succès',
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre quincaillerie</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            Quincaillerie
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="h-4 w-4" />
            Magasins
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Bell className="h-4 w-4" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            Compte
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la quincaillerie</CardTitle>
              <CardDescription>
                Modifiez les informations de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Nom de la quincaillerie</FieldLabel>
                  <Input
                    value={storeData.name}
                    onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Nom du propriétaire</FieldLabel>
                  <Input
                    value={storeData.owner}
                    onChange={(e) => setStoreData({ ...storeData, owner: e.target.value })}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Téléphone</FieldLabel>
                  <Input
                    value={storeData.phone}
                    onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                  />
                </Field>
              </FieldGroup>

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

              <FieldGroup>
                <Field>
                  <FieldLabel>Devise</FieldLabel>
                  <Select value={storeData.currency} onValueChange={(value) => setStoreData({ ...storeData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                      <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveStore}>
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Magasins / Sites</CardTitle>
                  <CardDescription>
                    Gérez vos différents points de vente
                  </CardDescription>
                </div>
                <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un magasin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau magasin</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau point de vente ou une annexe
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Nom du magasin *</FieldLabel>
                          <Input
                            placeholder="Ex: Annexe Nord"
                            value={newLocationData.name}
                            onChange={(e) => setNewLocationData({ ...newLocationData, name: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Ville *</FieldLabel>
                          <Input
                            placeholder="Ex: Abidjan"
                            value={newLocationData.city}
                            onChange={(e) => setNewLocationData({ ...newLocationData, city: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Adresse</FieldLabel>
                          <Input
                            placeholder="Ex: Boulevard de la République"
                            value={newLocationData.address}
                            onChange={(e) => setNewLocationData({ ...newLocationData, address: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Téléphone</FieldLabel>
                          <Input
                            placeholder="+225 01 23 45 67 89"
                            value={newLocationData.phone}
                            onChange={(e) => setNewLocationData({ ...newLocationData, phone: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddLocation}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{location.name}</p>
                          {location.isMain && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{location.city}</p>
                        {location.address && (
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                        )}
                        {location.phone && (
                          <p className="text-sm text-muted-foreground">{location.phone}</p>
                        )}
                      </div>
                    </div>
                    {!location.isMain && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(location.id, location.isMain)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {locations.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun magasin configuré</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Configurez les alertes et les seuils
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Seuil d&apos;alerte de stock faible</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    value={preferences.lowStockThreshold}
                    onChange={(e) => setPreferences({ ...preferences, lowStockThreshold: parseInt(e.target.value) || 10 })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recevez une alerte quand un produit atteint ce niveau
                  </p>
                </Field>
              </FieldGroup>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-setting" className="text-base font-medium">
                    Activer les notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes pour les stocks faibles et les ruptures
                  </p>
                </div>
                <Switch
                  id="notifications-setting"
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notificationsEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences}>
                  Enregistrer les préférences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Gérez votre compte utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Nom</FieldLabel>
                  <Input value={user?.name || ''} disabled />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input value={user?.email || ''} disabled />
                </Field>
              </FieldGroup>

              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Compte protégé</p>
                    <p className="text-sm text-muted-foreground">
                      Vos informations sont sécurisées. Pour modifier votre email ou mot de passe, contactez le support.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                <div>
                  <p className="font-medium">Supprimer le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Supprimer définitivement votre compte et toutes les données
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

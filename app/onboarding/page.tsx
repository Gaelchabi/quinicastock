'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Package, Store, Settings, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { Store as StoreType, Category, Product, Location } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { setStore, setCategories, setProducts, setIsOnboarded, setLocations, setCurrentLocation } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Store Information
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [currency, setCurrency] = useState('XOF');

  // Step 2: Locations/Magasins
  const [locations, setLocationsState] = useState<Array<{ name: string; address: string; city: string; phone: string }>>([
    { name: 'Magasin Principal', address: '', city: '', phone: '' }
  ]);

  // Step 3: Categories
  const [customCategories, setCustomCategories] = useState<string[]>(['Ciment', 'Peinture', 'Vis et Boulons', 'Outils']);
  const [newCategory, setNewCategory] = useState('');

  // Step 4: Preferences
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      if (!storeName || !ownerName || !phone || !country || !city) {
        toast({
          title: 'Informations manquantes',
          description: 'Veuillez remplir tous les champs obligatoires',
          variant: 'destructive',
        });
        return;
      }
    }
    if (step === 2) {
      const hasValidLocation = locations.some(loc => loc.name && loc.city);
      if (!hasValidLocation) {
        toast({
          title: 'Informations manquantes',
          description: 'Veuillez ajouter au moins un magasin avec un nom et une ville',
          variant: 'destructive',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const addLocation = () => {
    setLocationsState([...locations, { name: '', address: '', city: '', phone: '' }]);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocationsState(locations.filter((_, i) => i !== index));
    }
  };

  const updateLocation = (index: number, field: string, value: string) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocationsState(updated);
  };

  const addCategory = () => {
    if (newCategory && !customCategories.includes(newCategory)) {
      setCustomCategories([...customCategories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setCustomCategories(customCategories.filter(c => c !== category));
  };

  const handleComplete = async () => {
    if (!storeName || !ownerName || !phone || !country || !city) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const tenantData = {
      name: storeName,
      owner: ownerName,
      phone,
      country,
      city,
      currency,
      lowStockThreshold,
      notificationsEnabled,
    };

    try {
      const { data: tenant, error } = await api.tenants.create(tenantData);

      if (error) {
        toast({
          title: 'Erreur',
          description: error,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!tenant?.id) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le tenant',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem('tenantId', tenant.id);

      const userId = localStorage.getItem('userId');
      if (userId) {
        await api.auth.setUserTenant(userId, tenant.id);
      }

      for (const catName of customCategories) {
        const { error: catError } = await api.categories.create({
          name: catName,
          tenantId: tenant.id,
        });
        if (catError) {
          console.error('Failed to create category:', catError);
        }
      }

      const newStore: StoreType = {
        id: tenant.id,
        name: storeName,
        owner: ownerName,
        phone,
        country,
        city,
        currency,
        lowStockThreshold,
        notificationsEnabled,
        createdAt: new Date(),
      };

      const newLocations: Location[] = locations
        .filter(loc => loc.name && loc.city)
        .map((loc, index) => ({
          id: (index + 1).toString(),
          storeId: newStore.id,
          name: loc.name,
          address: loc.address,
          city: loc.city,
          phone: loc.phone,
          isMain: index === 0,
          createdAt: new Date(),
        }));

      const newCategories: Category[] = customCategories.map((name, index) => ({
        id: (index + 1).toString(),
        storeId: newStore.id,
        name,
      }));

      setStore(newStore);
      setLocations(newLocations);
      setCurrentLocation(newLocations[0] || null);
      setCategories(newCategories);
      setIsOnboarded(true);

      toast({
        title: 'Configuration terminée !',
        description: 'Bienvenue dans votre tableau de bord',
      });

      router.push('/dashboard');
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Configuration de votre quincaillerie</h1>
          <p className="text-muted-foreground">Étape {step} sur {totalSteps}</p>
        </div>

        <Progress value={progress} className="mb-8" />

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Informations de la quincaillerie</CardTitle>
                    <CardDescription>Renseignez les détails de votre entreprise</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Nom de la quincaillerie *</FieldLabel>
                    <Input
                      placeholder="Quincaillerie Moderne"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Nom du propriétaire *</FieldLabel>
                    <Input
                      placeholder="Jean Dupont"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Téléphone *</FieldLabel>
                    <Input
                      placeholder="+225 01 23 45 67 89"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Pays *</FieldLabel>
                      <Input
                        placeholder="Côte d'Ivoire"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Ville *</FieldLabel>
                      <Input
                        placeholder="Abidjan"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Devise</FieldLabel>
                    <Select value={currency} onValueChange={setCurrency}>
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
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Magasins / Sites</CardTitle>
                    <CardDescription>Ajoutez vos différents points de vente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {index === 0 ? 'Magasin Principal' : `Magasin ${index + 1}`}
                        </span>
                        {index === 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Nom du magasin *</FieldLabel>
                          <Input
                            placeholder="Ex: Annexe Nord"
                            value={location.name}
                            onChange={(e) => updateLocation(index, 'name', e.target.value)}
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Ville *</FieldLabel>
                          <Input
                            placeholder="Ex: Abidjan"
                            value={location.city}
                            onChange={(e) => updateLocation(index, 'city', e.target.value)}
                          />
                        </Field>
                      </FieldGroup>
                    </div>

                    <FieldGroup>
                      <Field>
                        <FieldLabel>Adresse</FieldLabel>
                        <Input
                          placeholder="Ex: Boulevard de la République"
                          value={location.address}
                          onChange={(e) => updateLocation(index, 'address', e.target.value)}
                        />
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field>
                        <FieldLabel>Téléphone</FieldLabel>
                        <Input
                          placeholder="+225 01 23 45 67 89"
                          value={location.phone}
                          onChange={(e) => updateLocation(index, 'phone', e.target.value)}
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addLocation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un magasin
                </Button>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Catégories de produits</CardTitle>
                    <CardDescription>Organisez vos produits par catégories</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle catégorie..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                  <Button onClick={addCategory} type="button">
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-2">
                  {customCategories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <span className="font-medium">{category}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>

                {customCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Ajoutez au moins une catégorie pour continuer
                  </p>
                )}
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>Configurez les paramètres par défaut</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Seuil d&apos;alerte de stock faible</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Vous serez alerté quand un produit atteint ce seuil
                    </p>
                  </Field>
                </FieldGroup>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Activer les notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des alertes pour les stocks faibles
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">Prêt à commencer !</p>
                      <p className="text-sm text-muted-foreground">
                        Vous pourrez modifier ces paramètres à tout moment depuis les paramètres.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardContent className="border-t pt-6">
            <div className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              ) : (
                <div></div>
              )}

              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? 'Configuration...' : 'Accéder à mon dashboard'}
                  {!isLoading && <CheckCircle2 className="h-4 w-4 ml-2" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

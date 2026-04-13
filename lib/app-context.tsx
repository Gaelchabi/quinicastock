'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Store, User, Product, Category, Sale, Supplier, Location } from './mock-data';
import { mockProducts, mockCategories, mockSales, mockSuppliers, mockLocations } from './mock-data';

interface AppContextType {
  user: User | null;
  store: Store | null;
  products: Product[];
  categories: Category[];
  sales: Sale[];
  suppliers: Supplier[];
  locations: Location[];
  currentLocation: Location | null;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setStore: (store: Store | null) => void;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSales: (sales: Sale[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setLocations: (locations: Location[]) => void;
  setCurrentLocation: (location: Location | null) => void;
  setIsOnboarded: (value: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(mockLocations[0] || null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers([...suppliers, supplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addLocation = (location: Location) => {
    setLocations([...locations, location]);
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setLocations(locations.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        store,
        products,
        categories,
        sales,
        suppliers,
        locations,
        currentLocation,
        isOnboarded,
        setUser,
        setStore,
        setProducts,
        setCategories,
        setSales,
        setSuppliers,
        setLocations,
        setCurrentLocation,
        setIsOnboarded,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addLocation,
        updateLocation,
        deleteLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

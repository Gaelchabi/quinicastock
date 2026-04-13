export interface Location {
  id: string;
  storeId: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  isMain: boolean;
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  owner: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  lowStockThreshold: number;
  notificationsEnabled: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  quantity: number;
  price: number;
  lowStockThreshold?: number;
  unit?: string;
  description?: string;
}

export interface Sale {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  storeId?: string;
}

export interface Supplier {
  id: string;
  storeId: string;
  name: string;
  contact: string;
  phone: string;
  email?: string;
  address?: string;
  products?: string[];
}

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', storeId: 'default', name: 'Ciment', description: 'Ciment et matériaux de construction' },
  { id: '2', storeId: 'default', name: 'Peinture', description: 'Peintures et vernis' },
  { id: '3', storeId: 'default', name: 'Vis et Boulons', description: 'Quincaillerie visserie' },
  { id: '4', storeId: 'default', name: 'Outils', description: 'Outils manuels et électriques' },
  { id: '5', storeId: 'default', name: 'Plomberie', description: 'Tuyaux et raccords' },
];

// Mock products
export const mockProducts: Product[] = [
  { id: '1', storeId: 'default', categoryId: '1', name: 'Ciment Portland 50kg', quantity: 150, price: 5500, unit: 'sac', lowStockThreshold: 20 },
  { id: '2', storeId: 'default', categoryId: '1', name: 'Ciment Blanc 25kg', quantity: 8, price: 4000, unit: 'sac', lowStockThreshold: 10 },
  { id: '3', storeId: 'default', categoryId: '2', name: 'Peinture Murale Blanche 5L', quantity: 45, price: 12000, unit: 'bidon', lowStockThreshold: 15 },
  { id: '4', storeId: 'default', categoryId: '2', name: 'Vernis Bois 1L', quantity: 0, price: 3500, unit: 'bidon', lowStockThreshold: 5 },
  { id: '5', storeId: 'default', categoryId: '3', name: 'Vis acier 4x40mm (boîte)', quantity: 200, price: 800, unit: 'boîte', lowStockThreshold: 30 },
  { id: '6', storeId: 'default', categoryId: '3', name: 'Boulons M10x50 (lot 10)', quantity: 3, price: 1200, unit: 'lot', lowStockThreshold: 10 },
  { id: '7', storeId: 'default', categoryId: '4', name: 'Marteau de menuisier', quantity: 22, price: 2500, unit: 'pièce', lowStockThreshold: 5 },
  { id: '8', storeId: 'default', categoryId: '4', name: 'Perceuse sans fil', quantity: 5, price: 45000, unit: 'pièce', lowStockThreshold: 3 },
  { id: '9', storeId: 'default', categoryId: '5', name: 'Tuyau PVC 32mm (6m)', quantity: 35, price: 4500, unit: 'barre', lowStockThreshold: 10 },
  { id: '10', storeId: 'default', categoryId: '5', name: 'Coude PVC 90° 32mm', quantity: 120, price: 250, unit: 'pièce', lowStockThreshold: 20 },
];

// Mock sales
export const mockSales: Sale[] = [
  { id: '1', storeId: 'default', productId: '1', quantity: 5, totalPrice: 27500, date: new Date() },
  { id: '2', storeId: 'default', productId: '3', quantity: 2, totalPrice: 24000, date: new Date() },
  { id: '3', storeId: 'default', productId: '7', quantity: 1, totalPrice: 2500, date: new Date() },
  { id: '4', storeId: 'default', productId: '9', quantity: 3, totalPrice: 13500, date: new Date() },
  { id: '5', storeId: 'default', productId: '1', quantity: 10, totalPrice: 55000, date: new Date(Date.now() - 86400000) },
  { id: '6', storeId: 'default', productId: '5', quantity: 15, totalPrice: 12000, date: new Date(Date.now() - 86400000) },
  { id: '7', storeId: 'default', productId: '8', quantity: 1, totalPrice: 45000, date: new Date(Date.now() - 172800000) },
  { id: '8', storeId: 'default', productId: '3', quantity: 4, totalPrice: 48000, date: new Date(Date.now() - 172800000) },
];

// Mock locations
export const mockLocations: Location[] = [
  {
    id: '1',
    storeId: 'default',
    name: 'Magasin Principal',
    address: 'Boulevard de la République',
    city: 'Dakar',
    phone: '+221 33 123 4567',
    isMain: true,
    createdAt: new Date(),
  },
];

// Mock suppliers
export const mockSuppliers: Supplier[] = [
  { 
    id: '1', 
    storeId: 'default', 
    name: 'Ciments d\'Afrique', 
    contact: 'Mohamed Diallo',
    phone: '+221 77 123 4567',
    email: 'contact@cimentsafrique.com',
    address: 'Zone industrielle, Dakar',
    products: ['Ciment Portland', 'Ciment Blanc']
  },
  { 
    id: '2', 
    storeId: 'default', 
    name: 'Peintures Modernes SARL', 
    contact: 'Aminata Sow',
    phone: '+221 78 234 5678',
    email: 'info@peinturesmodernes.sn',
    address: 'Boulevard du Centenaire, Dakar',
    products: ['Peintures', 'Vernis']
  },
  { 
    id: '3', 
    storeId: 'default', 
    name: 'Quincaillerie Import-Export', 
    contact: 'Ibrahima Kane',
    phone: '+221 70 345 6789',
    email: 'qie@import.sn',
    address: 'Marché Sandaga, Dakar',
    products: ['Vis', 'Boulons', 'Outils']
  },
  { 
    id: '4', 
    storeId: 'default', 
    name: 'Plomberie et Sanitaire', 
    contact: 'Fatou Ndiaye',
    phone: '+221 76 456 7890',
    email: 'plomberie.sanitaire@gmail.com',
    address: 'Rue 10, Rufisque',
    products: ['Tuyaux PVC', 'Raccords']
  },
];

export function getProductStatus(product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (product.quantity === 0) return 'out-of-stock';
  const threshold = product.lowStockThreshold || 10;
  if (product.quantity <= threshold) return 'low-stock';
  return 'in-stock';
}

export function getTodaysSales(sales: Sale[]): Sale[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
}

export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
}

export function formatCurrency(amount: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

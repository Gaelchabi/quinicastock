const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      fetchApi<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    
    login: (email: string, password: string) =>
      fetchApi<{ token: string; userId: string; tenantId: string; role: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  tenants: {
    create: (data: {
      name: string;
      owner: string;
      phone: string;
      country: string;
      city: string;
      currency: string;
      lowStockThreshold?: number;
      notificationsEnabled?: boolean;
    }) =>
      fetchApi<any>('/tenants', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    get: (id: string) =>
      fetchApi<any>(`/tenants/${id}`),
  },

  products: {
    list: (tenantId: string) =>
      fetchApi<any[]>(`/inventory/products?tenantId=${tenantId}`),
    
    create: (data: any) =>
      fetchApi<any>('/inventory/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      fetchApi<any>(`/inventory/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/inventory/products/${id}`, {
        method: 'DELETE',
      }),
  },

  categories: {
    list: (tenantId: string) =>
      fetchApi<any[]>(`/inventory/categories?tenantId=${tenantId}`),
    
    create: (data: any) =>
      fetchApi<any>('/inventory/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/inventory/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  sales: {
    list: (tenantId: string) =>
      fetchApi<any[]>(`/inventory/sales?tenantId=${tenantId}`),
    
    create: (data: any) =>
      fetchApi<any>('/inventory/sales', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  suppliers: {
    list: (tenantId: string) =>
      fetchApi<any[]>(`/inventory/suppliers?tenantId=${tenantId}`),
    
    create: (data: any) =>
      fetchApi<any>('/inventory/suppliers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/inventory/suppliers/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default api;
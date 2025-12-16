const API = import.meta.env.VITE_API_URL as string;

export type User = {
  id: number;
  role: 'seller' | 'client';
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type Item = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
};

export type SellerItem = Item & { seller_id: number };

export type SellerOrder = {
  id: number;
  item_id: number;
  seller_id: number;
  client_id: number;
  qty: number;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  created_at: string;
  item_name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

async function request<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...opts, headers });

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === 'object' && data?.error ? data.error : 'Error de API';
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  // Public
  health: () => request<{ ok: boolean }>('/api/health'),
  getCatalog: () => request<Item[]>('/api/items'),

  // Auth
  register: (payload: { role: User['role']; name: string; email: string; password: string; phone?: string; address?: string }) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Seller
  sellerGetItems: (token: string) => request<SellerItem[]>('/api/seller/items', {}, token),

  sellerCreateItem: (token: string, payload: { name: string; description?: string; price: number; stock: number }) =>
    request<SellerItem>('/api/items', { method: 'POST', body: JSON.stringify(payload) }, token),

  sellerGetOrders: (token: string) => request<SellerOrder[]>('/api/seller/orders', {}, token),

  // Client
  clientCreateOrder: (token: string, payload: { item_id: number; qty: number }) =>
    request<{ ok: true; order_id: number }>('/api/orders', { method: 'POST', body: JSON.stringify(payload) }, token)
};

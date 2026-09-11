import { IUser, IProduct, ICategory, IOrder, IDelivery, IDashboardStats } from '../types.ts';

const TOKEN_KEY = 'grocery_jwt_token';
const USER_KEY = 'grocery_current_user';

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeStoredToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = (): IUser | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: IUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Generic fetch wrapper with JWT Authorization header
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: async (arg1: { email: string; password: string } | string, arg2?: string) => {
    let email = '';
    let password = '';
    if (typeof arg1 === 'object') {
      email = arg1.email;
      password = arg1.password;
    } else {
      email = arg1;
      password = arg2 || '';
    }

    const res = await request<{ success: boolean; token: string; user: IUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  getCurrentUser: async (): Promise<{ success: boolean; user: IUser | null }> => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    // If no token exists, user is simply not logged in
    if (!token) {
      if (storedUser) removeStoredUser();
      return { success: true, user: null };
    }

    try {
      const res = await request<{ success: boolean; user: IUser }>('/api/auth/me');
      if (res.user) {
        setStoredUser(res.user);
      }
      return res;
    } catch {
      // Invalidate stale or expired session credentials
      removeStoredToken();
      removeStoredUser();
      return { success: false, user: null };
    }
  },

  register: async (userData: { name: string; email: string; phone: string; password: string; role?: string; address?: string; vehicle?: string }) => {
    const res = await request<{ success: boolean; token: string; user: IUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  getMe: async () => {
    return request<{ success: boolean; user: IUser }>('/api/auth/me');
  },

  getUsers: async (role?: string) => {
    const q = role ? `?role=${role}` : '';
    return request<{ success: boolean; count: number; users: IUser[] }>(`/api/auth/users${q}`);
  },

  updateProfile: async (data: Partial<IUser>) => {
    const res = await request<{ success: boolean; user: IUser }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (res.user) setStoredUser(res.user);
    return res;
  },

  logout: () => {
    removeStoredToken();
    removeStoredUser();
  },

  // Products
  getProducts: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request<{ success: boolean; count: number; products: IProduct[] }>(`/api/products${queryStr}`);
  },

  getProductById: async (id: string) => {
    return request<{ success: boolean; product: IProduct }>(`/api/products/${id}`);
  },

  createProduct: async (productData: Partial<IProduct>) => {
    return request<{ success: boolean; product: IProduct; message: string }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct: async (id: string, productData: Partial<IProduct>) => {
    return request<{ success: boolean; product: IProduct; message: string }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  getCategories: async () => {
    return request<{ success: boolean; categories: ICategory[] }>('/api/products/categories');
  },

  createCategory: async (categoryData: { name: string; icon?: string; description?: string }) => {
    return request<{ success: boolean; category: ICategory }>('/api/products/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  // Orders
  createOrder: async (orderData: {
    products: Array<{ productId: string; name: string; price: number; quantity: number; image: string; unit: string }>;
    address: string;
    customerLocation?: { lat: number; lng: number };
    paymentMethod: string;
    notes?: string;
  }) => {
    return request<{ success: boolean; message: string; order: IOrder }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getMyOrders: async () => {
    return request<{ success: boolean; count: number; orders: IOrder[] }>('/api/orders/my-orders');
  },

  getAllOrders: async (status?: string) => {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ success: boolean; count: number; orders: IOrder[] }>(`/api/orders/all${q}`);
  },

  getOrderById: async (id: string) => {
    return request<{ success: boolean; order: IOrder; delivery?: IDelivery }>(`/api/orders/${id}`);
  },

  updateOrderStatus: async (id: string, status: string) => {
    return request<{ success: boolean; message: string; order: IOrder }>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  assignDeliveryPartner: async (id: string, deliveryPartnerId: string) => {
    return request<{ success: boolean; message: string; order: IOrder; delivery?: IDelivery }>(`/api/orders/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ deliveryPartnerId })
    });
  },

  getStats: async () => {
    return request<{ success: boolean; stats: IDashboardStats }>('/api/orders/stats');
  },

  // Deliveries
  getAssignedOrders: async () => {
    return request<{ success: boolean; count: number; orders: Array<IOrder & { delivery?: IDelivery }> }>('/api/deliveries/assigned');
  },

  updateDeliveryLocation: async (locationData: {
    orderId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
  }) => {
    return request<{ success: boolean; message: string; delivery: IDelivery }>('/api/deliveries/location', {
      method: 'POST',
      body: JSON.stringify(locationData)
    });
  },

  updateDeliveryStatus: async (data: { orderId: string; deliveryStatus: string; orderStatus?: string }) => {
    return request<{ success: boolean; message: string; delivery: IDelivery }>('/api/deliveries/status', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getDeliveryTracking: async (orderId: string) => {
    return request<{ success: boolean; delivery: IDelivery }>(`/api/deliveries/track/${orderId}`);
  }
};

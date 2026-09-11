export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'delivery' | 'admin';
  address?: string;
  vehicle?: string;
  createdAt?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  description: string;
  isPopular?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Order Confirmed' 
  | 'Order Packed' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface IOrder {
  _id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  products: IOrderItem[];
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  address: string;
  customerLocation: {
    lat: number;
    lng: number;
  };
  storeLocation: {
    lat: number;
    lng: number;
    name: string;
    address: string;
  };
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  paymentMethod: 'COD' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDelivery {
  _id: string;
  orderId: string;
  deliveryPartnerId: string;
  deliveryPartnerName: string;
  deliveryPartnerPhone: string;
  vehicleNumber: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  status: 'Assigned' | 'Accepted' | 'Picked Up' | 'In Transit' | 'Arrived' | 'Delivered';
  locationHistory: Array<{
    lat: number;
    lng: number;
    timestamp: string;
  }>;
  updatedAt: string;
}

export interface IDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalDeliveryPartners: number;
}

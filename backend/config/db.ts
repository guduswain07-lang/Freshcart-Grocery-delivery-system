/**
 * Database configuration & In-Memory / MongoDB Store
 * For college project MERN: supports in-memory document persistence with initial seed data,
 * and seamlessly connects to MongoDB if MONGODB_URI is provided.
 */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'delivery' | 'admin';
  address?: string;
  vehicle?: string;
  createdAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number; // in stock
  unit: string; // e.g. "1 kg", "500g", "1 L"
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

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

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
  status: 'Order Placed' | 'Order Confirmed' | 'Order Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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

// In-Memory Database Store
class GroceryDatabase {
  users: IUser[] = [];
  products: IProduct[] = [];
  categories: ICategory[] = [];
  orders: IOrder[] = [];
  deliveries: IDelivery[] = [];

  constructor() {
    this.seedDatabase();
  }

  seedDatabase() {
    // Seed Categories
    this.categories = [
      { _id: 'cat_1', name: 'Fruits & Vegetables', icon: 'Apple', description: 'Farm fresh organic fruits and crisp vegetables' },
      { _id: 'cat_2', name: 'Dairy & Bakery', icon: 'Milk', description: 'Fresh milk, artisanal breads, butter & cheese' },
      { _id: 'cat_3', name: 'Snacks & Beverages', icon: 'Coffee', description: 'Cold drinks, chips, healthy nuts & juices' },
      { _id: 'cat_4', name: 'Cooking Staples', icon: 'Wheat', description: 'Rice, wheat flour, spices, pulses & oils' },
      { _id: 'cat_5', name: 'Personal Care', icon: 'Sparkles', description: 'Soaps, hygiene, and daily body essentials' },
    ];

    // Seed Users
    this.users = [
      {
        _id: 'usr_customer_1',
        name: 'Rahul Sharma',
        email: 'customer@freshcart.com',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'customer',
        address: '402, Sunshine Heights, 12th Main Road, Indiranagar, Bangalore',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        _id: 'usr_delivery_1',
        name: 'Vikram Singh',
        email: 'rider@freshcart.com',
        phone: '+91 91234 56789',
        password: 'password123',
        role: 'delivery',
        vehicle: 'Honda Activa 6G (KA 01 AB 7890)',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        _id: 'usr_delivery_2',
        name: 'Vikram Singh (Courier)',
        email: 'delivery@freshcart.com',
        phone: '+91 91234 56789',
        password: 'password123',
        role: 'delivery',
        vehicle: 'Honda Activa 6G (KA 01 AB 7890)',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        _id: 'usr_delivery_3',
        name: 'Amit Kumar',
        email: 'amit@freshcart.com',
        phone: '+91 94567 12345',
        password: 'password123',
        role: 'delivery',
        vehicle: 'TVS Jupiter (KA 04 XY 4321)',
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
      },
      {
        _id: 'usr_admin_1',
        name: 'Priya Patel (Store Manager)',
        email: 'admin@freshcart.com',
        phone: '+91 99887 76655',
        password: 'password123',
        role: 'admin',
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
      }
    ];

    // Seed Products
    this.products = [
      {
        _id: 'prod_1',
        name: 'Fresh Shimla Apples',
        category: 'Fruits & Vegetables',
        price: 140,
        quantity: 50,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
        description: 'Crisp, sweet and juicy red apples sourced directly from Himachal Pradesh orchards.',
        isPopular: true
      },
      {
        _id: 'prod_2',
        name: 'Organic Robusta Bananas',
        category: 'Fruits & Vegetables',
        price: 45,
        quantity: 80,
        unit: '1 kg (6-8 pcs)',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
        description: 'Naturally ripened, nutrient-dense organic bananas rich in potassium and energy.',
        isPopular: true
      },
      {
        _id: 'prod_3',
        name: 'Hydroponic Baby Spinach',
        category: 'Fruits & Vegetables',
        price: 60,
        quantity: 35,
        unit: '250 g',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
        description: 'Tender, pesticide-free fresh baby spinach leaves, pre-washed and ready to toss.',
        isPopular: false
      },
      {
        _id: 'prod_4',
        name: 'Vine-Ripened Hybrid Tomatoes',
        category: 'Fruits & Vegetables',
        price: 35,
        quantity: 120,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        description: 'Firm, tangy and vibrant red tomatoes perfect for curries, salads and sauces.',
        isPopular: true
      },
      {
        _id: 'prod_5',
        name: 'Farm Fresh Whole Milk',
        category: 'Dairy & Bakery',
        price: 34,
        quantity: 60,
        unit: '500 ml',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
        description: 'Pure, pasteurized whole cow milk with 4.5% natural fat content and rich creaminess.',
        isPopular: true
      },
      {
        _id: 'prod_6',
        name: 'Artisan Whole Wheat Sourdough Bread',
        category: 'Dairy & Bakery',
        price: 90,
        quantity: 25,
        unit: '400 g',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        description: 'Slow-fermented artisan loaf baked with 100% stoneground whole wheat flour.',
        isPopular: false
      },
      {
        _id: 'prod_7',
        name: 'Greek Natural Yogurt Tub',
        category: 'Dairy & Bakery',
        price: 110,
        quantity: 40,
        unit: '400 g',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
        description: 'Thick, creamy strained Greek yogurt packed with high probiotic cultures and protein.',
        isPopular: true
      },
      {
        _id: 'prod_8',
        name: 'Salted Dairy Table Butter',
        category: 'Dairy & Bakery',
        price: 60,
        quantity: 75,
        unit: '100 g',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
        description: 'Traditional churned butter with the perfect touch of sea salt for toasts and baking.',
        isPopular: false
      },
      {
        _id: 'prod_9',
        name: 'Raw California Almonds',
        category: 'Snacks & Beverages',
        price: 240,
        quantity: 50,
        unit: '250 g',
        image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
        description: 'Premium jumbo California almonds, unroasted and preservative-free for healthy snacking.',
        isPopular: true
      },
      {
        _id: 'prod_10',
        name: 'Cold-Pressed Valencia Orange Juice',
        category: 'Snacks & Beverages',
        price: 120,
        quantity: 30,
        unit: '500 ml',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
        description: '100% pure squeezed oranges with juicy pulp. Zero added sugar and no preservatives.',
        isPopular: true
      },
      {
        _id: 'prod_11',
        name: 'Japanese Organic Green Tea',
        category: 'Snacks & Beverages',
        price: 195,
        quantity: 45,
        unit: '100 g (50 bags)',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        description: 'Antioxidant-rich Sencha green tea leaves with a soothing floral aroma.',
        isPopular: false
      },
      {
        _id: 'prod_12',
        name: 'Royal Aged Basmati Rice',
        category: 'Cooking Staples',
        price: 185,
        quantity: 90,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        description: 'Extra long grain aged basmati rice known for its delicate fragrance and non-sticky fluffiness.',
        isPopular: true
      },
      {
        _id: 'prod_13',
        name: 'Extra Virgin Olive Oil',
        category: 'Cooking Staples',
        price: 450,
        quantity: 30,
        unit: '500 ml',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        description: 'Cold-extracted Spanish olive oil with rich polyphenol flavor, ideal for salads and light cooking.',
        isPopular: false
      },
      {
        _id: 'prod_14',
        name: 'Organic Toor Dal (Pigeon Peas)',
        category: 'Cooking Staples',
        price: 135,
        quantity: 65,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1585994424754-04ef96d66e76?w=600&auto=format&fit=crop&q=80',
        description: 'Unpolished protein-rich toor dal without synthetic colors or moisture polishing.',
        isPopular: false
      }
    ];

    // Seed Active Order & Initial Delivery Tracking
    const defaultStoreCoords = { lat: 12.9716, lng: 77.5946, name: 'FreshCart Central Hub', address: 'MG Road Hub, Central Bangalore' };
    const defaultCustomerCoords = { lat: 12.9610, lng: 77.6380 }; // Indiranagar Bangalore
    const initialRiderCoords = { lat: 12.9665, lng: 77.6140 }; // En-route halfway

    const demoOrderId = 'ord_live_demo_101';
    this.orders = [
      {
        _id: demoOrderId,
        userId: 'usr_customer_1',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        products: [
          { productId: 'prod_1', name: 'Fresh Shimla Apples', price: 140, quantity: 1, image: this.products[0].image, unit: '1 kg' },
          { productId: 'prod_5', name: 'Farm Fresh Whole Milk', price: 34, quantity: 2, image: this.products[4].image, unit: '500 ml' },
          { productId: 'prod_10', name: 'Cold-Pressed Valencia Orange Juice', price: 120, quantity: 1, image: this.products[9].image, unit: '500 ml' }
        ],
        subtotal: 328,
        deliveryFee: 0,
        totalAmount: 328,
        address: '402, Sunshine Heights, 12th Main Road, Indiranagar, Bangalore - 560038',
        customerLocation: defaultCustomerCoords,
        storeLocation: defaultStoreCoords,
        status: 'Out for Delivery',
        deliveryPartnerId: 'usr_delivery_1',
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 91234 56789',
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        notes: 'Please ring bell twice. Deliver before 8 PM.',
        createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
      },
      {
        _id: 'ord_completed_99',
        userId: 'usr_customer_1',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        products: [
          { productId: 'prod_12', name: 'Royal Aged Basmati Rice', price: 185, quantity: 1, image: this.products[11].image, unit: '1 kg' },
          { productId: 'prod_14', name: 'Organic Toor Dal (Pigeon Peas)', price: 135, quantity: 1, image: this.products[13].image, unit: '1 kg' }
        ],
        subtotal: 320,
        deliveryFee: 20,
        totalAmount: 340,
        address: '402, Sunshine Heights, 12th Main Road, Indiranagar, Bangalore - 560038',
        customerLocation: defaultCustomerCoords,
        storeLocation: defaultStoreCoords,
        status: 'Delivered',
        deliveryPartnerId: 'usr_delivery_1',
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 91234 56789',
        paymentMethod: 'COD',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000 + 45 * 60000).toISOString()
      }
    ];

    // Seed Active Delivery
    this.deliveries = [
      {
        _id: 'del_active_101',
        orderId: demoOrderId,
        deliveryPartnerId: 'usr_delivery_1',
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 91234 56789',
        vehicleNumber: 'KA 01 AB 7890 (Activa)',
        latitude: initialRiderCoords.lat,
        longitude: initialRiderCoords.lng,
        heading: 75,
        speed: 28, // km/h
        status: 'In Transit',
        locationHistory: [
          { lat: defaultStoreCoords.lat, lng: defaultStoreCoords.lng, timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
          { lat: 12.9690, lng: 77.6040, timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
          { lat: initialRiderCoords.lat, lng: initialRiderCoords.lng, timestamp: new Date(Date.now() - 5 * 60000).toISOString() }
        ],
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

export const db = new GroceryDatabase();

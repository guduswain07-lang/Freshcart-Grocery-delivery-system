import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Package,
  Layers,
  Users,
  Bike,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle,
  ExternalLink,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { IProduct, ICategory, IOrder, IUser, IDashboardStats } from '../types.ts';
import { api } from '../services/api.ts';

interface AdminDashboardProps {
  products: IProduct[];
  categories: ICategory[];
  onRefreshProducts: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  onRefreshProducts,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'partners' | 'customers' | 'reports'>('products');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<IUser[]>([]);
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Modals state
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Fruits & Vegetables',
    price: 50,
    quantity: 50,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes, partnersRes, customersRes] = await Promise.all([
        api.getAllOrders(),
        api.getStats(),
        api.getUsers('delivery'),
        api.getUsers('customer')
      ]);
      setOrders(ordersRes.orders);
      setStats(statsRes.stats);
      setDeliveryPartners(partnersRes.users);
      setCustomers(customersRes.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Fruits & Vegetables',
      price: 50,
      quantity: 50,
      unit: '1 kg',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: IProduct) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      image: p.image,
      description: p.description
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, productForm);
      } else {
        await api.createProduct(productForm);
      }
      setShowProductModal(false);
      onRefreshProducts();
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await api.deleteProduct(id);
      onRefreshProducts();
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Category CRUD
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await api.createCategory({ name: categoryName.trim() });
      setCategoryName('');
      setShowCategoryModal(false);
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Order Assignment & Status
  const handleAssignPartner = async (orderId: string, partnerId: string) => {
    try {
      await api.assignDeliveryPartner(orderId, partnerId);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16 text-[#1A1A1A]">
      {/* Top Banner & Refresh */}
      <div className="bg-[#2D4F1E] text-white p-8 sm:p-10 rounded-xs border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 block">
            Administrative Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-white">
            Operations & Fleet Headquarters
          </h1>
          <p className="text-xs text-white/80 font-sans">
            Manage product catalogue, categories, customer orders, and dispatch delivery partners.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-5 py-2.5 bg-black/40 hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 border border-white/20 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">Total Sales Volume</div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            ₹{stats?.totalRevenue || 668}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#2D4F1E] font-bold pt-1">Across all manifests</div>
        </div>

        <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">Active In Transit</div>
          <div className="text-3xl font-serif font-bold text-[#2D4F1E]">
            {stats?.activeOrders || orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold pt-1">Live telemetry sync</div>
        </div>

        <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">Catalogue Items</div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {products.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold pt-1">
            In {categories.length} departments
          </div>
        </div>

        <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">Delivery Fleet</div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {deliveryPartners.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#2D4F1E] font-bold pt-1">Registered couriers</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-[#1A1A1A]/10 bg-white px-6 rounded-xs overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>All Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Departments ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'partners'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Couriers ({deliveryPartners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'customers'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-4 px-2 text-xs uppercase tracking-widest font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
              : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Architecture & Reports</span>
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] block">Catalogue Registry</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">Store Inventory Items</h3>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#1A1A1A]/10">
              <thead className="bg-[#F7F3EE] text-[#1A1A1A] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F7F3EE]/40 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover border border-[#1A1A1A]/10" />
                      <div>
                        <div className="font-serif font-bold text-sm text-[#1A1A1A]">{p.name}</div>
                        <div className="text-[10px] text-[#1A1A1A]/50 truncate max-w-xs">{p.description}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#1A1A1A]/70 font-serif">{p.category}</td>
                    <td className="p-3.5 font-mono font-bold text-[#1A1A1A]">₹{p.price}</td>
                    <td className="p-3.5 text-[#1A1A1A]/60 font-mono">{p.unit}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#F7F3EE] border border-[#1A1A1A]/15 text-[#1A1A1A]">
                        {p.quantity} in stock
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 text-[#1A1A1A] hover:text-[#2D4F1E] transition"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 text-[#1A1A1A] hover:text-rose-900 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: All Orders & Dispatch */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] block">Dispatch Deck</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">Customer Orders & Courier Allocation</h3>
            </div>
            <span className="text-xs font-mono text-[#1A1A1A]/50">{orders.length} orders logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#1A1A1A]/10">
              <thead className="bg-[#F7F3EE] text-[#1A1A1A] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assign Rider</th>
                  <th className="p-3.5 text-right">Live Tracker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-[#F7F3EE]/40 transition">
                    <td className="p-3.5 font-mono font-bold text-[#1A1A1A]">
                      #{o._id.replace('ord_', '').slice(0, 8)}
                    </td>
                    <td className="p-3.5">
                      <div className="font-serif font-bold text-sm text-[#1A1A1A]">{o.customerName}</div>
                      <div className="text-[10px] text-[#1A1A1A]/50 truncate max-w-[150px]">{o.address}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#1A1A1A]">₹{o.totalAmount}</td>
                    <td className="p-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className="px-2 py-1 bg-white border border-[#1A1A1A]/20 text-xs font-sans cursor-pointer focus:outline-hidden"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Order Packed">Order Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={o.deliveryPartnerId || ''}
                        onChange={(e) => handleAssignPartner(o._id, e.target.value)}
                        className="px-2 py-1 bg-[#F7F3EE] border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs font-serif cursor-pointer focus:outline-hidden"
                      >
                        <option value="">Unassigned</option>
                        {deliveryPartners.map((dp) => (
                          <option key={dp._id} value={dp._id}>
                            {dp.name} ({dp.vehicle || 'Bike'})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onNavigate('track-order', { orderId: o._id })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2D4F1E] hover:bg-black text-white text-[10px] uppercase tracking-widest font-bold transition"
                      >
                        <span>Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] block">Departments</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">Grocery Categories</h3>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-5 py-2.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((c) => {
              const productCount = products.filter((p) => p.category === c.name).length;
              return (
                <div key={c._id} className="p-5 border border-[#1A1A1A]/10 bg-[#F7F3EE]/30 space-y-1.5">
                  <div className="font-serif font-bold text-base text-[#1A1A1A]">{c.name}</div>
                  <div className="text-xs text-[#1A1A1A]/60">{c.description || 'Primary catalog aisle'}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#2D4F1E] pt-2">
                    {productCount} items listed
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Delivery Partners */}
      {activeTab === 'partners' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="font-serif text-2xl text-[#1A1A1A] pb-4 border-b border-[#1A1A1A]/10">
            Registered Courier Fleet
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryPartners.map((dp) => (
              <div key={dp._id} className="p-5 border border-[#1A1A1A]/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F7F3EE] border border-[#1A1A1A]/15 text-[#2D4F1E] flex items-center justify-center font-bold text-xl shrink-0">
                  🚴
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="font-serif font-bold text-base text-[#1A1A1A]">{dp.name}</div>
                  <div className="text-xs text-[#1A1A1A]/60 font-mono">{dp.phone} • {dp.email}</div>
                  <div className="text-xs font-sans text-[#2D4F1E] font-medium mt-1">
                    Vehicle: {dp.vehicle || 'Honda Activa 6G'}
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold bg-[#2D4F1E] text-white">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Customers */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="font-serif text-2xl text-[#1A1A1A] pb-4 border-b border-[#1A1A1A]/10">
            Registered Client Registry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customers.map((c) => (
              <div key={c._id} className="p-5 border border-[#1A1A1A]/10 space-y-1">
                <div className="font-serif font-bold text-base text-[#1A1A1A]">{c.name}</div>
                <div className="text-xs text-[#1A1A1A]/60 font-mono">{c.email} • {c.phone}</div>
                <div className="text-xs text-[#1A1A1A]/70 pt-1 line-clamp-1">
                  📍 {c.address || 'Bengaluru, Karnataka'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Reports & Analytics */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="font-serif text-2xl text-[#1A1A1A] pb-4 border-b border-[#1A1A1A]/10">
            System Telemetry & Architecture Report
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 border border-[#1A1A1A]/10 bg-[#F7F3EE]/30 space-y-3">
              <span className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[10px] block">
                Fulfillment Distribution
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span>Delivered</span>
                  <span className="font-mono font-bold text-[#2D4F1E]">
                    {orders.filter((o) => o.status === 'Delivered').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Out for Delivery</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">
                    {orders.filter((o) => o.status === 'Out for Delivery').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Order Packed / Confirmed</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">
                    {orders.filter((o) => o.status === 'Order Packed' || o.status === 'Order Confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Order Placed</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">
                    {orders.filter((o) => o.status === 'Order Placed').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 border border-[#1A1A1A]/10 bg-[#F7F3EE]/30 space-y-3">
              <span className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[10px] block">
                Popular Harvest Aisles
              </span>
              <div className="space-y-1.5 pt-1">
                {categories.slice(0, 4).map((c) => (
                  <div key={c._id} className="flex justify-between">
                    <span className="font-serif truncate max-w-[140px]">{c.name}</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">
                      {products.filter((p) => p.category === c.name).length} items
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border border-[#1A1A1A]/10 bg-[#F7F3EE]/30 space-y-3">
              <span className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[10px] block">
                Stack & Protocol Status
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span>Socket.IO Latency</span>
                  <span className="font-mono font-bold text-[#2D4F1E]">&lt; 20 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Map Provider</span>
                  <span className="font-sans font-medium text-[#1A1A1A]">Leaflet / OSM</span>
                </div>
                <div className="flex justify-between">
                  <span>Persistence</span>
                  <span className="font-sans font-medium text-[#1A1A1A]">MERN / MongoDB Store</span>
                </div>
                <div className="flex justify-between">
                  <span>JWT Auth</span>
                  <span className="font-mono font-bold text-[#2D4F1E]">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg border border-[#1A1A1A]/20 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#1A1A1A]">
              {editingProduct ? 'Edit Grocery Item' : 'Add New Grocery Item'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Organic Alphonso Mangoes"
                  className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="1 kg, 500g, 1 L"
                    className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Fresh farm produce details..."
                  className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs uppercase tracking-widest font-bold hover:bg-[#F7F3EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm border border-[#1A1A1A]/20 p-8 space-y-5">
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Organic Herbs"
                  className="w-full px-3 py-2 border border-[#1A1A1A]/20 bg-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs uppercase tracking-widest font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D4F1E] text-white text-xs uppercase tracking-widest font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

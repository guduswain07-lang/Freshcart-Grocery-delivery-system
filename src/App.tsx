import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProjectDocsModal } from './components/ProjectDocsModal.tsx';

import { Home } from './pages/Home.tsx';
import { Products } from './pages/Products.tsx';
import { Cart } from './pages/Cart.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { Orders } from './pages/Orders.tsx';
import { TrackOrder } from './pages/TrackOrder.tsx';
import { DeliveryDashboard } from './pages/DeliveryDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';

import { IUser, IProduct, ICategory } from './types.ts';
import { api } from './services/api.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [activeView, setActiveView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({ orderId: 'ord_live_demo_101' });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('freshcart_cart');
      return saved ? JSON.parse(saved) : { 'prod_1': 2, 'prod_3': 1 };
    } catch {
      return { 'prod_1': 2, 'prod_3': 1 };
    }
  });
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshcart_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Load initial app data
  const loadInitialData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts().catch((err) => {
          console.warn('Failed to load products from API', err);
          return { success: false, count: 0, products: [] };
        }),
        api.getCategories().catch((err) => {
          console.warn('Failed to load categories from API', err);
          return { success: false, categories: [] };
        })
      ]);

      if (prodRes?.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
      }
      if (catRes?.categories && catRes.categories.length > 0) {
        setCategories(catRes.categories);
      }

      // Check current user session
      const userRes = await api.getCurrentUser().catch(() => ({ success: false, user: null }));
      if (userRes?.user) {
        setCurrentUser(userRes.user);
      } else {
        // Auto-authenticate as default demo customer so all features work out-of-the-box
        try {
          const demoLogin = await api.login({ email: 'customer@freshcart.com', password: 'password123' });
          setCurrentUser(demoLogin.user);
        } catch {
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to load initial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRefreshProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prodRes.products);
      setCategories(catRes.categories);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigate = (view: string, params?: Record<string, any>) => {
    setActiveView(view);
    if (params) setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch demo roles instantly for college presentation
  const handleRoleSwitch = async (role: 'customer' | 'delivery' | 'admin') => {
    const email =
      role === 'delivery'
        ? 'rider@freshcart.com'
        : role === 'admin'
        ? 'admin@freshcart.com'
        : 'customer@freshcart.com';

    try {
      const res = await api.login({ email, password: 'password123' });
      setCurrentUser(res.user);
      if (role === 'delivery') {
        handleNavigate('delivery-dashboard');
      } else if (role === 'admin') {
        handleNavigate('admin-dashboard');
      } else {
        handleNavigate('home');
      }
    } catch (err) {
      // Fallback for courier if needed
      if (role === 'delivery') {
        try {
          const fallbackRes = await api.login({ email: 'delivery@freshcart.com', password: 'password123' });
          setCurrentUser(fallbackRes.user);
          handleNavigate('delivery-dashboard');
          return;
        } catch (fbErr) {
          console.error('Courier fallback error', fbErr);
        }
      }
      console.error('Role switch error', err);
    }
  };

  const handleLoginSuccess = (user: IUser, token: string) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    handleNavigate('login');
  };

  // Cart operations
  const handleAddToCart = (product: IProduct) => {
    setCartItems((prev) => ({
      ...prev,
      [product._id]: (prev[product._id] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = quantity;
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems({});
  };

  const totalCartCount = (Object.values(cartItems) as number[]).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col text-[#1A1A1A] font-sans antialiased border-[6px] sm:border-[12px] border-white selection:bg-[#2D4F1E] selection:text-white">
      <Navbar
        currentUser={currentUser}
        cartCount={totalCartCount}
        activeView={activeView}
        onNavigate={handleNavigate}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
        onOpenDocs={() => setShowDocsModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 pb-16">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Initializing FreshCart Express...</p>
          </div>
        ) : (
          <>
            {activeView === 'home' && (
              <Home
                products={products}
                categories={categories}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'products' && (
              <Products
                products={products}
                categories={categories}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}

            {activeView === 'cart' && (
              <Cart
                products={products}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'checkout' && (
              <Checkout
                products={products}
                cartItems={cartItems}
                currentUser={currentUser}
                onClearCart={handleClearCart}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'orders' && (
              <Orders
                onTrackOrder={(orderId) => handleNavigate('track-order', { orderId })}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'track-order' && (
              <TrackOrder
                orderId={viewParams.orderId || 'ord_live_demo_101'}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'delivery-dashboard' && (
              <DeliveryDashboard
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'admin-dashboard' && (
              <AdminDashboard
                products={products}
                categories={categories}
                onRefreshProducts={handleRefreshProducts}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'login' && (
              <Login
                onLoginSuccess={handleLoginSuccess}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'register' && (
              <Register
                onRegisterSuccess={handleLoginSuccess}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      <Footer
        onOpenDocs={() => setShowDocsModal(true)}
        onNavigate={handleNavigate}
      />

      <ProjectDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
}

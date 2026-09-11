import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ShieldCheck,
  Bike,
  ArrowRight,
  TrendingUp,
  MapPin,
  Tag
} from 'lucide-react';
import { IProduct, ICategory } from '../types.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface HomeProps {
  products: IProduct[];
  categories: ICategory[];
  cartItems: Record<string, number>;
  onAddToCart: (product: IProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const Home: React.FC<HomeProps> = ({
  products,
  categories,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter(product => {
    const matchesCat = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16 text-[#1A1A1A]">
      {/* Editorial Hero Feature Section */}
      <div className="relative border border-[#1A1A1A]/10 bg-white overflow-hidden rounded-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Main Editorial Showcase */}
          <div className="lg:col-span-8 p-8 sm:p-14 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/10">
            {/* Tilted Backdrop Accent from Design HTML */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12 w-52 sm:w-64 h-64 sm:h-80 bg-[#E8E4DE] z-0 -rotate-2 pointer-events-none hidden sm:block" />

            <div className="relative z-10 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#2D4F1E] block">
                Daily Feature • Fresh Harvest 2026
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal leading-[0.88] tracking-tighter text-[#1A1A1A]">
                Artisanal <br />
                <span className="italic font-light">Daily Groceries,</span> <br />
                Live Dispatched.
              </h1>

              <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#1A1A1A]/80 font-sans">
                Hand-selected peak ripeness produce and pantry essentials. Watch your courier navigate real-time GPS coordinates directly to your residence via OpenStreetMap & Socket.IO.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('track-order', { orderId: 'ord_live_demo_101' })}
                  className="bg-[#2D4F1E] text-white px-7 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-black transition active:scale-95 flex items-center gap-2"
                >
                  <Bike className="w-4 h-4" />
                  Track Live Demo Order
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onNavigate('products')}
                  className="border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] px-6 py-3.5 text-xs uppercase tracking-widest font-bold transition"
                >
                  Browse Catalogue
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-[#1A1A1A]/10 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#2D4F1E]" /> Farm Direct
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1A1A1A]" /> 25-Min Dispatch
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#881337]" /> OpenStreetMap Sync
              </span>
            </div>
          </div>

          {/* Right Editorial Guarantee Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#2D4F1E] text-white p-8 sm:p-12">
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">
                Freshness Standard
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif leading-none tracking-tight font-normal">
                90 Minute <br />
                <span className="italic font-light">Threshold.</span>
              </h2>
              <p className="text-xs leading-relaxed text-white/80">
                Guaranteed harvest-to-doorstep speed with continuous telemetric monitoring and zero artificial preservation.
              </p>
            </div>

            <div className="pt-8 border-t border-white/20 space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                Featured Categories
              </p>
              <ul className="text-base font-serif italic space-y-1 text-white/90">
                <li>• Orchard Essentials</li>
                <li>• Greenhouse Greens</li>
                <li>• Dairy & Fermentation</li>
                <li>• Organic Grains & Bakery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[#1A1A1A]/10">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Search seasonal fruits, organic milk, farm bread..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E]"
            />
          </div>

          <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 flex items-center gap-1.5 self-end sm:self-center">
            <Tag className="w-3.5 h-3.5 text-[#2D4F1E]" />
            <span>Catalogue Items: {filteredProducts.length}</span>
          </div>
        </div>

        {/* Category Underline Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 text-[11px] uppercase tracking-widest font-bold">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`transition pb-1.5 whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            All Harvest
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`transition pb-1.5 whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E]'
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1A1A1A]/10">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl italic font-light tracking-tight text-[#1A1A1A]">
              {selectedCategory === 'All' ? 'Curated Market Selection' : selectedCategory}
            </h2>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D4F1E]">
              Fresh In Stock
            </span>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] hover:text-[#2D4F1E] flex items-center gap-1 transition"
          >
            Full Collection
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#1A1A1A]/10 p-12 text-center space-y-4">
            <p className="font-serif italic text-lg text-[#1A1A1A]/70">No produce found matching "{searchTerm}".</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-bold bg-[#2D4F1E] text-white hover:bg-black transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                cartQuantity={cartItems[product._id] || 0}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}
      </div>

      {/* College Project Architecture Highlight Banner */}
      <div className="bg-white border border-[#1A1A1A]/15 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E]">
            Final Year Project Architecture
          </div>
          <h3 className="text-2xl font-serif tracking-tight text-[#1A1A1A] font-normal">
            Real-Time GPS Order Tracking with Leaflet & Socket.IO
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Test the live delivery loop: place an order as a <b>Customer</b>, see it appear for the <b>Admin</b>, switch to <b>Delivery Partner</b> to simulate GPS movement, and watch the Leaflet bike marker glide along the route in real-time!
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('delivery-dashboard')}
            className="px-5 py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
          >
            <Bike className="w-4 h-4 text-[#2D4F1E]" />
            Courier Simulator
          </button>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="px-5 py-3 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Suite
          </button>
        </div>
      </div>
    </div>
  );
};

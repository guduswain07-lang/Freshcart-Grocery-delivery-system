import React from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Bike,
  ShieldAlert,
  BookOpen,
  LogOut,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { IUser } from '../types.ts';

interface NavbarProps {
  currentUser: IUser | null;
  cartCount: number;
  activeView: string;
  onNavigate: (view: string) => void;
  onRoleSwitch: (role: 'customer' | 'delivery' | 'admin') => void;
  onLogout: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  cartCount,
  activeView,
  onNavigate,
  onRoleSwitch,
  onLogout,
  onOpenDocs
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F7F3EE]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 text-[#1A1A1A]">
      {/* Top Banner: Quick Role Switcher for College Evaluation & Project Info */}
      <div className="bg-[#1A1A1A] text-white px-4 sm:px-8 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-2 border-b border-black/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D4F1E] ring-2 ring-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8E4DE] font-semibold hidden sm:inline">
              Role Switch:
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-sm border border-white/10">
            <button
              onClick={() => onRoleSwitch('customer')}
              className={`px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
                currentUser?.role === 'customer'
                  ? 'bg-[#2D4F1E] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>👤</span> Customer
            </button>
            <button
              onClick={() => onRoleSwitch('delivery')}
              className={`px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
                currentUser?.role === 'delivery'
                  ? 'bg-[#2D4F1E] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>🚴</span> Delivery
            </button>
            <button
              onClick={() => onRoleSwitch('admin')}
              className={`px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-[#2D4F1E] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>👨‍💼</span> Admin
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDocs}
            className="inline-flex items-center gap-1.5 text-xs text-[#E8E4DE] hover:text-white uppercase tracking-[0.2em] font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2D4F1E]" />
            <span className="border-b border-[#E8E4DE]/40 pb-0.5 text-[10px]">Project Architecture</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 bg-[#2D4F1E] text-white flex items-center justify-center transition group-hover:bg-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif italic text-2xl font-light tracking-tighter text-[#1A1A1A] leading-tight flex items-baseline gap-2">
                FreshCart
                <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold text-[#2D4F1E] not-italic">
                  Est. 2026
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/60">
                Fulfillment & Live Tracking v2.0
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-semibold">
            <button
              onClick={() => onNavigate('products')}
              className={`transition pb-1 ${
                activeView === 'products'
                  ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E] font-bold'
                  : 'opacity-50 hover:opacity-100 text-[#1A1A1A]'
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className={`transition pb-1 ${
                activeView === 'orders'
                  ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E] font-bold'
                  : 'opacity-50 hover:opacity-100 text-[#1A1A1A]'
              }`}
            >
              Order Tracking
            </button>
            {currentUser?.role === 'delivery' && (
              <button
                onClick={() => onNavigate('delivery-dashboard')}
                className={`transition pb-1 flex items-center gap-1.5 ${
                  activeView === 'delivery-dashboard'
                    ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E] font-bold'
                    : 'opacity-50 hover:opacity-100 text-[#1A1A1A]'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                Partner Portal
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`transition pb-1 flex items-center gap-1.5 ${
                  activeView === 'admin-dashboard'
                    ? 'border-b-2 border-[#2D4F1E] text-[#2D4F1E] font-bold'
                    : 'opacity-50 hover:opacity-100 text-[#1A1A1A]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Suite
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions: Cart & Profile */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative flex items-center gap-2.5 px-4 py-2.5 transition text-xs uppercase tracking-widest font-bold ${
              activeView === 'cart'
                ? 'bg-black text-white'
                : 'bg-[#2D4F1E] hover:bg-black text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Basket</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-white text-[#2D4F1E] text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Status */}
          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 border-l border-[#1A1A1A]/10">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-serif italic text-[#1A1A1A]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/50 font-bold">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-[#1A1A1A]/40 hover:text-rose-700 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs uppercase tracking-widest font-bold transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

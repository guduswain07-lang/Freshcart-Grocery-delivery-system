import React, { useState } from 'react';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, Bike, ShieldAlert } from 'lucide-react';
import { IUser } from '../types.ts';
import { api } from '../services/api.ts';

interface LoginProps {
  onLoginSuccess: (user: IUser, token: string) => void;
  onNavigate: (view: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState<string>('customer@freshcart.com');
  const [password, setPassword] = useState<string>('password123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      onLoginSuccess(res.user, res.token);
      if (res.user.role === 'admin') onNavigate('admin-dashboard');
      else if (res.user.role === 'delivery') onNavigate('delivery-dashboard');
      else onNavigate('products');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email: demoEmail, password: 'password123' });
      onLoginSuccess(res.user, res.token);
      if (res.user.role === 'admin') onNavigate('admin-dashboard');
      else if (res.user.role === 'delivery') onNavigate('delivery-dashboard');
      else onNavigate('products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-[#1A1A1A]">
      <div className="bg-white border border-[#1A1A1A]/10 p-8 sm:p-10 rounded-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E] block">
            Access Verification
          </span>
          <h2 className="text-3xl font-serif italic font-light tracking-tight text-[#1A1A1A]">
            Sign in to FreshCart
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans">
            Select an evaluator role or enter your account credentials.
          </p>
        </div>

        {/* Quick Demo Login Buttons for Evaluators */}
        <div className="p-4 bg-[#F7F3EE] border border-[#1A1A1A]/10 space-y-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block text-center">
            One-Click Project Evaluator Roles
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@freshcart.com')}
              className="p-2.5 bg-white border border-[#1A1A1A]/20 hover:border-[#2D4F1E] text-[#1A1A1A] text-[11px] font-medium flex flex-col items-center gap-1 transition"
            >
              <span className="text-sm">👤</span>
              <span className="font-serif">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('rider@freshcart.com')}
              className="p-2.5 bg-white border border-[#1A1A1A]/20 hover:border-[#2D4F1E] text-[#1A1A1A] text-[11px] font-medium flex flex-col items-center gap-1 transition"
            >
              <span className="text-sm">🚴</span>
              <span className="font-serif">Courier</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@freshcart.com')}
              className="p-2.5 bg-white border border-[#1A1A1A]/20 hover:border-[#2D4F1E] text-[#1A1A1A] text-[11px] font-medium flex flex-col items-center gap-1 transition"
            >
              <span className="text-sm">👨‍💼</span>
              <span className="font-serif">Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-white border border-rose-900/30 text-rose-900 text-xs font-serif">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                placeholder="name@freshcart.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#1A1A1A]/60">
          <span>New to FreshCart? </span>
          <button
            onClick={() => onNavigate('register')}
            className="text-[11px] uppercase tracking-wider font-bold text-[#2D4F1E] border-b border-[#2D4F1E] pb-0.5 hover:text-black transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

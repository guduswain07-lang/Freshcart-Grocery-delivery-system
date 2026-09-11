import React, { useState } from 'react';
import { ShoppingBag, Lock, Mail, User, Phone, MapPin, Bike, ArrowRight } from 'lucide-react';
import { IUser } from '../types.ts';
import { api } from '../services/api.ts';

interface RegisterProps {
  onRegisterSuccess: (user: IUser, token: string) => void;
  onNavigate: (view: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as 'customer' | 'delivery',
    address: 'Indiranagar, Bangalore',
    vehicle: 'Hero Electric Optima'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(formData);
      onRegisterSuccess(res.user, res.token);
      if (res.user.role === 'delivery') {
        onNavigate('delivery-dashboard');
      } else {
        onNavigate('products');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
            Member Enrollment
          </span>
          <h2 className="text-3xl font-serif italic font-light tracking-tight text-[#1A1A1A]">
            Create an Account
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans">
            Join FreshCart as a Customer or Verified Delivery Courier.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-white border border-rose-900/30 text-rose-900 text-xs font-serif">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Role selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Select Account Profile</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`py-2.5 px-3 border text-xs font-serif font-bold flex items-center justify-center gap-2 transition ${
                  formData.role === 'customer'
                    ? 'border-[#2D4F1E] bg-[#F7F3EE] text-[#2D4F1E]'
                    : 'border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:bg-[#F7F3EE]/50'
                }`}
              >
                <span>👤</span> Customer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'delivery' })}
                className={`py-2.5 px-3 border text-xs font-serif font-bold flex items-center justify-center gap-2 transition ${
                  formData.role === 'delivery'
                    ? 'border-[#2D4F1E] bg-[#F7F3EE] text-[#2D4F1E]'
                    : 'border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:bg-[#F7F3EE]/50'
                }`}
              >
                <span>🚴</span> Delivery Courier
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                placeholder="Rahul Sharma"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {formData.role === 'customer' ? (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Default Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#1A1A1A]/40" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                  placeholder="Area, Street, City"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">Vehicle Details</label>
              <div className="relative">
                <Bike className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] transition"
                  placeholder="e.g. Honda Activa / Electric Bike"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loading ? (
              <span>Registering Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#1A1A1A]/60">
          <span>Already have an account? </span>
          <button
            onClick={() => onNavigate('login')}
            className="text-[11px] uppercase tracking-wider font-bold text-[#2D4F1E] border-b border-[#2D4F1E] pb-0.5 hover:text-black transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

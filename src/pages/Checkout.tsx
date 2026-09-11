import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { IProduct, IUser } from '../types.ts';
import { api } from '../services/api.ts';

interface CheckoutProps {
  currentUser: IUser | null;
  products: IProduct[];
  cartItems: Record<string, number>;
  onClearCart: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  currentUser,
  products,
  cartItems,
  onClearCart,
  onNavigate
}) => {
  const [address, setAddress] = useState<string>(
    currentUser?.address || 'Flat 402, Willow Grove Apartments, 12th Main Road, Indiranagar, Bengaluru - 560038'
  );
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card'>('UPI');
  const [notes, setNotes] = useState<string>('Please ring the bell twice.');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const itemsInCart = (Object.entries(cartItems) as [string, number][])
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = products.find((p) => p._id === id);
      return { product, quantity: qty };
    })
    .filter((item): item is { product: IProduct; quantity: number } => Boolean(item.product));

  const subtotal = itemsInCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 300 || subtotal === 0 ? 0 : 25;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a complete delivery address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        products: itemsInCart.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
          unit: i.product.unit
        })),
        address,
        customerLocation: {
          lat: 12.9610 + (Math.random() - 0.5) * 0.02,
          lng: 77.6380 + (Math.random() - 0.5) * 0.02
        },
        paymentMethod,
        notes
      };

      const res = await api.createOrder(orderPayload);
      onClearCart();
      // Navigate to live tracking map for this newly placed order!
      onNavigate('track-order', { orderId: res.order._id });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 text-[#1A1A1A]">
      <div className="pb-4 border-b border-[#1A1A1A]/10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E] block">
          Dispatch Authorization
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-[#1A1A1A] mt-0.5">
          Checkout & Destination Details
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-white border border-rose-900/30 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <div className="bg-white border border-[#1A1A1A]/10 p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest pb-3 border-b border-[#1A1A1A]/10">
              <MapPin className="w-4 h-4 text-[#2D4F1E]" />
              <span>1. Delivery Destination</span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">
                Full Street Address
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat number, apartment building, street, landmark, city & pincode"
                className="w-full px-3.5 py-2.5 text-xs border border-[#1A1A1A]/20 bg-white focus:outline-hidden focus:border-[#2D4F1E] transition font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">
                  Recipient Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#1A1A1A]/20 bg-white focus:outline-hidden focus:border-[#2D4F1E] transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70 mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with guard / ring bell"
                  className="w-full px-3.5 py-2 text-xs border border-[#1A1A1A]/20 bg-white focus:outline-hidden focus:border-[#2D4F1E] transition font-sans"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-[#1A1A1A]/10 p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest pb-3 border-b border-[#1A1A1A]/10">
              <Banknote className="w-4 h-4 text-[#2D4F1E]" />
              <span>2. Settlement Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 border text-left transition flex flex-col gap-2 rounded-xs ${
                  paymentMethod === 'UPI'
                    ? 'border-[#2D4F1E] bg-[#F7F3EE]'
                    : 'border-[#1A1A1A]/15 hover:bg-[#F7F3EE]/50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#2D4F1E]" />
                <div>
                  <div className="text-xs font-serif font-bold text-[#1A1A1A]">UPI Instant</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">Google Pay, PhonePe, Paytm</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 border text-left transition flex flex-col gap-2 rounded-xs ${
                  paymentMethod === 'COD'
                    ? 'border-[#2D4F1E] bg-[#F7F3EE]'
                    : 'border-[#1A1A1A]/15 hover:bg-[#F7F3EE]/50'
                }`}
              >
                <Banknote className="w-4 h-4 text-[#2D4F1E]" />
                <div>
                  <div className="text-xs font-serif font-bold text-[#1A1A1A]">Cash on Delivery</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">Pay cash upon arrival</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 border text-left transition flex flex-col gap-2 rounded-xs ${
                  paymentMethod === 'Card'
                    ? 'border-[#2D4F1E] bg-[#F7F3EE]'
                    : 'border-[#1A1A1A]/15 hover:bg-[#F7F3EE]/50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#2D4F1E]" />
                <div>
                  <div className="text-xs font-serif font-bold text-[#1A1A1A]">Card / NetBanking</div>
                  <div className="text-[10px] text-[#1A1A1A]/60">Visa, Mastercard, RuPay</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#1A1A1A]/10 p-6 rounded-xs space-y-4 sticky top-28">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] pb-3 border-b border-[#1A1A1A]/10">
              Harvest Manifest
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-[#1A1A1A]/10">
              {itemsInCart.map(({ product, quantity }) => (
                <div key={product._id} className="pt-2.5 first:pt-0 flex justify-between text-xs">
                  <span className="text-[#1A1A1A]/80 font-serif truncate max-w-[140px]">
                    {product.name} <span className="font-mono text-[10px] text-[#1A1A1A]/50">×{quantity}</span>
                  </span>
                  <span className="font-mono font-bold text-[#1A1A1A]">₹{product.price * quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/10 space-y-2 text-xs text-[#1A1A1A]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#1A1A1A]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Courier</span>
                <span className="font-mono text-[#1A1A1A]">
                  {deliveryFee === 0 ? <b className="text-[#2D4F1E]">COMPLIMENTARY</b> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/10">
                <span>Total Due</span>
                <span className="text-[#2D4F1E]">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || itemsInCart.length === 0}
              className="w-full py-3.5 px-4 bg-[#2D4F1E] hover:bg-black disabled:opacity-50 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <span>Authorize & Track Live</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D4F1E]" />
              <span>Telemetry Connected</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Package, RefreshCw, ArrowRight } from 'lucide-react';
import { IOrder } from '../types.ts';
import { OrderCard } from '../components/OrderCard.tsx';
import { api } from '../services/api.ts';

interface OrdersProps {
  onTrackOrder: (orderId: string) => void;
  onNavigate: (view: string) => void;
}

export const Orders: React.FC<OrdersProps> = ({ onTrackOrder, onNavigate }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders();
      setOrders(res.orders);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-[#1A1A1A]">
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E] block">
            Customer Log
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-[#1A1A1A] mt-0.5">
            Order Manifests & History
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#1A1A1A]/20 text-xs font-serif uppercase tracking-wider text-[#1A1A1A] hover:bg-[#F7F3EE] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Log
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="bg-white border border-[#1A1A1A]/10 p-16 text-center font-serif italic text-sm text-[#1A1A1A]/60">
          Retrieving order manifests...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#1A1A1A]/10 p-12 text-center space-y-5 rounded-xs">
          <div className="w-14 h-14 bg-[#F7F3EE] border border-[#1A1A1A]/15 flex items-center justify-center mx-auto text-[#2D4F1E]">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif italic text-[#1A1A1A]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto font-sans leading-relaxed">
            Place your first farm-direct order and experience real-time delivery tracking across OpenStreetMap with live telemetry updates!
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition"
          >
            Explore Groceries Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onTrackOrder={onTrackOrder} />
          ))}
        </div>
      )}
    </div>
  );
};

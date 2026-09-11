import React from 'react';
import { Package, Clock, MapPin, Bike, ArrowRight, CheckCircle2 } from 'lucide-react';
import { IOrder } from '../types.ts';

interface OrderCardProps {
  order: IOrder;
  onTrackOrder: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onTrackOrder }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#2D4F1E] text-white';
      case 'Out for Delivery':
        return 'bg-[#1A1A1A] text-white animate-pulse';
      case 'Order Packed':
        return 'bg-[#E8E4DE] text-[#1A1A1A] border border-[#1A1A1A]/15';
      case 'Order Confirmed':
        return 'bg-[#F0EFED] text-[#1A1A1A] border border-[#1A1A1A]/15';
      case 'Cancelled':
        return 'bg-rose-900 text-white';
      default:
        return 'bg-[#F7F3EE] text-[#1A1A1A] border border-[#1A1A1A]/20';
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 transition p-6 flex flex-col gap-4 rounded-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#1A1A1A]">
              #{order._id.replace('ord_', '').slice(0, 10).toUpperCase()}
            </span>
            <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold ${getStatusBadge(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/50 mt-1 flex items-center gap-1 font-serif italic">
            <Clock className="w-3 h-3 text-[#1A1A1A]/40" />
            {formattedDate}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50">Order Total</div>
          <div className="text-xl font-serif font-bold text-[#1A1A1A]">₹{order.totalAmount}</div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        {order.products.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2.5 bg-[#F7F3EE] border border-[#1A1A1A]/10 p-2 shrink-0">
            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover" />
            <div className="text-xs pr-2">
              <p className="font-serif text-sm font-medium text-[#1A1A1A] max-w-[120px] truncate">{p.name}</p>
              <p className="text-[#1A1A1A]/60 text-[10px] font-mono">x{p.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/70">
          <MapPin className="w-3.5 h-3.5 text-[#2D4F1E] shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-[280px] font-sans">{order.address}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {order.deliveryPartnerName && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0EFED] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-[#1A1A1A]/10">
              <Bike className="w-3.5 h-3.5 text-[#2D4F1E]" />
              {order.deliveryPartnerName}
            </span>
          )}

          <button
            onClick={() => onTrackOrder(order._id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition active:scale-95"
          >
            Track Dispatch
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { IProduct } from '../types.ts';

interface CartProps {
  products: IProduct[];
  cartItems: Record<string, number>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onNavigate: (view: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  products,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onNavigate
}) => {
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
  const amountForFreeDelivery = Math.max(0, 300 - subtotal);

  if (itemsInCart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5 bg-white border border-[#1A1A1A]/10 p-10 rounded-xs">
        <div className="w-14 h-14 bg-[#F7F3EE] border border-[#1A1A1A]/15 flex items-center justify-center mx-auto text-[#2D4F1E]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif italic text-[#1A1A1A]">Your Basket is Empty</h2>
        <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto font-sans leading-relaxed">
          Explore our seasonal fruits, greenhouse greens, daily dairy, and pantry provisions to begin your harvest order.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-8 py-3.5 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 text-[#1A1A1A]">
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E] block">
            Fulfillment Review
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-[#1A1A1A] mt-0.5">
            Your Shopping Basket
          </h1>
        </div>
        <button
          onClick={onClearCart}
          className="text-[11px] uppercase tracking-widest font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Empty Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {itemsInCart.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="bg-white border border-[#1A1A1A]/10 p-5 rounded-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover border border-[#1A1A1A]/10 shrink-0"
                />
                <div>
                  <h3 className="font-serif text-base font-normal text-[#1A1A1A]">{product.name}</h3>
                  <div className="text-xs italic font-serif text-[#1A1A1A]/50 mt-0.5">{product.unit}</div>
                  <div className="text-sm font-serif font-bold text-[#1A1A1A] mt-1">
                    ₹{product.price * quantity}
                    <span className="text-xs font-sans font-normal text-[#1A1A1A]/40 ml-1.5">
                      (₹{product.price} each)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center bg-[#F7F3EE] border border-[#1A1A1A]/20 p-0.5">
                <button
                  onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white text-[#1A1A1A] hover:bg-slate-200 transition active:scale-95 text-xs font-bold border border-[#1A1A1A]/10"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-[#1A1A1A] font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-[#2D4F1E] text-white hover:bg-black transition active:scale-95 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Free Delivery Banner */}
          {amountForFreeDelivery > 0 ? (
            <div className="p-4 bg-white border border-[#1A1A1A]/15 flex items-center gap-3 text-xs text-[#1A1A1A]">
              <Truck className="w-4 h-4 text-[#2D4F1E] shrink-0" />
              <span>
                Add produce worth <b>₹{amountForFreeDelivery}</b> more to qualify for <b>Complimentary Delivery</b>.
              </span>
            </div>
          ) : (
            <div className="p-4 bg-[#2D4F1E] text-white flex items-center gap-3 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-white" />
              <span>Your basket qualifies for <b>Complimentary Express Courier</b>.</span>
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#1A1A1A]/10 p-6 rounded-xs space-y-5 sticky top-28">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] pb-3 border-b border-[#1A1A1A]/10">
              Bill Breakdown
            </h3>

            <div className="space-y-3 text-xs text-[#1A1A1A]/70 font-sans">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-[#1A1A1A]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Fee</span>
                <span className="font-mono font-bold text-[#1A1A1A]">
                  {deliveryFee === 0 ? (
                    <span className="text-[#2D4F1E] font-bold uppercase tracking-wider text-[10px]">Complimentary</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Handling</span>
                <span className="text-[#2D4F1E] font-bold text-[10px] uppercase tracking-wider">Included</span>
              </div>
              <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between text-base font-serif font-bold text-[#1A1A1A]">
                <span>Total Due</span>
                <span className="text-[#2D4F1E]">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 px-4 bg-[#2D4F1E] hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3.5 bg-[#F7F3EE] border border-[#1A1A1A]/10 text-[10px] uppercase tracking-widest text-[#1A1A1A]/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                <Truck className="w-3.5 h-3.5 text-[#2D4F1E]" />
                Live GPS Sync Active
              </div>
              <p className="normal-case text-[11px] text-[#1A1A1A]/70">Courier route rendered on OpenStreetMap immediately upon dispatch.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { IProduct } from '../types.ts';

interface ProductCardProps {
  product: IProduct;
  cartQuantity: number;
  onAddToCart: (product: IProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity
}) => {
  return (
    <div className="group bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/35 transition-all duration-200 flex flex-col overflow-hidden rounded-xs">
      {/* Image & Category Tag Container */}
      <div className="relative w-full h-44 sm:h-48 bg-[#F0EFED] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-[0.25em] uppercase bg-white/95 text-[#2D4F1E] border border-[#1A1A1A]/10">
            {product.category}
          </span>
        </div>
        {product.quantity <= 5 && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-[#1A1A1A] text-white">
              {product.quantity} units left
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="text-xs italic font-serif text-[#1A1A1A]/60">{product.unit}</div>
          <h3 className="font-serif text-base font-normal tracking-tight text-[#1A1A1A] line-clamp-1 mt-0.5 group-hover:text-[#2D4F1E] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mt-1 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 block">Price</span>
            <div className="text-base font-serif font-bold text-[#1A1A1A] leading-none mt-0.5">
              ₹{product.price}
            </div>
          </div>

          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D4F1E] hover:bg-black active:scale-95 text-white text-[11px] uppercase tracking-widest font-bold transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div className="inline-flex items-center bg-[#F7F3EE] border border-[#1A1A1A]/20 p-0.5">
              <button
                onClick={() => onUpdateQuantity(product._id, cartQuantity - 1)}
                className="w-6 h-6 flex items-center justify-center bg-white text-[#1A1A1A] hover:bg-slate-200 transition active:scale-95 text-xs font-bold border border-[#1A1A1A]/10"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-[#1A1A1A] font-mono">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(product._id, cartQuantity + 1)}
                className="w-6 h-6 flex items-center justify-center bg-[#2D4F1E] text-white hover:bg-black transition active:scale-95 text-xs font-bold"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

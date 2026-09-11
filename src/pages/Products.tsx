import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { IProduct, ICategory } from '../types.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ProductsProps {
  products: IProduct[];
  categories: ICategory[];
  cartItems: Record<string, number>;
  onAddToCart: (product: IProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  categories,
  cartItems,
  onAddToCart,
  onUpdateQuantity
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  let filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="space-y-8 pb-16 text-[#1A1A1A]">
      {/* Title & Filter Controls */}
      <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F1E] block">
            Produce & Provisions
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-[#1A1A1A] mt-0.5">
            Grocery Catalogue
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Search seasonal harvest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#1A1A1A]/20 focus:outline-hidden focus:border-[#2D4F1E] font-sans"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#1A1A1A]/20 px-3 py-2 text-xs text-[#1A1A1A]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-xs font-serif cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-[#1A1A1A]/10 p-6 rounded-xs">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] mb-4 pb-2 border-b border-[#1A1A1A]/10">
              Department Aisle
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-2.5 transition flex items-center justify-between font-medium ${
                  selectedCategory === 'All'
                    ? 'bg-[#F7F3EE] text-[#2D4F1E] font-bold border-l-2 border-[#2D4F1E]'
                    : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#F7F3EE]/50'
                }`}
              >
                <span className="font-serif text-sm">All Produce</span>
                <span className="text-[10px] text-[#1A1A1A]/50 font-mono">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2.5 transition flex items-center justify-between font-medium ${
                      selectedCategory === cat.name
                        ? 'bg-[#F7F3EE] text-[#2D4F1E] font-bold border-l-2 border-[#2D4F1E]'
                        : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#F7F3EE]/50'
                    }`}
                  >
                    <span className="font-serif text-sm">{cat.name}</span>
                    <span className="text-[10px] text-[#1A1A1A]/50 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#1A1A1A]/10 p-12 text-center text-[#1A1A1A]/60 font-serif italic text-base">
              No harvest found in this category or matching query.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
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
      </div>
    </div>
  );
};

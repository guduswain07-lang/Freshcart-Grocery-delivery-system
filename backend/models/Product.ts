import { db, IProduct } from '../config/db.ts';

export const ProductModel = {
  find: async (query: { category?: string; search?: string } = {}) => {
    let result = [...db.products];
    if (query.category && query.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
    }
    if (query.search && query.search.trim()) {
      const term = query.search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    return result;
  },

  findById: async (id: string) => {
    return db.products.find(p => p._id === id) || null;
  },

  create: async (data: Omit<IProduct, '_id'>) => {
    const newProduct: IProduct = {
      _id: 'prod_' + Math.random().toString(36).substr(2, 9),
      ...data
    };
    db.products.push(newProduct);
    return newProduct;
  },

  findByIdAndUpdate: async (id: string, updates: Partial<IProduct>) => {
    const idx = db.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates };
    return db.products[idx];
  },

  findByIdAndDelete: async (id: string) => {
    const idx = db.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    const removed = db.products.splice(idx, 1)[0];
    return removed;
  },

  countDocuments: async () => {
    return db.products.length;
  }
};

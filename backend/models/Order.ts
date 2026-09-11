import { db, IOrder } from '../config/db.ts';

export const OrderModel = {
  find: async (filter: { userId?: string; deliveryPartnerId?: string; status?: string } = {}) => {
    let result = [...db.orders];
    if (filter.userId) {
      result = result.filter(o => o.userId === filter.userId);
    }
    if (filter.deliveryPartnerId) {
      result = result.filter(o => o.deliveryPartnerId === filter.deliveryPartnerId);
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(o => o.status === filter.status);
    }
    // Sort descending by createdAt
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById: async (id: string) => {
    return db.orders.find(o => o._id === id) || null;
  },

  create: async (data: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: IOrder = {
      _id: 'ord_' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    return newOrder;
  },

  findByIdAndUpdate: async (id: string, updates: Partial<IOrder>) => {
    const idx = db.orders.findIndex(o => o._id === id);
    if (idx === -1) return null;
    db.orders[idx] = {
      ...db.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return db.orders[idx];
  },

  countDocuments: async (filter: { status?: string } = {}) => {
    if (filter.status) {
      return db.orders.filter(o => o.status === filter.status).length;
    }
    return db.orders.length;
  }
};

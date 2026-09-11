import { db, IDelivery } from '../config/db.ts';

export const DeliveryModel = {
  find: async (filter: { deliveryPartnerId?: string; orderId?: string } = {}) => {
    let result = [...db.deliveries];
    if (filter.deliveryPartnerId) {
      result = result.filter(d => d.deliveryPartnerId === filter.deliveryPartnerId);
    }
    if (filter.orderId) {
      result = result.filter(d => d.orderId === filter.orderId);
    }
    return result;
  },

  findOne: async (filter: { orderId?: string; deliveryPartnerId?: string }) => {
    const list = await DeliveryModel.find(filter);
    return list[0] || null;
  },

  create: async (data: Omit<IDelivery, '_id' | 'updatedAt' | 'locationHistory'> & { locationHistory?: any[] }) => {
    const newDelivery: IDelivery = {
      _id: 'del_' + Math.random().toString(36).substr(2, 9),
      ...data,
      locationHistory: data.locationHistory || [
        { lat: data.latitude, lng: data.longitude, timestamp: new Date().toISOString() }
      ],
      updatedAt: new Date().toISOString()
    };
    db.deliveries.push(newDelivery);
    return newDelivery;
  },

  findOneAndUpdate: async (
    filter: { orderId?: string },
    updates: Partial<IDelivery> & { newLocationPoint?: { lat: number; lng: number } }
  ) => {
    const idx = db.deliveries.findIndex(d => {
      if (filter.orderId && d.orderId !== filter.orderId) return false;
      return true;
    });

    if (idx === -1) {
      // If not found and orderId provided, create a delivery record
      if (filter.orderId) {
        return DeliveryModel.create({
          orderId: filter.orderId,
          deliveryPartnerId: updates.deliveryPartnerId || 'usr_delivery_1',
          deliveryPartnerName: updates.deliveryPartnerName || 'Assigned Partner',
          deliveryPartnerPhone: updates.deliveryPartnerPhone || '+91 91234 56789',
          vehicleNumber: updates.vehicleNumber || 'KA 01 AB 7890',
          latitude: updates.latitude || 12.9716,
          longitude: updates.longitude || 77.5946,
          status: updates.status || 'In Transit'
        });
      }
      return null;
    }

    const current = db.deliveries[idx];
    const newHistory = [...current.locationHistory];
    if (updates.newLocationPoint) {
      newHistory.push({
        lat: updates.newLocationPoint.lat,
        lng: updates.newLocationPoint.lng,
        timestamp: new Date().toISOString()
      });
      // Keep last 100 points
      if (newHistory.length > 100) newHistory.shift();
    } else if (updates.latitude && updates.longitude) {
      newHistory.push({
        lat: updates.latitude,
        lng: updates.longitude,
        timestamp: new Date().toISOString()
      });
      if (newHistory.length > 100) newHistory.shift();
    }

    db.deliveries[idx] = {
      ...current,
      ...updates,
      locationHistory: newHistory,
      updatedAt: new Date().toISOString()
    };
    return db.deliveries[idx];
  }
};

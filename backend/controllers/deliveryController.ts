import { Response } from 'express';
import { DeliveryModel } from '../models/Delivery.ts';
import { OrderModel } from '../models/Order.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export const getAssignedOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const partnerId = req.user._id;
    const orders = await OrderModel.find({ deliveryPartnerId: partnerId });
    
    // Attach current delivery tracking record for each order
    const enhanced = await Promise.all(
      orders.map(async (order) => {
        const delivery = await DeliveryModel.findOne({ orderId: order._id });
        return {
          ...order,
          delivery
        };
      })
    );

    res.json({ success: true, count: enhanced.length, orders: enhanced });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, latitude, longitude, heading, speed } = req.body;

    if (!orderId || latitude === undefined || longitude === undefined) {
      res.status(400).json({ success: false, message: 'orderId, latitude and longitude are required' });
      return;
    }

    const updated = await DeliveryModel.findOneAndUpdate(
      { orderId },
      {
        latitude: Number(latitude),
        longitude: Number(longitude),
        heading: heading !== undefined ? Number(heading) : 0,
        speed: speed !== undefined ? Number(speed) : 25,
        newLocationPoint: { lat: Number(latitude), lng: Number(longitude) }
      }
    );

    // Broadcast over Socket.IO
    const io = (req.app as any).get('socketio');
    if (io) {
      io.to(`order:${orderId}`).emit('location_updated', {
        orderId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        heading,
        speed,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Location updated',
      delivery: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, deliveryStatus, orderStatus } = req.body;

    const delivery = await DeliveryModel.findOneAndUpdate(
      { orderId },
      { status: deliveryStatus }
    );

    if (orderStatus) {
      await OrderModel.findByIdAndUpdate(orderId, { status: orderStatus });
    }

    const io = (req.app as any).get('socketio');
    if (io) {
      io.to(`order:${orderId}`).emit('order_status_updated', {
        orderId,
        deliveryStatus,
        status: orderStatus
      });
      io.emit('order_status_broadcast', {
        orderId,
        status: orderStatus
      });
    }

    res.json({
      success: true,
      message: 'Delivery status updated',
      delivery
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeliveryByOrderId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const delivery = await DeliveryModel.findOne({ orderId });
    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery tracking record not found' });
      return;
    }
    res.json({ success: true, delivery });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

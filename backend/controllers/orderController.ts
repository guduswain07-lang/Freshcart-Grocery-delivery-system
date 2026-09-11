import { Response } from 'express';
import { OrderModel } from '../models/Order.ts';
import { DeliveryModel } from '../models/Delivery.ts';
import { UserModel } from '../models/User.ts';
import { ProductModel } from '../models/Product.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

// Central store coordinates default
const DEFAULT_STORE = {
  lat: 12.9716,
  lng: 77.5946,
  name: 'FreshCart Central Hub',
  address: 'MG Road Hub, Central Bangalore'
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { products, address, customerLocation, paymentMethod = 'COD', notes } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
      return;
    }

    if (!address) {
      res.status(400).json({ success: false, message: 'Delivery address is required' });
      return;
    }

    // Calculate subtotal and verify products
    let subtotal = 0;
    const verifiedProducts = [];

    for (const item of products) {
      const product = await ProductModel.findById(item.productId);
      const price = product ? product.price : item.price || 50;
      const qty = item.quantity || 1;
      subtotal += price * qty;

      verifiedProducts.push({
        productId: item.productId,
        name: product ? product.name : item.name,
        price,
        quantity: qty,
        image: product ? product.image : item.image,
        unit: product ? product.unit : (item.unit || '1 unit')
      });
    }

    // Free delivery over 300
    const deliveryFee = subtotal >= 300 ? 0 : 25;
    const totalAmount = subtotal + deliveryFee;

    // Set or randomize customer location around Bangalore center if not provided
    const userLoc = customerLocation && customerLocation.lat
      ? customerLocation
      : {
          lat: 12.9610 + (Math.random() - 0.5) * 0.04,
          lng: 77.6380 + (Math.random() - 0.5) * 0.04
        };

    const user = req.user;

    const newOrder = await OrderModel.create({
      userId: user ? user._id : 'usr_guest',
      customerName: user ? user.name : 'Customer',
      customerPhone: user ? user.phone : '+91 98765 43210',
      products: verifiedProducts,
      subtotal,
      deliveryFee,
      totalAmount,
      address,
      customerLocation: userLoc,
      storeLocation: DEFAULT_STORE,
      status: 'Order Placed',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      notes
    });

    // Notify connected Socket.IO clients if available
    const io = (req.app as any).get('socketio');
    if (io) {
      io.emit('new_order', newOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user._id : 'usr_customer_1';
    let orders = await OrderModel.find({ userId });
    if (orders.length === 0 && !req.user) {
      orders = await OrderModel.find();
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const orders = await OrderModel.find(status ? { status } : {});
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const delivery = await DeliveryModel.findOne({ orderId: order._id });

    res.json({
      success: true,
      order,
      delivery
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Placed', 'Order Confirmed', 'Order Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status' });
      return;
    }

    const updated = await OrderModel.findByIdAndUpdate(req.params.id, { status });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Sync delivery status if needed
    if (status === 'Delivered') {
      await DeliveryModel.findOneAndUpdate({ orderId: updated._id }, { status: 'Delivered' });
    } else if (status === 'Out for Delivery') {
      await DeliveryModel.findOneAndUpdate({ orderId: updated._id }, { status: 'In Transit' });
    }

    // Emit Socket.IO event
    const io = (req.app as any).get('socketio');
    if (io) {
      io.to(`order:${updated._id}`).emit('order_status_updated', {
        orderId: updated._id,
        status: updated.status,
        updatedAt: updated.updatedAt
      });
      io.emit('order_status_broadcast', {
        orderId: updated._id,
        status: updated.status
      });
    }

    res.json({ success: true, message: 'Status updated successfully', order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignDeliveryPartner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deliveryPartnerId } = req.body;
    const partner = await UserModel.findById(deliveryPartnerId);

    if (!partner || partner.role !== 'delivery') {
      res.status(400).json({ success: false, message: 'Invalid delivery partner' });
      return;
    }

    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(order._id, {
      deliveryPartnerId: partner._id,
      deliveryPartnerName: partner.name,
      deliveryPartnerPhone: partner.phone,
      status: order.status === 'Order Placed' ? 'Order Confirmed' : order.status
    });

    // Create or update delivery record with store coordinates as initial start
    const delivery = await DeliveryModel.findOneAndUpdate(
      { orderId: order._id },
      {
        orderId: order._id,
        deliveryPartnerId: partner._id,
        deliveryPartnerName: partner.name,
        deliveryPartnerPhone: partner.phone,
        vehicleNumber: partner.vehicle || 'KA 01 AB 7890',
        latitude: order.storeLocation.lat,
        longitude: order.storeLocation.lng,
        status: 'Assigned'
      }
    );

    // Socket.IO notification
    const io = (req.app as any).get('socketio');
    if (io) {
      io.to(`order:${order._id}`).emit('order_assigned', {
        orderId: order._id,
        deliveryPartner: {
          id: partner._id,
          name: partner.name,
          phone: partner.phone,
          vehicle: partner.vehicle
        }
      });
      io.emit('partner_assigned_notification', {
        orderId: order._id,
        deliveryPartnerId: partner._id
      });
    }

    res.json({
      success: true,
      message: `Order assigned to ${partner.name}`,
      order: updatedOrder,
      delivery
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allOrders = await OrderModel.find();
    const totalRevenue = allOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const activeOrders = allOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered').length;
    const totalProducts = await ProductModel.countDocuments();
    const totalCustomers = await UserModel.countDocuments({ role: 'customer' });
    const totalDeliveryPartners = await UserModel.countDocuments({ role: 'delivery' });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: allOrders.length,
        activeOrders,
        deliveredOrders,
        totalProducts,
        totalCustomers,
        totalDeliveryPartners
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

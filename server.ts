import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';

import authRoutes from './backend/routes/authRoutes.ts';
import productRoutes from './backend/routes/productRoutes.ts';
import orderRoutes from './backend/routes/orderRoutes.ts';
import deliveryRoutes from './backend/routes/deliveryRoutes.ts';
import { DeliveryModel } from './backend/models/Delivery.ts';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Real-time Socket.IO configuration
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT']
    }
  });

  // Attach socketio to app for controller access
  app.set('socketio', io);

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Socket.IO connection and real-time live tracking
  io.on('connection', (socket) => {
    // Join room for specific order live tracking
    socket.on('join_order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('leave_order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    // Real-time GPS location update from Delivery Partner
    socket.on('send_location', async (data: {
      orderId: string;
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    }) => {
      try {
        if (data && data.orderId) {
          await DeliveryModel.findOneAndUpdate(
            { orderId: data.orderId },
            {
              latitude: data.latitude,
              longitude: data.longitude,
              heading: data.heading || 0,
              speed: data.speed || 25,
              newLocationPoint: { lat: data.latitude, lng: data.longitude }
            }
          );

          // Broadcast to anyone tracking this order
          io.to(`order:${data.orderId}`).emit('location_updated', {
            orderId: data.orderId,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading || 0,
            speed: data.speed || 25,
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error handling send_location:', err);
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  // REST API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Grocery Delivery Management System with Real-Time Tracking',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/deliveries', deliveryRoutes);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Grocery Delivery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

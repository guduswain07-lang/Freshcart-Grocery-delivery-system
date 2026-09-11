import React, { useEffect, useState, useRef } from 'react';
import {
  Bike,
  Package,
  MapPin,
  Phone,
  Play,
  Pause,
  Compass,
  CheckCircle,
  Navigation,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { IOrder, IDelivery, IUser } from '../types.ts';
import { api } from '../services/api.ts';
import { sendLiveLocation } from '../services/socket.ts';

interface DeliveryDashboardProps {
  currentUser: IUser | null;
  onNavigate: (view: string, params?: any) => void;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  currentUser,
  onNavigate
}) => {
  const [assignedOrders, setAssignedOrders] = useState<Array<IOrder & { delivery?: IDelivery }>>([]);
  const [activeOrderId, setActiveOrderId] = useState<string>('ord_live_demo_101');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.9665,
    lng: 77.6140
  });
  const [notification, setNotification] = useState<string | null>(null);

  const simTimerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await api.getAssignedOrders();
      setAssignedOrders(res.orders);
      if (res.orders.length > 0 && !res.orders.some((o) => o._id === activeOrderId)) {
        setActiveOrderId(res.orders[0]._id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const activeOrder =
    assignedOrders.find((o) => o._id === activeOrderId) || assignedOrders[0] || null;

  // Initialize coordinates from active order delivery
  useEffect(() => {
    if (activeOrder?.delivery) {
      setCurrentCoords({
        lat: activeOrder.delivery.latitude,
        lng: activeOrder.delivery.longitude
      });
    } else if (activeOrder) {
      setCurrentCoords({
        lat: activeOrder.storeLocation.lat,
        lng: activeOrder.storeLocation.lng
      });
    }
  }, [activeOrderId]);

  // Push Location Update to Server & Broadcast over Socket.IO
  const broadcastLocation = async (lat: number, lng: number, speed: number = 28) => {
    if (!activeOrder) return;
    setCurrentCoords({ lat, lng });

    // Send via Socket.IO for real-time instantaneous map animation
    sendLiveLocation({
      orderId: activeOrder._id,
      latitude: lat,
      longitude: lng,
      speed,
      heading: 60
    });

    // Also persist in database
    try {
      await api.updateDeliveryLocation({
        orderId: activeOrder._id,
        latitude: lat,
        longitude: lng,
        speed,
        heading: 60
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Step Move for evaluator testing (+15% progress toward destination)
  const handleStepMove = () => {
    if (!activeOrder) return;
    const destLat = activeOrder.customerLocation.lat;
    const destLng = activeOrder.customerLocation.lng;

    const nextLat = currentCoords.lat + (destLat - currentCoords.lat) * 0.18;
    const nextLng = currentCoords.lng + (destLng - currentCoords.lng) * 0.18;

    broadcastLocation(nextLat, nextLng, 32);
    setNotification('GPS position updated & broadcasted via Socket.IO!');
    setTimeout(() => setNotification(null), 2500);
  };

  // Toggle Automated Rider Movement Loop
  const toggleSimulation = () => {
    if (isSimulating) {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      setIsSimulating(false);
      return;
    }

    if (!activeOrder) return;
    setIsSimulating(true);

    const startLat = currentCoords.lat;
    const startLng = currentCoords.lng;
    const destLat = activeOrder.customerLocation.lat;
    const destLng = activeOrder.customerLocation.lng;

    let step = 0;
    const totalSteps = 25;

    simTimerRef.current = setInterval(() => {
      step++;
      const progress = Math.min(1, step / totalSteps);
      const lat = startLat + (destLat - startLat) * progress;
      const lng = startLng + (destLng - startLng) * progress;

      broadcastLocation(lat, lng, 30);

      if (progress >= 1) {
        clearInterval(simTimerRef.current);
        setIsSimulating(false);
        setNotification('Destination reached! Ready to mark order Delivered.');
      }
    }, 1200);
  };

  // Device Geolocation Option
  const toggleRealGps = () => {
    if (gpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      setGpsActive(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported in this environment.');
      return;
    }

    setGpsActive(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        broadcastLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.speed || 20);
      },
      (err) => {
        console.warn(err);
        setGpsActive(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const handleUpdateStatus = async (newStatus: any) => {
    if (!activeOrder) return;
    try {
      await api.updateOrderStatus(activeOrder._id, newStatus);
      setNotification(`Status updated to: ${newStatus}`);
      fetchAssigned();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 text-[#1A1A1A]">
      {/* Editorial Header Banner */}
      <div className="bg-[#2D4F1E] text-white p-8 sm:p-10 rounded-xs border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 block">
            Courier Operations Terminal
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-white">
            Rider Telemetry & Dispatch
          </h1>
          <p className="text-xs text-white/80 font-sans">
            Courier Partner: <b>{currentUser?.name || 'Vikram Singh'}</b> ({currentUser?.vehicle || 'Hero Electric Express'})
          </p>
        </div>

        <button
          onClick={fetchAssigned}
          className="px-5 py-2.5 bg-black/40 hover:bg-black text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 border border-white/20 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Deliveries
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-white border border-[#2D4F1E] text-[#2D4F1E] rounded-xs text-xs font-serif flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Orders List & Active Delivery Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Assigned Orders List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4F1E] pb-2 border-b border-[#1A1A1A]/10">
            Assigned Routes ({assignedOrders.length})
          </h3>

          <div className="space-y-3">
            {assignedOrders.map((order) => (
              <button
                key={order._id}
                onClick={() => setActiveOrderId(order._id)}
                className={`w-full text-left p-5 border rounded-xs transition ${
                  activeOrderId === order._id
                    ? 'border-[#2D4F1E] bg-[#F7F3EE]'
                    : 'border-[#1A1A1A]/10 bg-white hover:bg-[#F7F3EE]/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#1A1A1A] font-bold">#{order._id.replace('ord_', '').slice(0, 8)}</span>
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-sans font-bold bg-[#1A1A1A] text-white">
                    {order.status}
                  </span>
                </div>
                <div className="font-serif text-base text-[#1A1A1A] mt-2">{order.customerName}</div>
                <div className="text-[11px] text-[#1A1A1A]/60 truncate mt-0.5">{order.address}</div>
                <div className="font-serif font-bold text-sm text-[#2D4F1E] mt-2">₹{order.totalAmount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Order Operations & GPS Controller */}
        {activeOrder ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Active Delivery Card */}
            <div className="bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 rounded-xs space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-[#1A1A1A]/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F1E]">
                    Selected Delivery Leg
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] mt-0.5">
                    Order #{activeOrder._id.replace('ord_', '').slice(0, 10)}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('track-order', { orderId: activeOrder._id })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1A1A1A]/20 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs uppercase tracking-widest font-bold transition"
                >
                  <span>Customer View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Customer Contact & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F7F3EE] border border-[#1A1A1A]/10 space-y-1">
                  <span className="text-[#1A1A1A]/50 font-bold text-[9px] uppercase tracking-widest">Customer Recipient</span>
                  <div className="font-serif text-sm font-bold text-[#1A1A1A]">{activeOrder.customerName}</div>
                  <div className="flex items-center gap-1.5 text-[#2D4F1E] font-mono text-xs pt-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeOrder.customerPhone}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F3EE] border border-[#1A1A1A]/10 space-y-1">
                  <span className="text-[#1A1A1A]/50 font-bold text-[9px] uppercase tracking-widest">Delivery Address</span>
                  <div className="text-[#1A1A1A] text-xs leading-relaxed font-sans">{activeOrder.address}</div>
                </div>
              </div>

              {/* Order Status Action Pipeline Buttons */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/70">
                  Update Lifecycle Progression:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleUpdateStatus('Order Confirmed')}
                    className={`py-3 px-2 text-xs uppercase tracking-widest font-bold border transition ${
                      activeOrder.status === 'Order Confirmed'
                        ? 'bg-[#2D4F1E] text-white border-[#2D4F1E]'
                        : 'bg-white hover:bg-[#F7F3EE] text-[#1A1A1A] border-[#1A1A1A]/20'
                    }`}
                  >
                    1. Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Order Packed')}
                    className={`py-3 px-2 text-xs uppercase tracking-widest font-bold border transition ${
                      activeOrder.status === 'Order Packed'
                        ? 'bg-[#2D4F1E] text-white border-[#2D4F1E]'
                        : 'bg-white hover:bg-[#F7F3EE] text-[#1A1A1A] border-[#1A1A1A]/20'
                    }`}
                  >
                    2. Packed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Out for Delivery')}
                    className={`py-3 px-2 text-xs uppercase tracking-widest font-bold border transition ${
                      activeOrder.status === 'Out for Delivery'
                        ? 'bg-[#2D4F1E] text-white border-[#2D4F1E]'
                        : 'bg-white hover:bg-[#F7F3EE] text-[#1A1A1A] border-[#1A1A1A]/20'
                    }`}
                  >
                    3. Dispatch
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Delivered')}
                    className={`py-3 px-2 text-xs uppercase tracking-widest font-bold border transition ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:bg-[#F7F3EE] text-[#1A1A1A] border-[#1A1A1A]/20'
                    }`}
                  >
                    4. Delivered
                  </button>
                </div>
              </div>

              {/* LIVE GPS TRANSMISSION PANEL */}
              <div className="p-6 bg-[#1A1A1A] text-white rounded-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#2D4F1E] border border-white" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                      Live Telemetry Transmitter (Socket.IO)
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/70">
                    Lat: {currentCoords.lat.toFixed(4)} | Lng: {currentCoords.lng.toFixed(4)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={toggleSimulation}
                    className={`py-3 px-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition ${
                      isSimulating
                        ? 'bg-rose-900 text-white hover:bg-rose-950'
                        : 'bg-[#2D4F1E] hover:bg-white hover:text-black text-white'
                    }`}
                  >
                    {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSimulating ? 'Pause Route' : 'Auto Move Rider'}</span>
                  </button>

                  <button
                    onClick={handleStepMove}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-bold border border-white/20 flex items-center justify-center gap-2 transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#2D4F1E]" />
                    <span>Nudge Route (+18%)</span>
                  </button>

                  <button
                    onClick={toggleRealGps}
                    className={`py-3 px-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition border ${
                      gpsActive
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/20'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{gpsActive ? 'GPS Active' : 'Device GPS'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-[#1A1A1A]/10 p-12 text-center text-[#1A1A1A]/60 font-serif italic text-base">
            No active delivery route selected.
          </div>
        )}
      </div>
    </div>
  );
};

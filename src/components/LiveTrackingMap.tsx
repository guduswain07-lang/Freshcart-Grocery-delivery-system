import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, ZoomIn, ZoomOut, Compass, MapPin, Store, Bike } from 'lucide-react';

interface Coords {
  lat: number;
  lng: number;
}

interface LiveTrackingMapProps {
  storeLocation: Coords & { name?: string; address?: string };
  customerLocation: Coords & { address?: string };
  deliveryLocation?: Coords & { speed?: number; heading?: number };
  orderStatus: string;
  partnerName?: string;
  isRiderMoving?: boolean;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  storeLocation,
  customerLocation,
  deliveryLocation,
  orderStatus,
  partnerName = 'Delivery Partner',
  isRiderMoving = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (coord1: Coords, coord2: Coords): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = deliveryLocation?.lat || (storeLocation.lat + customerLocation.lat) / 2;
    const defaultLng = deliveryLocation?.lng || (storeLocation.lng + customerLocation.lng) / 2;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([defaultLat, defaultLng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Custom Store Icon (Editorial Black)
    const storeIcon = L.divIcon({
      className: 'store-icon-wrapper',
      html: `
        <div style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; background:#1A1A1A; border:2px solid #ffffff; box-shadow:0 6px 12px rgba(0,0,0,0.25);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Custom Customer Icon (Editorial Ink Red)
    const customerIcon = L.divIcon({
      className: 'customer-icon-wrapper',
      html: `
        <div style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; background:#881337; border:2px solid #ffffff; box-shadow:0 6px 12px rgba(0,0,0,0.25);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Add Store Marker
    const storeMarker = L.marker([storeLocation.lat, storeLocation.lng], { icon: storeIcon }).addTo(map);
    storeMarker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; padding:4px;">
        <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.2em; font-weight:700; color:#2D4F1E; display:block;">Store Hub</span>
        <strong style="color:#1A1A1A; font-size:14px; font-family:'Newsreader', serif;">${storeLocation.name || 'Store Hub'}</strong>
        <p style="margin:2px 0 0; color:#73716B; font-size:11px;">${storeLocation.address || 'Pickup location'}</p>
      </div>
    `);

    // Add Customer Marker
    const customerMarker = L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon }).addTo(map);
    customerMarker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; padding:4px;">
        <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.2em; font-weight:700; color:#881337; display:block;">Destination</span>
        <strong style="color:#1A1A1A; font-size:14px; font-family:'Newsreader', serif;">Delivery Address</strong>
        <p style="margin:2px 0 0; color:#73716B; font-size:11px;">${customerLocation.address || 'Customer destination'}</p>
      </div>
    `);

    // Delivery Partner Marker (Botanical Forest Green)
    const riderLat = deliveryLocation ? deliveryLocation.lat : storeLocation.lat;
    const riderLng = deliveryLocation ? deliveryLocation.lng : storeLocation.lng;

    const createRiderIcon = () => {
      return L.divIcon({
        className: 'rider-icon-wrapper',
        html: `
          <div style="position:relative; display:flex; align-items:center; justify-content:center; width:40px; height:40px;">
            <div style="position:absolute; width:40px; height:40px; border-radius:50%; background:#2D4F1E; opacity:0.3; animation:ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:relative; display:flex; align-items:center; justify-content:center; width:36px; height:36px; background:#2D4F1E; border:2.5px solid #ffffff; box-shadow:0 8px 16px rgba(45,79,30,0.4);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2">
                <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    };

    const riderMarker = L.marker([riderLat, riderLng], { icon: createRiderIcon() }).addTo(map);
    riderMarker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; padding:4px;">
        <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.2em; font-weight:700; color:#2D4F1E; display:block;">Courier</span>
        <strong style="color:#1A1A1A; font-size:14px; font-family:'Newsreader', serif;">${partnerName}</strong>
        <p style="margin:2px 0 0; color:#73716B; font-size:11px;">Status: <b>${orderStatus}</b></p>
      </div>
    `);

    riderMarkerRef.current = riderMarker;

    // Draw route path line: Store -> Rider -> Customer
    const pathCoords: [number, number][] = [
      [storeLocation.lat, storeLocation.lng],
      [riderLat, riderLng],
      [customerLocation.lat, customerLocation.lng]
    ];

    const polyline = L.polyline(pathCoords, {
      color: '#2D4F1E',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 6',
      lineCap: 'square'
    }).addTo(map);

    polylineRef.current = polyline;

    // Fit bounds so all 3 points are visible
    const bounds = L.latLngBounds([
      [storeLocation.lat, storeLocation.lng],
      [riderLat, riderLng],
      [customerLocation.lat, customerLocation.lng]
    ]);
    map.fitBounds(bounds, { padding: [60, 60] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [storeLocation.lat, storeLocation.lng, customerLocation.lat, customerLocation.lng]);

  // Update Rider Location Dynamically when deliveryLocation prop changes
  useEffect(() => {
    if (!deliveryLocation || !riderMarkerRef.current || !mapInstanceRef.current) return;

    const newPos: [number, number] = [deliveryLocation.lat, deliveryLocation.lng];
    riderMarkerRef.current.setLatLng(newPos);

    // Update polyline
    if (polylineRef.current) {
      polylineRef.current.setLatLngs([
        [storeLocation.lat, storeLocation.lng],
        newPos,
        [customerLocation.lat, customerLocation.lng]
      ]);
    }

    // Calculate distance to customer
    const remainingKm = calculateDistance(deliveryLocation, customerLocation);
    setDistanceKm(Number(remainingKm.toFixed(2)));

    // Estimate minutes based on 25 km/h urban average speed
    const estMinutes = Math.max(1, Math.round((remainingKm / 25) * 60));
    setEtaMinutes(estMinutes);
  }, [deliveryLocation?.lat, deliveryLocation?.lng, storeLocation, customerLocation]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const riderLat = deliveryLocation ? deliveryLocation.lat : storeLocation.lat;
    const riderLng = deliveryLocation ? deliveryLocation.lng : storeLocation.lng;

    const bounds = L.latLngBounds([
      [storeLocation.lat, storeLocation.lng],
      [riderLat, riderLng],
      [customerLocation.lat, customerLocation.lng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] overflow-hidden border border-[#1A1A1A]/15 bg-[#F0EFED] rounded-xs">
      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          title="Fit route bounds"
          className="p-2.5 bg-white text-[#1A1A1A] hover:bg-[#F7F3EE] border border-[#1A1A1A]/15 shadow-xs transition active:scale-95"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2.5 bg-white text-[#1A1A1A] hover:bg-[#F7F3EE] border border-[#1A1A1A]/15 shadow-xs transition active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2.5 bg-white text-[#1A1A1A] hover:bg-[#F7F3EE] border border-[#1A1A1A]/15 shadow-xs transition active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 py-1.5 px-3 border border-[#1A1A1A]/15 flex items-center gap-3.5 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#1A1A1A]"></span> Store</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#2D4F1E]"></span> Courier</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#881337]"></span> Customer</span>
      </div>

      {/* Real-time Status Badge overlay at bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-4 border border-[#1A1A1A]/15 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {orderStatus === 'Out for Delivery' && (
              <span className="absolute -inset-1 rounded-full bg-[#2D4F1E] opacity-50 animate-ping" />
            )}
            <div className="p-2 bg-[#2D4F1E] text-white">
              {orderStatus === 'Delivered' ? <MapPin className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">Dispatch Stage</span>
              <span className="inline-flex items-center px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-[#F7F3EE] text-[#1A1A1A] border border-[#1A1A1A]/20">
                {orderStatus}
              </span>
            </div>
            <p className="font-serif text-base text-[#1A1A1A] mt-0.5 font-normal">
              {partnerName} {isRiderMoving ? 'is currently in transit' : 'assigned for dispatch'}
            </p>
          </div>
        </div>

        {/* ETA & Distance */}
        <div className="flex items-center gap-3 text-right">
          {distanceKm !== null && (
            <div className="px-3 py-1.5 bg-[#F7F3EE] border border-[#1A1A1A]/10">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/50">Distance</div>
              <div className="text-xs font-mono font-bold text-[#1A1A1A]">{distanceKm} km</div>
            </div>
          )}
          {etaMinutes !== null && orderStatus !== 'Delivered' && (
            <div className="px-3.5 py-1.5 bg-[#2D4F1E] text-white">
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/70">Est. Arrival</div>
              <div className="text-xs font-mono font-bold text-white">~{etaMinutes} min</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, MapPin, Radio, GitBranch } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onNavigate }) => {
  return (
    <footer className="bg-[#F7F3EE] text-[#1A1A1A] text-xs border-t border-[#1A1A1A]/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#2D4F1E] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-serif italic text-lg font-light tracking-tight text-[#1A1A1A]">
                FreshCart Logistics
              </span>
            </div>
            <p className="text-[#1A1A1A]/70 text-xs leading-relaxed max-w-md font-sans">
              Digital Fulfillment System v2.0 — Developed as a MERN-stack college final year project. Powered by high-precision Leaflet OpenStreetMap live telemetry and real-time Socket.IO synchronization.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-0.5 bg-white text-[#1A1A1A] font-mono text-[9px] uppercase tracking-wider border border-[#1A1A1A]/15 font-bold">MongoDB</span>
              <span className="px-2 py-0.5 bg-white text-[#1A1A1A] font-mono text-[9px] uppercase tracking-wider border border-[#1A1A1A]/15 font-bold">Express.js</span>
              <span className="px-2 py-0.5 bg-white text-[#1A1A1A] font-mono text-[9px] uppercase tracking-wider border border-[#1A1A1A]/15 font-bold">React.js</span>
              <span className="px-2 py-0.5 bg-white text-[#1A1A1A] font-mono text-[9px] uppercase tracking-wider border border-[#1A1A1A]/15 font-bold">Node.js</span>
              <span className="px-2 py-0.5 bg-[#2D4F1E] text-white font-mono text-[9px] uppercase tracking-wider font-bold">Socket.IO</span>
              <span className="px-2 py-0.5 bg-white text-[#1A1A1A] font-mono text-[9px] uppercase tracking-wider border border-[#1A1A1A]/15 font-bold">Leaflet</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D4F1E] mb-3">
              Storefront Directory
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Featured Daily Harvest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Orchard & Market Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Live Dispatch Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Fulfillment Basket
                </button>
              </li>
            </ul>
          </div>

          {/* Project Review */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D4F1E] mb-3">
              Technical Review
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={onOpenDocs} className="text-[#2D4F1E] hover:underline font-bold flex items-center gap-1">
                  <span>Architecture & Schemas</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery-dashboard')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Courier GPS Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-[#2D4F1E] transition hover:underline">
                  Admin Analytics Suite
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar */}
      <div className="bg-white border-t border-[#1A1A1A]/10 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/60">
        <span>© 2026 FreshCart Logistics — Final Year Project</span>
        <span>Node.js / Express / Socket.io / Leaflet</span>
        <div className="flex items-center gap-2 text-[#2D4F1E] font-bold">
          <Radio className="w-3 h-3" />
          <span>Telemetry Online</span>
        </div>
      </div>
    </footer>
  );
};

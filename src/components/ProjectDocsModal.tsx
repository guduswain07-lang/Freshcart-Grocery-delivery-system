import React, { useState } from 'react';
import { X, BookOpen, Layers, Radio, Database, ShieldCheck, CheckCircle, ExternalLink, Code2 } from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'database' | 'socket'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] border border-[#1A1A1A]/20 flex flex-col overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#F7F3EE]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2D4F1E] text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 bg-[#2D4F1E] text-white">
                  Academic Project Dossier
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border border-[#1A1A1A]/20 text-[#1A1A1A]">
                  MERN Stack
                </span>
              </div>
              <h2 className="text-lg font-serif italic font-light text-[#1A1A1A] mt-0.5">
                Grocery Delivery Management System with Real-Time Telemetry Tracking
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1A1A1A]/10 px-8 bg-white overflow-x-auto text-xs uppercase tracking-widest font-bold gap-4 pt-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${activeTab === 'overview' ? 'border-[#2D4F1E] text-[#2D4F1E]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 border-b-2 transition ${activeTab === 'architecture' ? 'border-[#2D4F1E] text-[#2D4F1E]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`}
          >
            MERN Architecture
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 border-b-2 transition ${activeTab === 'database' ? 'border-[#2D4F1E] text-[#2D4F1E]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`}
          >
            MongoDB Schemas
          </button>
          <button
            onClick={() => setActiveTab('socket')}
            className={`pb-3 border-b-2 transition ${activeTab === 'socket' ? 'border-[#2D4F1E] text-[#2D4F1E]' : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`}
          >
            Socket.IO Protocol
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#1A1A1A]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#F7F3EE] border border-[#1A1A1A]/10">
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">System Blueprint</h3>
                <p className="text-xs text-[#1A1A1A]/80 mt-1.5 leading-relaxed font-sans">
                  A comprehensive full-stack grocery ordering system featuring three distinct role-based portals (Customer, Delivery Partner, and Admin) paired with real-time GPS coordinates broadcasting and interactive OpenStreetMap Leaflet visualization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 border border-[#1A1A1A]/10 bg-white">
                  <span className="text-2xl mb-1 block">👤</span>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Customer Module</h4>
                  <ul className="text-xs text-[#1A1A1A]/70 mt-2.5 space-y-1.5 font-sans">
                    <li>• Product catalogue & search</li>
                    <li>• Cart & dynamic price calculations</li>
                    <li>• Order placement & address checkout</li>
                    <li>• 6-stage live order tracking</li>
                    <li>• Past order history & receipts</li>
                  </ul>
                </div>

                <div className="p-5 border border-[#1A1A1A]/10 bg-white">
                  <span className="text-2xl mb-1 block">🚴</span>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Courier Partner</h4>
                  <ul className="text-xs text-[#1A1A1A]/70 mt-2.5 space-y-1.5 font-sans">
                    <li>• View assigned deliveries</li>
                    <li>• One-click order pickup & dispatch</li>
                    <li>• Live GPS coordinate transmission</li>
                    <li>• Interactive route simulation</li>
                    <li>• Status updates via Socket.IO</li>
                  </ul>
                </div>

                <div className="p-5 border border-[#1A1A1A]/10 bg-white">
                  <span className="text-2xl mb-1 block">👨‍💼</span>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Admin Console</h4>
                  <ul className="text-xs text-[#1A1A1A]/70 mt-2.5 space-y-1.5 font-sans">
                    <li>• Product & Category CRUD</li>
                    <li>• Customer and partner registries</li>
                    <li>• Manual order assignment</li>
                    <li>• Revenue and order statistics</li>
                    <li>• Live pipeline monitoring</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-[#F7F3EE]/40 border border-[#1A1A1A]/10">
                <h4 className="font-bold text-[#1A1A1A] text-[10px] uppercase tracking-widest mb-3">Technologies Employed</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">React.js 19</span>
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">Node.js + Express</span>
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">Socket.IO 4.8</span>
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">Leaflet 1.9 + OpenStreetMap</span>
                  <span className="px-3 py-1 bg-white border border-[#1A1A1A]/20 font-serif">JWT Authentication</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#1A1A1A] text-[#F7F3EE] font-mono text-[11px] overflow-x-auto leading-relaxed">
                <pre>{`               ┌──────────────────────────────────────────────┐
               │         GROCERY DELIVERY SYSTEM (MERN)       │
               └──────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
      👤 CUSTOMER PORTAL      🚴 DELIVERY PORTAL       👨‍💼 ADMIN PORTAL
      • Browse Products       • View Assigned         • Inventory CRUD
      • Cart & Checkout       • Start Trip            • Assign Rider
      • Live Leaflet Map      • Share GPS (Socket.IO) • Revenue Metrics
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      ▼
                        EXPRESS.JS REST API & SOCKET.IO
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
      /api/auth (JWT)        /api/products & orders    /api/deliveries
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      ▼
                             MONGODB / DOCUMENT STORE
                      (users, products, categories, orders, deliveries)`}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F7F3EE] border border-[#1A1A1A]/10 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Single-Port Architecture</h4>
                  <p className="text-[#1A1A1A]/70 leading-relaxed font-sans">
                    Runs Express, Socket.IO WebSockets, and Vite middleware concurrently on port 3000 for zero-configuration deployment on platforms like Render or Cloud Run.
                  </p>
                </div>
                <div className="p-4 bg-[#F7F3EE] border border-[#1A1A1A]/10 space-y-1">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">OpenStreetMap & Leaflet</h4>
                  <p className="text-[#1A1A1A]/70 leading-relaxed font-sans">
                    Uses open-source OpenStreetMap tiles without costly proprietary API keys, rendering custom animated HTML markers for store, rider, and customer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <p className="text-xs text-[#1A1A1A]/70">
                Document schemas stored in MongoDB database: <code className="font-mono bg-[#F7F3EE] px-1.5 py-0.5 border border-[#1A1A1A]/10">groceryDB</code>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#F7F3EE]/60 border border-[#1A1A1A]/10">
                  <span className="font-bold text-[#2D4F1E] uppercase text-[10px] tracking-widest block mb-2">collection: users</span>
                  <div className="text-[#1A1A1A]/80 space-y-1">
                    <div>_id: ObjectId</div>
                    <div>name: String</div>
                    <div>email: String (unique)</div>
                    <div>phone: String</div>
                    <div>password: String (hash)</div>
                    <div>role: 'customer'|'delivery'|'admin'</div>
                    <div>address: String</div>
                    <div>vehicle: String (for rider)</div>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F3EE]/60 border border-[#1A1A1A]/10">
                  <span className="font-bold text-[#2D4F1E] uppercase text-[10px] tracking-widest block mb-2">collection: products</span>
                  <div className="text-[#1A1A1A]/80 space-y-1">
                    <div>_id: ObjectId</div>
                    <div>name: String</div>
                    <div>category: String</div>
                    <div>price: Number</div>
                    <div>quantity: Number (stock)</div>
                    <div>unit: String ("1 kg", "500g")</div>
                    <div>image: String (URL)</div>
                    <div>description: String</div>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F3EE]/60 border border-[#1A1A1A]/10">
                  <span className="font-bold text-[#2D4F1E] uppercase text-[10px] tracking-widest block mb-2">collection: orders</span>
                  <div className="text-[#1A1A1A]/80 space-y-1">
                    <div>_id: ObjectId</div>
                    <div>userId: ObjectId</div>
                    <div>products: Array&lt;OrderItem&gt;</div>
                    <div>totalAmount: Number</div>
                    <div>address: String</div>
                    <div>customerLocation: {`{ lat, lng }`}</div>
                    <div>storeLocation: {`{ lat, lng, name }`}</div>
                    <div>status: 'Order Placed' ... 'Delivered'</div>
                    <div>deliveryPartnerId: ObjectId</div>
                  </div>
                </div>

                <div className="p-4 bg-[#F7F3EE]/60 border border-[#1A1A1A]/10">
                  <span className="font-bold text-[#2D4F1E] uppercase text-[10px] tracking-widest block mb-2">collection: deliveries</span>
                  <div className="text-[#1A1A1A]/80 space-y-1">
                    <div>_id: ObjectId</div>
                    <div>orderId: ObjectId</div>
                    <div>deliveryPartnerId: ObjectId</div>
                    <div>latitude: Number</div>
                    <div>longitude: Number</div>
                    <div>heading: Number</div>
                    <div>speed: Number (km/h)</div>
                    <div>locationHistory: Array&lt;Point&gt;</div>
                    <div>status: 'Assigned' ... 'Delivered'</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'socket' && (
            <div className="space-y-6">
              <div className="p-5 bg-[#F7F3EE] border border-[#1A1A1A]/10">
                <h4 className="font-serif font-bold text-base text-[#1A1A1A] mb-1">Socket.IO Dynamic Room Channeling</h4>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
                  Both customer and delivery partner join a dynamic room <code className="font-mono bg-white px-1 py-0.5 border border-[#1A1A1A]/10">order:${'{orderId}'}</code>. Every movement ping emitted by the delivery partner is pushed to all room subscribers with minimal latency.
                </p>
              </div>

              <table className="w-full text-xs text-left border border-[#1A1A1A]/10">
                <thead className="bg-[#F7F3EE] text-[#1A1A1A] font-bold uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="p-3">Event Name</th>
                    <th className="p-3">Sender</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                  <tr>
                    <td className="p-3 font-mono text-[#2D4F1E] font-semibold">join_order</td>
                    <td className="p-3">Customer / Rider</td>
                    <td className="p-3">Server</td>
                    <td className="p-3 font-mono">orderId</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-[#2D4F1E] font-semibold">send_location</td>
                    <td className="p-3">Delivery Partner</td>
                    <td className="p-3">Server</td>
                    <td className="p-3 font-mono">{`{ orderId, lat, lng, speed }`}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-[#2D4F1E] font-semibold">location_updated</td>
                    <td className="p-3">Server</td>
                    <td className="p-3">Customer (Map)</td>
                    <td className="p-3 font-mono">{`{ lat, lng, speed, time }`}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-[#2D4F1E] font-semibold">order_status_updated</td>
                    <td className="p-3">Server / Rider</td>
                    <td className="p-3">All Room Members</td>
                    <td className="p-3 font-mono">{`{ orderId, status }`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#F7F3EE]/50 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs text-[#1A1A1A]/70">
          <span className="font-serif italic">Final Year Project: “Grocery Delivery Management System with Real-Time Telemetry Tracking”</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2D4F1E] text-white hover:bg-black text-[10px] uppercase tracking-widest font-bold transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

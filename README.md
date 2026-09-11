# 🥬 FreshCart — Real-Time Grocery Delivery & Telemetry Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.0.1-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/socket.io-4.8.3-black.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A full-stack **MERN** (MongoDB, Express, React, Node.js) Grocery Delivery and Logistics Management platform featuring real-time bi-directional telemetry over WebSockets (**Socket.IO**), interactive **Leaflet & OpenStreetMap** geospatial tracking, and role-based operational portals for Customers, Delivery Couriers, and Store Administrators.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Key Features by Role](#-key-features-by-role)
  - [1. Customer Portal](#1-customer-portal)
  - [2. Delivery Partner / Courier Console](#2-delivery-partner--courier-console)
  - [3. Store Administration & Dispatch Deck](#3-store-administration--dispatch-deck)
- [Real-Time Telemetry & WebSocket Protocol](#-real-time-telemetry--websocket-protocol)
- [Database Schema (MongoDB Collections)](#-database-schema-mongodb-collections)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
  - [Building for Production](#building-for-production)
- [Demo Credentials](#-demo-credentials)
- [API Reference](#-api-reference)
- [License](#-license)

---

## 📌 Project Overview

**FreshCart** is built to solve end-to-end grocery logistics:
1. **Customers** place grocery orders from a categorized catalogue and monitor live courier movements on an interactive map.
2. **Couriers (Delivery Partners)** view assigned delivery orders, accept trips, and transmit live GPS coordinates with dynamic headings and speed calculations.
3. **Store Administrators** manage product inventory, categorize aisles, review incoming orders, manually assign dispatch riders, and inspect system telemetry metrics.

---

## 🏛 System Architecture

The application implements a high-performance **single-port full-stack architecture** where Express.js handles REST API endpoints, Socket.IO runs the WebSocket engine on the same HTTP server instance, and Vite serves the frontend interface in development or static assets in production.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRESHCART FULL-STACK ARCHITECTURE                    │
└────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 👤 CUSTOMER PORTAL       🚴 COURIER TERMINAL       👨‍💼 ADMIN CONSOLE
 • Catalogue & Search      • Assigned Orders         • Inventory & Stock CRUD
 • Cart & Checkout         • 1-Click Trip Dispatch   • Dispatch & Order Assign
 • Leaflet Live Map        • GPS Simulator Broadcast • Telemetry Analytics
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                       HTTP / WEBSOCKET ON PORT 3000
                                   │
      ┌────────────────────────────┴────────────────────────────┐
      ▼                                                         ▼
EXPRESS REST API                                        SOCKET.IO WEBSOCKETS
 • /api/auth (JWT Auth)                                  • Room: order:{orderId}
 • /api/products (Catalogue CRUD)                        • Event: send_location
 • /api/categories (Departments)                         • Event: location_updated
 • /api/orders (Lifecycle & Assignment)                  • Event: order_status_updated
 • /api/deliveries (Telemetry History)
      │
      ▼
MONGODB DOCUMENT STORE (groceryDB)
Collections: users, products, categories, orders, deliveries
```

---

## 🚀 Key Features by Role

### 1. Customer Portal
- **Catalogue Exploration**: Filter products across categories (*Fruits & Vegetables*, *Dairy & Eggs*, *Beverages*, *Bakery*, etc.) with live text search.
- **Cart & Dynamic Pricing**: Real-time quantity adjustments, subtotal computation, delivery fee breakdown, and savings calculations.
- **Order Placement**: Express checkout with custom delivery addresses, phone verification, and payment mode selection (UPI / Cash on Delivery).
- **6-Stage Order Lifecycle**: Visual status progression:
  1. `Order Placed`
  2. `Order Confirmed`
  3. `Order Packed`
  4. `Out for Delivery`
  5. `Delivered`
  6. `Cancelled`
- **Interactive Tracking**: Real-time Leaflet map rendering store origin, delivery courier vehicle marker with animated pulse, and customer destination with live polyline route updates.

### 2. Delivery Partner / Courier Console
- **Manifest Overview**: Live dashboard displaying active deliveries, items packed, customer contact, and delivery addresses.
- **Order Lifecycle Controls**: One-click actions to transition orders from `Order Packed` to `Out for Delivery` and final `Delivered` state.
- **GPS Coordinates Simulator**: Emits real-time latitude, longitude, vehicle heading (degrees), and instantaneous speed (km/h) across route waypoints.
- **Route Traversal**: Dynamic simulation between the central distribution hub (*MG Road Hub, Central Bangalore*) and recipient coordinates.

### 3. Store Administration & Dispatch Deck
- **Inventory Ledger**: Add, edit, update stock quantities, price adjustments, and delete grocery items.
- **Department Management**: Add and inspect store departments and category aisles.
- **Dispatch Deck**: View all customer manifests, filter by fulfillment status, and assign available riders from the active courier fleet.
- **Fleet & Customer Registry**: Directory of registered delivery personnel and customer profiles.
- **System Telemetry & Architecture Diagnostics**: Metrics covering sales volume, active transit count, Socket.IO latency, and map tile status.

---

## 📡 Real-Time Telemetry & WebSocket Protocol

FreshCart uses **Socket.IO rooms** (`order:${orderId}`) for isolated, secure channel broadcasting.

| Event Name | Emitter | Listener | Payload Structure | Description |
|---|---|---|---|---|
| `join_order` | Client (Customer/Rider) | Server | `orderId: string` | Joins the specific order room. |
| `send_location` | Courier Partner | Server | `{ orderId, lat, lng, heading, speed }` | Emits current rider coordinates. |
| `location_updated` | Server | Customer (Map) | `{ lat, lng, heading, speed, timestamp }` | Broadcasts updated coordinates to the map. |
| `update_status` | Courier / Admin | Server | `{ orderId, status }` | Emits order fulfillment status update. |
| `order_status_updated` | Server | All Room Members | `{ orderId, status }` | Notifies clients of state change. |

---

## 🗄️ Database Schema (MongoDB Collections)

### `users`
```typescript
{
  _id: string;              // Unique identifier (e.g., usr_customer_1)
  name: string;             // Full name
  email: string;            // Unique email
  phone: string;            // Contact number
  password: string;         // Password hash
  role: 'customer' | 'delivery' | 'admin';
  address?: string;         // Default delivery address
  vehicle?: string;         // Registered vehicle for riders
  createdAt: string;        // ISO timestamp
}
```

### `products`
```typescript
{
  _id: string;              // Product ID (e.g., prod_1)
  name: string;             // Item name
  category: string;         // Category name
  price: number;            // Price in INR (₹)
  quantity: number;         // Stock inventory
  unit: string;             // Packaging unit (e.g., "1 kg", "500 ml")
  image: string;            // Product image URL
  description: string;      // Product details
}
```

### `orders`
```typescript
{
  _id: string;              // Order ID (e.g., ord_live_demo_101)
  userId: string;           // Customer ID reference
  customerName: string;     // Customer name
  customerPhone: string;    // Contact number
  products: [{              // Array of line items
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  address: string;
  customerLocation: { lat: number; lng: number };
  storeLocation: { lat: number; lng: number; name: string };
  status: 'Order Placed' | 'Order Confirmed' | 'Order Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  createdAt: string;
  updatedAt: string;
}
```

### `deliveries`
```typescript
{
  _id: string;
  orderId: string;
  deliveryPartnerId: string;
  deliveryPartnerName: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;            // in km/h
  status: 'Assigned' | 'In Transit' | 'Delivered';
  locationHistory: Array<{ lat: number; lng: number; timestamp: string }>;
  updatedAt: string;
}
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Map & GIS**: [Leaflet 1.9](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
- **WebSockets Client**: [socket.io-client](https://socket.io/docs/v4/client-api/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework**: [Express 4](https://expressjs.com/)
- **Execution & Bundling**: [tsx](https://github.com/privatenumber/tsx) & [esbuild](https://esbuild.github.io/)
- **WebSockets Server**: [Socket.IO 4.8](https://socket.io/)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT)
- **Data Persistence**: MongoDB / Mongoose compatible In-Memory Document Store with auto-seeding

---

## 📂 Repository Structure

```
├── backend/
│   ├── config/
│   │   └── db.ts                   # In-memory document store & seed manifests
│   ├── controllers/
│   │   ├── authController.ts       # Register, login, profile endpoints
│   │   ├── productController.ts    # Product & Category CRUD logic
│   │   ├── orderController.ts      # Order placement, status, rider assign
│   │   └── deliveryController.ts   # GPS coordinate updates & tracking
│   ├── middleware/
│   │   └── authMiddleware.ts       # JWT verification & role authorization
│   ├── models/
│   │   └── User.ts                 # Document schema definitions
│   └── routes/
│       ├── authRoutes.ts           # /api/auth
│       ├── productRoutes.ts        # /api/products, /api/categories
│       ├── orderRoutes.ts          # /api/orders
│       └── deliveryRoutes.ts       # /api/deliveries
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar with cart badge & role switcher
│   │   ├── Footer.tsx              # Application footer
│   │   ├── ProductCard.tsx         # Product item card with add/remove controls
│   │   ├── OrderCard.tsx           # Order summary ledger card
│   │   ├── LiveTrackingMap.tsx     # Leaflet map component with live vehicle marker
│   │   └── ProjectDocsModal.tsx    # Interactive academic dossier & architecture modal
│   ├── pages/
│   │   ├── Products.tsx            # Customer catalogue & category aisle browser
│   │   ├── Cart.tsx                # Shopping bag, address entry & checkout
│   │   ├── Orders.tsx              # Customer past orders & tracking launcher
│   │   ├── TrackOrder.tsx          # Real-time GPS tracking screen with Leaflet map
│   │   ├── DeliveryDashboard.tsx   # Courier dashboard with GPS route simulator
│   │   ├── AdminDashboard.tsx      # Inventory, dispatch, fleet, and analytics deck
│   │   ├── Login.tsx               # Authentication screen with 1-click evaluator logins
│   │   └── Register.tsx            # Member & rider enrollment page
│   ├── services/
│   │   ├── api.ts                  # Centralized REST API client & session storage
│   │   └── socket.ts               # Socket.IO client initialization & listeners
│   ├── types.ts                    # Global TypeScript interfaces
│   ├── App.tsx                     # Main layout, router & state manager
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Global styles & Tailwind CSS imports
├── server.ts                       # Unified Express + Socket.IO + Vite server entry
├── package.json                    # Project metadata, dependencies & scripts
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build tool configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher installed.
- **npm**: v9.0.0 or higher.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/freshcart-delivery-tracker.git
   cd freshcart-delivery-tracker
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

### Running the Project

Start the integrated development server (Express + Socket.IO + Vite):
```bash
npm run dev
```

The application will be running at **`http://localhost:3000`**.

### Building for Production

To build the client assets and compile the server bundle:
```bash
npm run build
```

To run the production build:
```bash
npm start
```

---

## 🔑 Demo Credentials

For quick evaluation, you can switch roles using the **Role Switcher** in the navigation bar or use the 1-click demo buttons on the Login page:

| Portal / Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Customer** | `customer@freshcart.com` | `password123` | Browse catalogue, add to cart, checkout, live Leaflet order tracking |
| **Delivery Courier** | `rider@freshcart.com` | `password123` | Inspect manifests, 1-click trip dispatch, broadcast live GPS telemetry |
| **Store Admin** | `admin@freshcart.com` | `password123` | Product CRUD, category aisle management, courier allocation, KPI analytics |

---

## 🔌 API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a customer or courier partner.
- `POST /api/auth/login` — Login with email and password (returns JWT token).
- `GET /api/auth/me` — Retrieve authenticated user profile.
- `GET /api/auth/users` — List users filtered by role (admin only).

### Products & Categories (`/api/products`, `/api/categories`)
- `GET /api/products` — Retrieve all catalogue products.
- `GET /api/products/:id` — Retrieve single product details.
- `POST /api/products` — Create new product item (admin only).
- `PUT /api/products/:id` — Update product details or stock (admin only).
- `DELETE /api/products/:id` — Delete product (admin only).
- `GET /api/categories` — List all store categories.
- `POST /api/categories` — Add a new category (admin only).

### Orders (`/api/orders`)
- `POST /api/orders` — Place a new customer order.
- `GET /api/orders/my-orders` — Get current customer's order history.
- `GET /api/orders/all` — Get all orders across the system (admin only).
- `GET /api/orders/:id` — Get detailed order summary and delivery status.
- `PUT /api/orders/:id/status` — Update order fulfillment status.
- `PUT /api/orders/:id/assign` — Assign courier rider to order (admin only).
- `GET /api/orders/stats` — Retrieve sales volume, active transit, and inventory stats.

### Telemetry & Tracking (`/api/deliveries`)
- `GET /api/deliveries/track/:orderId` — Fetch live courier coordinates, speed, and history.
- `POST /api/deliveries/location` — Push GPS coordinates (rider / admin).
- `POST /api/deliveries/status` — Update transit status (rider / admin).

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for your personal portfolios, academic capstones, or commercial prototypes.

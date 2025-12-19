# Bask IT Up! – Project Overview & Implementation Notes

This document summarizes the current state of the project, its main features, architecture choices, and where to find key artifacts that map to the course requirements.

## Product Overview
- E-commerce storefront for themed gift baskets (Romanian market focus).
- Features: browse catalog, basket detail pages, add-to-cart, checkout, order placement, order tracking, admin dashboard for catalog and orders.
- Order lifecycle: processing → shipped → delivered → canceled (mapped internally to CREATED/PAID/FULFILLED/CANCELED).

## Codebase Layout
- Front-end: `front-end/` (Vite + React + TypeScript, shadcn UI components).
- Monolith backend: `back-end/` (Spring Boot, JPA, JWT, RabbitMQ).
- Orders service: `orders-service/` (Spring Boot).
- Inventory service (RabbitMQ consumer): `inventory-service/`.
- CI: `.github/workflows/ci.yml`.
- Local orchestration: `docker-compose.yml`.
- Postman collection: `postman/baskit.postman_collection.json`.
- Architecture docs/diagrams: `milestone3.md`, `diagrams-milestone3/`.
- Requirements traceability: `requirements_table.md`.

## Feature Highlights (by area)
### Front-end (React)
- Auth persisted in localStorage (`front-end/src/lib/auth.tsx`, key `baskit.auth.v2`); cart persisted locally (`front-end/src/lib/cart.tsx`, key `baskit.cart.v3`).
- Orders are backend-driven (no localStorage orders). API client for orders: `front-end/src/lib/orders.ts` (uses `VITE_ORDERS_API_URL` or falls back to `VITE_API_URL`).
- Checkout and orders UI: `front-end/src/pages/Checkout.tsx`, `front-end/src/pages/Orders.tsx`, `front-end/src/pages/OrderTracking.tsx`.
- Admin dashboard (catalog + orders): `front-end/src/pages/admin/Dashboard.tsx`; protected routing in `front-end/src/components/routing/ProtectedRoute.tsx`.
- Catalog fetching and mutations: `front-end/src/lib/baskets.ts`, hooks `front-end/src/hooks/useBaskets.ts`.

### Backend Monolith (`back-end/`)
- Domain models: `back-end/src/main/java/ro/baskitup/domain/model/` (Order, OrderItem, ShippingAddress, Money, etc).
- Order lifecycle via State pattern: `domain/state/*` with transitions in `Order`.
- Order service: `application/services/OrderService.java` (creates snapshots from front-end, updates status, publishes events on shipped/paid).
- Order mapping: `application/services/OrderMapper.java` → `domain/view/OrderView`.
- RabbitMQ event bus: `adapters/events/RabbitEventBus.java`; config in `config/RabbitConfig.java`; event consumer (inventory decrement placeholder) in `adapters/events/InventoryHandler.java`.
- Auth/JWT: `config/SecurityConfig.java`, `config/JwtTokenService.java`, controllers `adapters/web/AuthController.java`.
- Catalog: persistence `adapters/persistence/BasketEntity.java`, controller `adapters/web/BasketController.java`, admin controller `adapters/web/AdminBasketController.java`.
- Sample data/admin seeding: `config/SampleDataSeeder.java`, `config/AdminInitializer.java`.
- Recommendation engine (Strategy) retained in codebase (HomeController uses it), though marked as unused in requirements cleanup.

### Orders Service (`orders-service/`)
- Mirrors order snapshot API (`/api/orders`) and status updates, using RabbitMQ for `OrderPaid` events.
- Core classes: `application/services/OrderService.java`, `application/services/OrderMapper.java`, `application/services/OrderSnapshotRequest.java`.
- Event bus: `adapters/events/RabbitEventBus.java`; config `config/RabbitConfig.java`.
- REST controller: `adapters/web/OrderController.java`.
- In-memory H2 via `src/main/resources/application.yml`.
- Dockerfile present for containerization.

### Inventory Service (`inventory-service/`)
- Listens to `order-paid` queue via `adapters/events/OrderPaidListener.java`, stores processed order IDs in H2 (`adapters/persistence/ProcessedOrderRepository.java`).
- REST: `adapters/web/InventoryController.java` (`GET /api/inventory/processed`).
- Config: `src/main/resources/application.yml`; RabbitMQ setup in `config/RabbitConfig.java`.

## Architecture & Requirements Mapping
- Monolithic + microservice exploration documented in `milestone3.md` with component/deployment diagrams in `diagrams-milestone3/` (`component_mono_baskitup.png`, `deployment_micro_baskitup.png`, `component_eda.png`, etc).
- Design patterns (Strategy, State, Adapter, Observer) described in `README.md` “Design Patterns” and implemented in backend code.
- CI pipeline builds front-end and backend + Docker images (`.github/workflows/ci.yml`).
- RabbitMQ integrated: monolith publishes `OrderPaid`; inventory-service consumes; orders-service can also publish.
- Docker orchestration: `docker-compose.yml` runs frontend (5173), backend (8080), orders-service (8081), inventory-service (8082), RabbitMQ (5672/15672).
- Postman collection (`postman/baskit.postman_collection.json`) covers auth, catalog, admin, orders (monolith & orders-service), and inventory consumer endpoint.
- Requirements traceability table in `requirements_table.md` indicates met/partial gaps (missing sequence diagrams, Postman now present, third service added, etc).

## How to Run (dev/demo)
1) `docker compose up --build` (runs all services + RabbitMQ).
2) Front-end at http://localhost:5173, backend at http://localhost:8080/api, orders-service at http://localhost:8081/api, inventory-service at http://localhost:8082/api, RabbitMQ UI at http://localhost:15672.
3) Default admin seeded: `admin@baskitup.com` / `change-me-admin`.
4) Orders: front-end uses monolith by default; set `VITE_ORDERS_API_URL` to point to `http://localhost:8081/api` if you want to exercise the dedicated orders-service.
5) Inventory consumer view: GET `http://localhost:8082/api/inventory/processed` to see OrderPaid messages consumed.

## Testing / Postman
- Import `postman/baskit.postman_collection.json`.
- Set collection variables: `baseUrl`, `ordersUrl`, `inventoryUrl`, `adminToken`, `userToken`, `basketId`, `orderId`.
- Flow: register/login (captures `userToken`) → admin login to set `adminToken` → create/update/list baskets → create order snapshot → update status to “shipped” → check inventory-service processed list.

## Known Gaps vs Requirements
- Sequence diagrams are missing; class diagram exists but pattern annotations minimal.
- Microservices: three services now present, but checkout still hits the monolith; orders-service not fully integrated into UI by default.
- CI lacks automated deploy step (builds only).
- Recommendation engine remains in code; noted as unused in requirements cleanup.

## Key Files Reference
- Front-end: `src/lib/cart.tsx`, `src/lib/auth.tsx`, `src/lib/orders.ts`, `src/pages/admin/Dashboard.tsx`, `src/pages/Checkout.tsx`, `src/pages/Orders.tsx`.
- Backend: `application/services/OrderService.java`, `application/services/OrderMapper.java`, `adapters/events/RabbitEventBus.java`, `adapters/web/OrderController.java`, `config/RabbitConfig.java`, `config/SecurityConfig.java`, `domain/state/*`.
- Orders-service: `src/main/java/ro/baskitup/orders/application/services/OrderService.java`, `adapters/web/OrderController.java`.
- Inventory-service: `adapters/events/OrderPaidListener.java`, `adapters/persistence/ProcessedOrderRepository.java`, `adapters/web/InventoryController.java`.
- Docs: `README.md`, `milestone3.md`, `requirements_table.md`, `diagrams-milestone3/*`.

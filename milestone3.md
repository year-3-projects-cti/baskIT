# Milestone 3 – Architecture Exploration

## 1. Monolithic Architecture

### Structure, Components, and Data Flow
- **Single deployable unit** that packages the Spring Boot API (controllers, domain services, repositories), React UI build, background schedulers, and adapter integrations.
- **Request flow:** Browser → Nginx (optional) → Monolith. Controllers delegate to domain services (Orders, Catalog, Inventory, Payments); persistence handled via a shared PostgreSQL schema. Stripe and courier adapters are invoked directly from services. Static assets are served by the same deployment.
- **State transitions** (Order → Paid → Fulfilled) run in-process, so multi-step operations like checkout stay within a single transaction boundary.

### Deployment & Component Narrative
- Components: `Web UI`, `REST Controllers`, `Domain Services`, `Adapters (Stripe, Courier)`, `Repositories`.
- Deployment: one container/pod hosting the monolith plus sidecar/reverse proxy; connects to managed PostgreSQL, Stripe API, courier API. Scaling is vertical or by cloning the whole container.
- _Diagrams to be added_: (1) Component diagram showing UI, controllers, services, repositories in one box. (2) Deployment diagram with Client → Monolith Pod → PostgreSQL / External APIs.

### Pros
- Minimal operational overhead—one CI/CD pipeline, single runtime to monitor.
- Full ACID transactions and shared memory simplify complex flows (inventory reservation, admin updates).
- Debugging and logging straightforward because call stack stays in one process.
- Easy to introduce new features/endpoints without cross-service coordination.

### Cons
- Scaling requires replicating the entire app even if only the catalog is hot.
- Tech choices are coupled (can’t adopt a specialized stack for recommendations or analytics without affecting the rest).
- Larger blast radius: a bug in admin CMS can crash checkout.
- Build/test times grow quickly; onboarding becomes harder as the code base expands.

---

## 2. Microservices Architecture

### Structure, Components, and Data Flow
- **Domain-driven service boundaries**: `Catalog Service`, `Orders & Checkout Service`, `Inventory Service`, `Payments Service`, `Admin/BFF Service`, plus shared platform services (Auth, Audit).
- **Synchronous interactions** via REST/GraphQL through an API Gateway/BFF for customer experiences; **asynchronous** messaging (Kafka/RabbitMQ) for events such as `OrderCreated`, `InventoryAdjusted`.
- Each service owns its database/schema, exposing APIs aligned with its bounded context. Authorization handled centrally at the gateway with JWT verification and propagated claims.

### Deployment & Component Narrative
- Components: Gateway, multiple microservices with their own persistence layers, message broker, observability stack (Prometheus, ELK), CI/CD pipelines per service.
- Deployment: independent containers/pods per service running in Kubernetes or ECS, gateway routing external traffic, broker enabling inter-service events. Databases may be polyglot (Postgres for orders, Redis for catalog cache, etc.).
- _Diagrams to be added_: (1) Component diagram highlighting services and interactions (REST arrows + event bus). (2) Deployment diagram showing pods per service, gateway ingress, broker, databases.

### Pros
- Independent scaling and deployments: spike in catalog traffic doesn’t force redeploying checkout.
- Strong service ownership enables parallel team workstreams and faster localized innovation.
- Fault isolation: failure in the recommendation service does not bring down payments.
- Easier to mix the best technology per domain (e.g., Go for Payments, Node for Notifications).

### Cons
- Requires mature DevOps: service discovery, configuration management, centralized logging/tracing.
- Higher latency and more failure modes (network hops, partial outages) demand retries, circuit breakers, sagas for distributed transactions.
- Data consistency becomes eventual; cross-cutting changes require orchestrated deployments.
- Overkill for a small two-person team and MVP-level traffic; operational cost is high.

---

## 3. Event-Driven Modular Architecture

### Structure, Components, and Data Flow
- **Modular monolith (or a few coarse services)** internally organized around domain modules (Orders, Catalog, Inventory) but communicating through an event bus/interface.
- **Command side:** REST API accepts commands (`CreateOrder`, `PayOrder`, `UpdateBasket`) handled synchronously for immediate feedback. **Event side:** modules publish domain events (`OrderPaid`, `InventoryReserved`, `BasketFeaturedUpdated`) to a lightweight broker (Spring events, Kafka, or Redis Streams). Subscribers perform side-effects (emails, shipping label creation, VAT reconciliation) or update materialized views for fast reads (CQRS approach).
- Read projections (e.g., Featured Baskets, Admin dashboards) are maintained by dedicated handlers, enabling specialized data models without burdening the write model.

### Deployment & Component Narrative
- Components: `Command API`, `Order Core`, `Catalog Module`, `Inventory Module`, `Event Bus`, `Notification Handler`, `Shipping Integration`, `Analytics/Recommendations`.
- Deployment: can run as a single Spring Boot artifact but with an embedded/attached broker; projections may run as lightweight workers. If needed, individual handlers can be separated into their own containers while still consuming the same event stream.
- _Diagrams to be added_: (1) Component diagram emphasizing command flow vs. event subscribers. (2) Deployment diagram showing monolith core plus external worker containers connected to the broker and third-party APIs.

### Pros
- Decouples side-effects from transactional flows, matching the project’s needs for audit logs, idempotent webhooks, and pluggable shipping/payment adapters.
- Supports incremental feature addition: a new recommendation engine simply subscribes to events without modifying checkout logic.
- Provides a smooth migration path—handlers can later be extracted into services if scale demands, while keeping today’s simpler deployment.
- Encourages resilience: event handlers can retry independently, commands stay fast.

### Cons
- Adds conceptual complexity (event schemas, eventual consistency for projections) compared to a pure monolith.
- Requires robust messaging infrastructure and monitoring of handler failures.
- Debugging across asynchronous chains needs good tracing/correlation IDs.
- Designers must carefully manage idempotency, ordering, and schema evolution for events.

---

## Comparative Evaluation and Recommendation

| Criteria | Monolith | Microservices | Event-Driven Modular |
| --- | --- | --- | --- |
| **Team fit (2 devs)** | Excellent | Poor | Good |
| **Operational overhead** | Low | High | Moderate |
| **Feature velocity** | High initially, slows with size | Variable per service | High (modules are decoupled) |
| **Scalability needs** | Coarse-grained | Fine-grained | Start coarse, optional fine-grained |
| **Integrations (Stripe, couriers, demo basket generator)** | Easy but tightly coupled | Clean via adapters per service | Naturally handled by event subscribers |
| **Auditability & lifecycle tracking** | Centralized logs only | Requires distributed tracing | Built-in via event stream |

**Final choice:** adopt an **Event-Driven Modular architecture** implemented as a modular monolith today.

**Rationale:**
1. Meets current team size and MVP timeline—single deployment keeps operations simple.
2. Directly addresses critical requirements (strict order lifecycle, audit logs, seasonal recommendations, pluggable shipping) via domain events and asynchronous handlers.
3. Provides future-proofing: as traffic grows, individual handlers or modules can be promoted into standalone services without redesigning the domain or APIs.

Next steps once diagrams are ready: integrate them into this README, document event contracts, and validate the messaging approach (e.g., Spring Application Events initially, Kafka later) to ensure smooth implementation.


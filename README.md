# Bask IT Up! - Themed gift baskets
**Bask IT Up!** is an e‑commerce web app for curated, themed gift baskets focused on the Romanian market. Customers can browse categories, view basket pages with images, descriptions, prices in RON and stock status, add items to a cart, and pay securely via Stripe. At checkout they provide contact and shipping details (with an optional gift note), receive order confirmation, and can track delivery. Orders follow a clear lifecycle (Created → Paid → Fulfilled → Canceled/Refunded), and inventory is tracked **per basket** with safeguards to prevent overselling.

Admins have a single **ADMIN** role with full access via a simple dashboard to manage baskets, categories, prices, images, and orders; generate shipping labels and store tracking through a pluggable courier integration (e.g., aggregator or FanCourier/SameDay); and review a complete audit log of sensitive actions and state changes. The MVP is a mobile‑first React + Spring Boot + PostgreSQL monolith using ports/adapters, JWT authentication, webhook signature verification, configurable VAT, structured logs, and idempotent webhooks—providing a solid baseline for later extensions such as build‑your‑own baskets.

## Team

* *PRODAN Florin Mihai Alexandru* - 1241EA
* *DUMITRU Vlad Andrei* - 1241EA



## Running with Docker

Build and launch both the Spring Boot API and the Vite front-end with:

```sh
docker compose up --build
```

Services:

- Front-end (Nginx serving the Vite build) → http://localhost:5173
- Back-end (Spring Boot) → http://localhost:8080

Stop everything via `docker compose down`. Adjust environment variables (Spring profiles, DB URLs, API keys) directly inside `docker-compose.yml` when needed.

## Default Admin Account

On first boot the backend seeds a root administrator:

- Email: `admin@baskitup.com`
- Password: `change-me-admin`

Log in with these credentials, update the password from the Admin area, and override the values via `APP_ADMIN_EMAIL` / `APP_ADMIN_PASSWORD` in production.

## Basket API Highlights

- `GET /api/baskets` – public catalog feed (optional `category`, `search` query params).
- `GET /api/baskets/{slug}` – full HTML description for product detail pages.
- `POST /api/admin/baskets` – create (roles: ADMIN, CONTENT_MANAGER).
- `PUT /api/admin/baskets/{id}` – update.
- `DELETE /api/admin/baskets/{id}` – delete.

Product descriptions accept full HTML so content managers can embed rich layouts and imagery directly from the CMS.

## Design Patterns


### 1) Strategy — Pluggable basket recommendations

* **Problem:** The home page “Featured baskets” should not be hard‑coded. We want to switch the selection logic (bestsellers, new arrivals, seasonal picks, manual curation) without touching controllers or redeploying for every campaign.
* **Solution in BaskIT:** Define a `RecommendationStrategy` with `getFeaturedBaskets(user, context)`. Provide implementations like `BestSellerStrategy`, `NewestStrategy`, `SeasonalStrategy`, and `ManualCurationStrategy`. A small `RecommendationEngine` picks a strategy via config/date or runs A/B tests.
* **Why not a simple alternative:** Embedding `if/else` rules in controllers mixes presentation with business logic and requires code changes for each campaign. **Strategy** keeps the page logic clean, makes each algorithm unit‑testable, and lets us switch or add strategies with zero impact on the rest of the flow.


### 2) State — Enforce valid order lifecycles

* **Problem:** Orders must follow strict rules (e.g., only **Paid** orders can ship; **Canceled** orders may require refunds). Spreading `if (status == X)` checks across controllers/services is error‑prone.
* **Solution in BaskIT:** Model `OrderState` objects (`CreatedState`, `PaidState`, `FulfilledState`, `CanceledState`). The `Order` delegates transition methods like `pay()`, `fulfill()`, `cancel()` to its current state, which validates and performs the transition.
* **Why not an enum + switch:** An enum centralizes the label but not the behavior; business rules still leak everywhere. **State** encapsulates transition rules, prevents illegal transitions by construction, and provides a single place to emit domain events and audit entries when the status changes.

### 3) Adapter — Integrate external providers cleanly

* **Problem:** Stripe and couriers have heterogeneous SDKs/REST payloads. Calling them directly from domain code couples us to vendor details and complicates testing.
* **Solution in BaskIT:** Use **ports** (`PaymentPort`, `ShippingPort`) in the application layer and **adapters** that translate domain requests into provider‑specific calls (`StripeAdapter`, `EcoletAdapter`, `FanCourierAdapter`, `SameDayAdapter`). For development, a `FakeShippingAdapter` can return deterministic labels.
* **Why not “just call the SDK”:** Direct calls scatter vendor logic and error handling everywhere, making swaps/mocks painful. **Adapter** keeps the domain vendor‑agnostic, simplifies stubbing in tests, and allows swapping providers without touching core logic.

### 4) Observer / Domain Events — Decouple side‑effects

* **Problem:** On `OrderPaid` we must send email, decrement stock, generate shipping, and write audit logs. Inlining these steps makes checkout brittle and tightly coupled.
* **Solution in BaskIT:** Publish domain events (`OrderCreated`, `OrderPaid`, `OrderFulfilled`, `InventoryAdjusted`). Handlers subscribe to these events: EmailNotificationHandler, InventoryHandler, ShippingHandler, AuditLogHandler. Start synchronous in‑process; later the same handlers can be triggered by a message broker without redesign.
* **Why not call everything directly:** Chained calls turn one failure into a broken checkout and make retries/idempotency messy. **Observer** isolates concerns, improves resiliency, and enables independent testing and evolution of side‑effects.

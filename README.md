# Budman Core **Budman** is a personal finance and budgeting platform built with a modern, modular architecture. It supports multi-platform clients (web + mobile), seamless integrations with banks and e-wallets, AI-assisted financial planning, and real-time transaction processing. --- ## 🚀 Architecture Overview We recommend a **monorepo** setup (Nx / Turborepo) with three workspaces: - **`backend/`** — [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) (Postgres) - **`web/`** — [Next.js](https://nextjs.org/) (React) - **`mobile/`** — [React Native](https://reactnative.dev/) ### Core Infrastructure - **Backend Framework**: NestJS (REST/GraphQL APIs) - **Database**: Postgres (managed: RDS / Cloud SQL) - **Queue System**: Redis + BullMQ (background jobs: sync, OCR, notify, normalize) - **Storage**: S3-compatible (attachments, CSV imports, backups) - **Secrets**: Vault / AWS Secrets Manager - **Observability**: - Errors: Sentry - Metrics: Prometheus + Grafana - Logs: ELK / Datadog - **CI/CD**: GitHub Actions → build/test → deploy (Kubernetes / ECS / DigitalOcean) - **Infrastructure**: Kubernetes (EKS/GKE) or ECS; Postgres on RDS

---

## 📦 Core Modules (NestJS)

### 1. Auth Module

- JWT access + refresh tokens
- Password hashing (argon2/bcrypt)
- Optional OAuth (SSO providers)
- Endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `GET /auth/me`
- Security: rate limiting, account lockout policy

### 2. Users Module

- Profile management
- KYC status tracking
- Preferences (currency, timezone, notification settings)

### 3. Accounts Module

- Manage linked external accounts
- Table: `external_accounts`
  - provider, provider_account_id, masked_id, last_synced_at, status
- CRUD APIs for linking/unlinking accounts

### 4. Transactions Module

- Core `transactions` table
- Normalization pipeline
- Endpoints:
  - `GET /transactions`
  - `POST /transactions` (manual)
  - `POST /transactions/import` (CSV/OCR)
- Duplicate detection: `(provider, provider_txn_id)` unique index or hash signature

### 5. Categories & Rules Module

- User-defined categories
- Rules engine: regex-based or ML model
- Rules auto-apply during import

### 6. Budgets & Goals Module

- CRUD for budgets
- Track `used_amount`, rollover logic
- Fetch progress & projections

### 7. Integrations Module

- Adapter pattern with base class `BaseProviderAdapter`
- Example adapters:
  - `MomoAdapter`
  - `VietcombankAdapter`
  - `AggregatorAdapter` (SaltEdge / Brankas)
- Responsibilities:
  - Consent/auth flow
  - Token management
  - Fetch transactions
  - Webhook handling

### 8. AI Planner Module

- Builds **personalized financial plans** using OpenAI
- Input: salary, expected raises, balances, budget preferences
- Stores & versions plan outputs
- Caching to avoid repeated API calls

### 9. Notifications Module

- Email, push, and in-app notifications
- Alerts for budget thresholds, reminders
- Providers:
  - Push → FCM / APNs
  - Email → SendGrid / SES

### 10. Workers / Jobs

- Background tasks:
  - Provider sync jobs
  - OCR processing
  - Rule-based recategorization
  - Sending notifications
  - Reforecasting projections

---

## ⚙️ Development Setup

### Prerequisites

- Node.js 18+
- Postgres 14+
- Redis
- S3-compatible storage (e.g., MinIO for local dev)
- Docker & Docker Compose (recommended)

### Running locally

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev
```

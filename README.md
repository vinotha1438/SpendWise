# 💰 SpendWise — Personal Finance Management App

A full-stack personal finance application with a strong focus on **data consistency** — every account balance, dashboard total, and report is derived from a single, correct source of truth instead of being recalculated differently on every page.

🔗 **Live Demo:** [spend-wise-nine-roan.vercel.app](https://spend-wise-nine-roan.vercel.app/)
📦 **Source Code:** this repository

> Note: the backend runs on a free-tier server, so it may take 30–50 seconds to "wake up" if it hasn't been used recently. Please be patient on first load!

---

## ✨ Features

- **Accounts** — Bank, Cash, and Wallet/UPI accounts with correct `opening_balance + income − expenses` tracking
- **Income & Expenses** — full CRUD with automatic account balance adjustment on add, edit (same-account or cross-account), and delete
- **Self Transfers** — move money between your own accounts without it being counted as income or expense
- **Paid To** — track who/where an expense was paid to (Rent, Amazon, Swiggy, a person's name, etc.), separate from general notes
- **Budgets** — set a monthly budget per category, with correctly month/year-scoped progress tracking on the dashboard
- **Goals** — savings goals linked to real accounts; adding money deducts from a chosen account, deleting restores it
- **Recurring Expenses** — reminders for recurring payments
- **Analytics & Reports** — category breakdowns, trends, PDF/Excel export
- **Search / Filter / Sort** — search by title or payee, filter by category and date range, sort by date or amount
- **Notifications** — real-time notification bell for account activity
- **Real-time multi-device sync** — changes made on one device (phone, another tab, another browser) appear instantly on every other logged-in device via Socket.io, without needing to refresh
- **Google Sign-In** — sign in with a Google account alongside normal email/password auth
- **PWA support** — installable as a standalone app on desktop or mobile
- **English / Tamil** — full i18n support with language switching
- **Dark mode**

---

## 🏗️ Architecture — Single Source of Truth

The most important design decision in this project: **account balances are the source of truth**, not a recalculation of `total income − total expense`.

```
Database (MySQL)
      ↓
Account current_balance
   (opening_balance + income − expenses, maintained incrementally)
      ↓
DataContext (shared React context)
      ↓
Dashboard, Sidebar, Reports, Analytics, Budget Progress
   (all read the SAME totalBalance, no page computes its own)
```

Every income/expense add, edit (including moving between accounts), and delete correctly adjusts the affected account's balance in the same request — verified by an automated test suite (`backend/tests`).

Real-time sync (Socket.io) means that when any of these operations happens on one device, every other connected device for that user receives a `data-changed` event and silently refetches — so two open tabs, or a phone and a laptop, never show conflicting numbers.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router, Axios, Tailwind CSS, Recharts, react-i18next, Socket.io-client

**Backend:** Node.js, Express, MySQL (mysql2), JWT authentication, Socket.io, Google OAuth (google-auth-library)

**Database:** MySQL

**Testing:** Jest (backend balance-logic unit tests)

---

## ☁️ Deployment

| Layer | Service | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Auto-deploys from `main` branch |
| Backend | [Render](https://render.com) | Free-tier web service (spins down after inactivity) |
| Database | [Aiven](https://aiven.io) | Free-tier managed MySQL, SSL required |

All three run on free tiers, so this project costs $0/month to keep live.

---

## 📂 Project Structure

```
SpendWise/
├── backend/
│   ├── config/          # DB connection (pool)
│   ├── controllers/      # Business logic per feature
│   ├── middleware/        # JWT auth middleware
│   ├── routes/            # Express route definitions
│   ├── tests/              # Jest test suite
│   ├── utils/               # Shared validation helpers
│   ├── socket.js             # Socket.io setup + notifyUser helper
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/     # Feature-grouped components
│       ├── context/          # DataContext — the shared data layer
│       ├── pages/              # Route-level pages
│       ├── locales/             # en / ta translations
│       └── utils/                 # Shared filter/sort helpers
├── database/                        # SQL migrations
├── package.json                       # Backend dependencies (root-level)
└── jest.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone and install

```bash
git clone <your-repo-url>
cd SpendWise

# backend dependencies (installed at root)
npm install

# frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Set up the database

Run the SQL files in `database/` against your MySQL instance to create the schema and apply migrations.

### 3. Configure environment variables

Create `backend/.env`:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=spendwise_db
DB_SSL=false
JWT_SECRET=a_long_random_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

> If connecting to a cloud MySQL provider that requires SSL (e.g. Aiven), set `DB_SSL=true` and use the host/port/credentials provided by your database dashboard.

Create `frontend/.env`:

```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_API_URL=http://localhost:3000
```

> Get a Google Client ID from [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth Client ID (Web application). Add `http://localhost:5173` as an authorized JavaScript origin for local development.

### 4. Run it

```bash
# backend
cd backend
node server.js

# frontend (separate terminal)
cd frontend
npm run dev
```

Visit `http://localhost:5173`.

### 5. Run the tests

```bash
npm test
```

---

## 🧪 Testing

The test suite focuses on the highest-risk area of the app: **account balance correctness**. It verifies, without needing a real database:

- Adding an expense deducts exactly the right amount from the right account
- Editing an expense's amount (same account) applies only the *difference*
- Editing an expense's account moves the balance correctly between the old and new account
- Deleting an expense restores the exact amount
- Invalid input (negative amounts, empty titles, bad dates) is rejected before ever touching the database

```bash
npm test
```

---

## 📄 License

This project is for personal/educational use.
## Amazon Clone (Scaler SDE Intern Fullstack Assignment)

Functional e-commerce app implementing the assignment’s **must-have** features:

- **Product listing**: grid layout, search by name/brand, filter by category, add-to-cart
- **Product detail**: image carousel, description/specs, price, stock, add-to-cart, buy-now
- **Shopping cart**: view items, update quantity, remove items, subtotal
- **Order placement**: checkout shipping form + review, place order, confirmation page with order ID

### Tech stack

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Prisma ORM)

### Assumptions

- **No login required**: the backend assumes a default user (`default@amazon-clone.dev`) is logged in.
- **Sample data**: products are seeded into the DB across multiple categories.

### Run locally (Windows / PowerShell)

#### 1) Start Postgres (Docker)

From `amazon-clone/server`:

```bash
docker compose up -d
```

#### 2) Backend setup

```bash
cd server
copy .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend runs on `http://localhost:4000`.

#### 3) Frontend setup

In another terminal:

```bash
cd ..
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Environment variables

- **Frontend**: optional `VITE_API_BASE` (defaults to `http://localhost:4000`)
- **Backend**: see `server/.env.example`

### Gmail Configuration for Order Emails

To send real order confirmation emails to users through Gmail:
1. Go to your Google Account > Security > 2-Step Verification.
2. Scroll down to **App passwords**.
3. Create a new App password for "Amazon Clone".
4. Copy the 16-character password.
5. In `server/.env`, set `SMTP_USER` to your Gmail address and `SMTP_PASS` to the app password. Ensure `SMTP_HOST="smtp.gmail.com"` and `SMTP_PORT=465`.

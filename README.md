# Inventory & Order Management System

A production-ready, containerized full-stack application for managing products, customers, orders, and inventory tracking.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI |
| Frontend | React (Vite) |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |

## Features

- **Product Management** — CRUD with unique SKU validation and non-negative stock
- **Customer Management** — CRUD with unique email validation
- **Order Management** — Create orders with automatic total calculation and inventory deduction
- **Dashboard** — Summary stats and low-stock alerts
- **Responsive UI** — Works on desktop and mobile

## Quick Start (Docker Compose)

### Prerequisites

- Docker & Docker Compose installed

### Run the application

```bash
# Clone the repository
git clone <your-repo-url>
cd inventory-order-management

# Copy environment variables
cp .env.example .env

# Start all services
docker compose up --build
```

### Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer |
| GET | `/customers` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List all orders |
| GET | `/orders/{id}` | Get order by ID |
| DELETE | `/orders/{id}` | Cancel/delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Dashboard statistics |

## Business Rules

- Product SKU must be unique
- Customer email must be unique
- Product quantity cannot be negative
- Orders fail if inventory is insufficient
- Creating an order automatically reduces stock
- Order total is calculated by the backend
- Deleting an order restores inventory

## Local Development (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set DATABASE_URL to your PostgreSQL instance
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
export CORS_ORIGINS=http://localhost:5173

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
export VITE_API_URL=http://localhost:8000
npm run dev
```

## Deployment

### Backend — Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository and set:
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Environment Variables**:
     - `DATABASE_URL` — from Render PostgreSQL or external DB
     - `CORS_ORIGINS` — your frontend URL (e.g. `https://your-app.vercel.app`)
4. Deploy and note the backend URL

### Backend — Docker Hub

```bash
# Build and push backend image
docker build -t your-dockerhub-username/inventory-backend:latest ./backend
docker push your-dockerhub-username/inventory-backend:latest
```

### Frontend — Vercel

1. Import the GitHub repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` — your deployed backend URL (e.g. `https://your-api.onrender.com`)
4. Deploy

### Frontend — Netlify

1. Import repo on [Netlify](https://netlify.com)
2. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Environment variable: `VITE_API_URL=<backend-url>`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | — |
| `POSTGRES_DB` | Database name | `inventory_db` |
| `DATABASE_URL` | Full PostgreSQL connection string | — |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |
| `VITE_API_URL` | Backend API URL for frontend | `http://localhost:8000` |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── config.py
│   │   └── routers/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Submission Checklist

- [ ] GitHub repository with frontend and backend code
- [ ] Docker Hub image for backend (`your-username/inventory-backend`)
- [ ] Live frontend URL (Vercel/Netlify)
- [ ] Live backend API URL (Render/Railway/Fly.io)

## License

MIT

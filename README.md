# VanVyaapaar - Tribal Crafts E-Commerce Platform

A full-stack e-commerce web application for tribal artisans to sell handcrafted products. Built with Spring Boot (backend) and React + TypeScript (frontend).

---

## Project Structure

```
Vanvyaapaar/
├── vanpaayaar-backend/        # Spring Boot REST API
│   ├── src/main/java/com/tribal/
│   │   ├── controller/        # REST controllers
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Spring Data JPA repos
│   │   ├── service/           # Business logic
│   │   └── security/          # JWT auth filter & config
│   ├── Dockerfile
│   └── pom.xml
│
├── vanvyapaar-frontend/       # React + TypeScript SPA
│   ├── src/
│   │   ├── pages/             # Route-level components
│   │   ├── components/        # Shared UI components
│   │   ├── services/          # Axios API calls
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
│
├── k8s/                       # Kubernetes manifests
│   ├── deployment.yaml
│   └── service.yml
└── Jenkinsfile                # CI/CD pipeline
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Material UI |
| State Management | Zustand |
| HTTP Client | Axios |
| Backend | Spring Boot 3.5.6, Java 17 |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI/CD | Jenkins |
| Web Server | Nginx (serves frontend, proxies API) |

---

## Application Features

### Three User Roles

**Buyer**
- Browse and search products by name, category, price range
- Add to cart, update quantities, remove items
- Place orders (Cash on Delivery)
- View order history
- Manage profile

**Seller**
- Register (requires Admin approval)
- Add, edit, delete products
- View and update incoming order status
- Dashboard with sales summary

**Admin**
- Approve / suspend / delete sellers
- Manage buyers
- View and delete products
- Monitor all orders
- Dashboard metrics (total users, products, orders, revenue)

---

## API Endpoints Summary

### Auth — `/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login (role: ADMIN / BUYER / SELLER) |
| POST | `/auth/signup/buyer` | Register as buyer |
| POST | `/auth/signup/seller` | Register as seller |

### Buyer — `/buyer`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/buyer/products` | List all products |
| GET | `/buyer/products/{id}` | Get product detail |
| POST | `/buyer/{id}/cart/add/{productId}` | Add to cart |
| GET | `/buyer/{id}/cart` | Get cart |
| PUT | `/buyer/cart/{cartItemId}` | Update cart item |
| DELETE | `/buyer/cart/{cartItemId}` | Remove cart item |
| POST | `/buyer/{id}/orders` | Place order |
| GET | `/buyer/{id}/orders` | Get order history |
| GET | `/buyer/{id}/profile` | Get profile |
| PUT | `/buyer/{id}/profile` | Update profile |
| GET | `/buyer/search?keyword=` | Search products |
| GET | `/buyer/filter/category?category=` | Filter by category |
| GET | `/buyer/filter/price?min=&max=` | Filter by price |

### Seller — `/seller`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/seller/{id}` | Get seller profile |
| PUT | `/seller/{id}` | Update profile |
| POST | `/seller/{id}/products` | Add product |
| GET | `/seller/{id}/products` | Get seller's products |
| PUT | `/seller/products/{productId}` | Update product |
| DELETE | `/seller/products/{productId}` | Delete product |
| GET | `/seller/{id}/orders` | Get orders |
| PUT | `/seller/orders/{orderId}/status` | Update order status |
| GET | `/seller/{id}/dashboard` | Dashboard metrics |

### Admin — `/admin`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard/metrics` | Dashboard stats |
| GET | `/admin/sellers` | All sellers |
| GET | `/admin/sellers/pending?status=PENDING` | Pending sellers |
| PUT | `/admin/sellers/{id}/approve` | Approve seller |
| PUT | `/admin/sellers/{id}/suspend` | Suspend seller |
| GET | `/admin/buyers` | All buyers |
| DELETE | `/admin/buyers/{id}` | Delete buyer |
| GET | `/admin/products` | All products |
| DELETE | `/admin/products/{id}` | Delete product |
| GET | `/admin/orders` | All orders |

### Public — `/public`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/public/products` | Browse products (no auth) |
| GET | `/public/products/{id}` | Product detail (no auth) |
| GET | `/public/sellers` | Browse artisans (no auth) |

---

## Database Schema

### Tables

```
admin          — id, name, email, password, phone, address, pincode
buyer          — id, name, email, password, phone, address, pincode
seller         — id, name, email, password, phone, address, pincode,
                 tribe_name, artisan_category, region, bio,
                 bank_account_number, ifsc_code, pan_number,
                 admin_approval_status (PENDING/APPROVED/REJECTED)
product        — id, name, description, category, price, stock,
                 image_url, featured, seller_id (FK → seller)
cart           — id, buyer_id (FK), product_id (FK), quantity, order_id (FK, nullable)
orders         — id, buyer_id (FK), seller_id (FK), status, total_amount, order_date
```

### Relationships
- Seller → Products (one-to-many)
- Buyer → Cart items (one-to-many)
- Cart items → Order (many-to-one, null = still in cart)
- Order → Buyer, Seller (many-to-one)

---

## AWS Architecture (for diagram)

Below is the recommended AWS deployment architecture. Use this to draw the diagram.

```
                          ┌─────────────────────────────────────────────────────┐
                          │                    AWS Cloud                         │
                          │                                                       │
  Users ──── HTTPS ──────►│  Route 53 (DNS)                                      │
                          │       │                                               │
                          │       ▼                                               │
                          │  CloudFront (CDN)                                     │
                          │       │                                               │
                          │  ┌────┴──────────────────────────────────┐           │
                          │  │           VPC (Virtual Private Cloud)  │           │
                          │  │                                         │           │
                          │  │  ┌──────────────────────────────────┐  │           │
                          │  │  │       Public Subnet               │  │           │
                          │  │  │                                   │  │           │
                          │  │  │  Application Load Balancer (ALB)  │  │           │
                          │  │  │           │                       │  │           │
                          │  │  └───────────┼───────────────────────┘  │           │
                          │  │             │                            │           │
                          │  │  ┌──────────┼───────────────────────┐  │           │
                          │  │  │       Private Subnet              │  │           │
                          │  │  │                                   │  │           │
                          │  │  │  ┌────────────┐  ┌────────────┐  │  │           │
                          │  │  │  │  ECS/EC2   │  │  ECS/EC2   │  │  │           │
                          │  │  │  │  Frontend  │  │  Backend   │  │  │           │
                          │  │  │  │  (Nginx +  │  │ (Spring    │  │  │           │
                          │  │  │  │   React)   │  │  Boot)     │  │  │           │
                          │  │  │  │  Port 3000 │  │  Port 8080 │  │  │           │
                          │  │  │  └────────────┘  └─────┬──────┘  │  │           │
                          │  │  │                         │         │  │           │
                          │  │  │  ┌──────────────────────▼──────┐  │  │           │
                          │  │  │  │     Amazon RDS (MySQL 8)     │  │  │           │
                          │  │  │  │     Database: vanvyaapaar    │  │  │           │
                          │  │  │  │     Port: 3306               │  │  │           │
                          │  │  │  └─────────────────────────────┘  │  │           │
                          │  │  └──────────────────────────────────┘  │           │
                          │  │                                         │           │
                          │  │  ┌──────────────────────────────────┐  │           │
                          │  │  │  ECR (Elastic Container Registry) │  │           │
                          │  │  │  - vanvyaapaar-frontend:latest    │  │           │
                          │  │  │  - vanvyaapaar-backend:latest     │  │           │
                          │  │  └──────────────────────────────────┘  │           │
                          │  └─────────────────────────────────────────┘           │
                          │                                                         │
                          │  ┌──────────────────────────────────────────────────┐  │
                          │  │  CI/CD Pipeline                                   │  │
                          │  │  GitHub → Jenkins → Docker Build → ECR → Deploy  │  │
                          │  └──────────────────────────────────────────────────┘  │
                          └─────────────────────────────────────────────────────────┘
```

### AWS Services Used

| Service | Purpose |
|---|---|
| Route 53 | DNS management, domain routing |
| CloudFront | CDN for static frontend assets |
| ALB (Application Load Balancer) | Distributes traffic to frontend/backend |
| ECS (Elastic Container Service) | Runs Docker containers for frontend & backend |
| ECR (Elastic Container Registry) | Stores Docker images |
| RDS (MySQL) | Managed MySQL database |
| VPC | Network isolation with public/private subnets |
| Security Groups | Firewall rules (ALB → ECS → RDS) |
| IAM | Roles and permissions for services |

### Traffic Flow
1. User hits domain → Route 53 resolves DNS
2. Request goes to CloudFront → serves cached static assets (React build)
3. API calls (`/auth/*`, `/buyer/*`, `/seller/*`, `/admin/*`) → ALB → Backend ECS container
4. Backend connects to RDS MySQL on port 3306 (private subnet only)
5. Jenkins pipeline builds Docker images → pushes to ECR → triggers ECS deployment

---

## Local Development Setup

### Prerequisites
- Java 17
- Maven 3.9+
- Node.js 18+
- MySQL 8
- Docker (optional)

### 1. Database Setup

```sql
CREATE DATABASE vanvyaapaar;
```

### 2. Backend

```bash
cd vanpaayaar-backend

# Update src/main/resources/application.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/vanvyaapaar
# spring.datasource.username=your_username
# spring.datasource.password=your_password

mvn spring-boot:run
# Runs on http://localhost:8080
```

### 3. Frontend

```bash
cd vanvyapaar-frontend

# Create .env file:
# VITE_API_BASE_URL=http://localhost:8080

npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:5173
```

### 4. Docker Compose (both services together)

```bash
# From project root
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

---

## Docker Images

### Build Backend Image
```bash
cd vanpaayaar-backend
docker build -t vanvyaapaar-backend:latest .
```

### Build Frontend Image
```bash
cd vanvyapaar-frontend
docker build -t vanvyaapaar-frontend:latest .
```

### Push to ECR
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker tag vanvyaapaar-backend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vanvyaapaar-backend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vanvyaapaar-backend:latest

docker tag vanvyaapaar-frontend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vanvyaapaar-frontend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vanvyaapaar-frontend:latest
```

---

## Environment Variables for AWS Deployment

### Backend (ECS Task Definition / Environment)
```
SPRING_DATASOURCE_URL=jdbc:mysql://<rds-endpoint>:3306/vanvyaapaar
SPRING_DATASOURCE_USERNAME=admin
SPRING_DATASOURCE_PASSWORD=<your-rds-password>
JWT_SECRET=<strong-random-secret-min-32-chars>
```

### Frontend (build-time)
```
VITE_API_BASE_URL=https://<your-alb-dns-or-domain>/api
```

---

## Security Notes for AWS

- RDS must be in **private subnet** — no public access
- Backend ECS security group: allow inbound 8080 only from ALB security group
- RDS security group: allow inbound 3306 only from Backend ECS security group
- Frontend ECS security group: allow inbound 3000 from ALB
- ALB: allow inbound 80 and 443 from internet (0.0.0.0/0)
- Use **AWS Secrets Manager** or **Parameter Store** for DB credentials and JWT secret — do not hardcode in task definitions

---

## Default Admin Account

To create the first admin, insert directly into the database:

```sql
INSERT INTO admin (name, email, password, confirm_password)
VALUES ('Admin', 'admin@vanvyaapaar.com', 'admin123', 'admin123');
```

Then login at `/login` with role = ADMIN.

---

## Ports Reference

| Service | Port |
|---|---|
| Frontend (Nginx) | 3000 |
| Backend (Spring Boot) | 8080 |
| MySQL | 3306 |

---

## Team Members
<!-- Add your team names here -->

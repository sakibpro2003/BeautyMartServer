# BeautyMart Backend

## 📌 Overview
BeautyMart is an online medicine e-commerce platform that allows users to purchase medicines with ease. This repository contains the backend API built using Node.js, Express, and MongoDB, handling authentication, product management, orders, payments, and more.

## 🚀 Live API URL
[Live API](#) (Replace with actual URL after deployment)

## 🛠️ Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and Authorization
- **Bcrypt** - Password hashing
- **ShurjoPay** - Payment Gateway Integration

---

## 🏗️ Installation & Setup

### 📌 Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)

### 🔧 Steps to Run Locally
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/BeautyMart-backend.git
   cd BeautyMart-backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   - Create a `.env` file in the root directory and add the following:
     ```env
     PORT=5000
     DATABASE_URL="your mongodb url"
     BCRYPT_SALT_ROUNDS=12
     JWT_ACCESS_SECRET="jwt secret"
     SP_ENDPOINT=https://sandbox.shurjopayment.com
     SP_USERNAME="your surjopay username"
     SP_PASSWORD="your surjopay password"
     SP_PREFIX=SP
     ```
4. **Run the server**
   ```sh
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

---

## 🔀 API Routes

### 👤 Authentication
| Method | Endpoint       | Description          |
|--------|--------------|----------------------|
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login` | User login |

### 🏥 Products
| Method | Endpoint        | Description            |
|--------|----------------|------------------------|
| GET    | `/api/products` | Get all products      |
| GET    | `/api/products/:id` | Get product by ID |

### 📦 Orders
| Method | Endpoint       | Description             |
|--------|--------------|-------------------------|
| POST   | `/api/orders` | Place a new order |
| GET    | `/api/orders/:id` | Get order details |

### 💳 Payments
| Method | Endpoint       | Description             |
|--------|--------------|-------------------------|
| POST   | `/api/payments/initiate` | Initiate payment |
| POST   | `/api/payments/verify` | Verify payment |

---

## 🚀 Deployment

### 📌 Deploy on Vercel
1. Install Vercel CLI:
   ```sh
   npm i -g vercel
   ```
2. Run deployment:
   ```sh
   vercel
   ```
3. Set up environment variables in Vercel dashboard.

### 📌 Deploy on Render
1. Create a new web service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Add environment variables in the **Settings** tab.
4. Click **Deploy**.

---

## ❓ Troubleshooting
- If the server doesn't start, ensure MongoDB is running and `.env` variables are set.
- For database errors, check the `DATABASE_URL`.
- If payments fail, verify **ShurjoPay** credentials.

---

## 🤝 Contributing
Feel free to open issues or submit pull requests!

---

## 📜 License
This project is licensed under the MIT License.


# Sovereign Woodcraft V2  
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)  
![Express.js](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)  
![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)  
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)  
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)  
![License](https://img.shields.io/badge/License-MIT-yellow)  

---

## **About Sovereign Woodcraft**
**Sovereign Woodcraft** is a premier e-commerce platform dedicated to connecting discerning customers with timeless, handcrafted wooden furniture.

Our mission is to celebrate the **art of woodworking** by providing a space where **master artisans** can showcase their bespoke creations. Each piece tells a story of **unparalleled quality**, **sustainable sourcing**, and **enduring design**.

This project is the **digital home** for that vision — a **robust, full-stack application** designed to deliver a **seamless and elegant user experience** from browsing to checkout.

---

## ✨ **Core Features**
- ✅ **Interactive Product Gallery** – Browse high-resolution images of all woodcraft products.
- ✅ **Shopping Cart & Secure Checkout** – Smooth, intuitive, and secure purchasing experience.
- ✅ **User Authentication & Profiles** – Secure registration/login, order history, and profile management.
- ✅ **Full Product Management (CRUD)** – Admin dashboard to manage product listings.
- ✅ **Dynamic File Uploads** – Efficient image handling using **Multer**.
- ✅ **Well-Structured RESTful API** – Clean and predictable for smooth communication.
- ✅ **Fully Responsive Design** – Works perfectly on all devices.

---

## 🛠️ **Technology Stack**
- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based
- **Deployment:** Vercel/Netlify (Frontend), Render/Heroku (Backend)

---

## 🚀 **Getting Started**
Follow these steps to set up the project locally:

### ✅ **Prerequisites**
Install:
- [Node.js](https://nodejs.org/) (v18+)
- npm
- Git

---

### **1. Clone the Repository**
```bash
git clone https://github.com/Jnanamithran/sovereign-woodcraft-v2.git
cd sovereign-woodcraft-v2
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Run backend:
```bash
npm run start
```

---

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

---

### **4. Access the App**
- Frontend → [http://localhost:5173](http://localhost:5173)  
- Backend API → [http://localhost:5000](http://localhost:5000)  

---

## 📂 **Project Structure**
```
sovereign-woodcraft-v2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   └── pages/
    ├── .gitignore
    └── package.json
```

---

## ✅ **Next Steps**
- Add **Stripe/PayPal** integration
- Implement **product filters & search**
- Improve **SEO & performance**

---

## 📜 **License**
Licensed under the **MIT License**.

---

🔥 **Happy Coding!** 🚀

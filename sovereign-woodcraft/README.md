Sovereign Woodcraft V2
About Sovereign Woodcraft
Sovereign Woodcraft is a premier e-commerce platform dedicated to connecting discerning customers with timeless, handcrafted wooden furniture. Our mission is to celebrate the art of woodworking by providing a space where master artisans can showcase their bespoke creations. Each piece tells a story of unparalleled quality, sustainable sourcing, and enduring design.

This project is the digital home for that vision—a robust, full-stack application designed to provide a seamless and elegant user experience from browsing to checkout.

✨ Core Features
This platform is equipped with a rich set of features to serve both customers and administrators:

🎨 Interactive Product Gallery: A beautiful and responsive gallery to browse high-resolution images of all woodcraft products.

🛒 Shopping Cart & Secure Checkout: A seamless, intuitive, and secure process for purchasing items.

👤 User Authentication & Profiles: Secure user registration and login system where customers can view order history and manage personal information.

🛠️ Full Product Management (CRUD): Administrators have complete control to create, read, update, and delete product listings.

🖼️ Dynamic File Uploads: Easy image handling for product listings, powered by multer.

⚙️ Well-Structured RESTful API: A clean, predictable, and powerful backend API that ensures smooth communication between the frontend and the database.

📱 Fully Responsive Design: The entire user experience is optimized for all devices, from desktops to mobile phones.

🛠️ Technology Stack
This project leverages a modern, decoupled architecture for scalability and maintainability.

Frontend: A dynamic and reactive user interface built with a modern JavaScript Framework (like React or Vue) and powered by the Vite build tool for blazing-fast development.

Backend: A robust and scalable server built with Node.js and the Express.js framework.

Database: A flexible, NoSQL database, likely MongoDB, with Mongoose used for elegant object data modeling.

Deployment: Architected for easy deployment on leading cloud platforms such as Vercel, Netlify, or Heroku.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

Prerequisites
You must have the following software installed on your system:

Node.js (v18.x or later)

npm (which comes with Node.js)

Git

Installation & Setup
Clone the Repository

git clone [https://github.com/Jnanamithran/sovereign-woodcraft-v2.git](https://github.com/Jnanamithran/sovereign-woodcraft-v2.git)
cd sovereign-woodcraft-v2

Set Up the Backend
Navigate to the backend directory and install dependencies.

cd backend
npm install

Configure Environment Variables
Create a .env file in the /backend directory. This file stores critical secrets and is ignored by Git.

# .env Example
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

Set Up the Frontend
Navigate to the frontend directory and install dependencies.

cd ../frontend
npm install

Run the Application
You will need two separate terminals to run both the frontend and backend servers at the same time.

Run Backend Server (from the /backend directory):

npm run start

Run Frontend Server (from the /frontend directory):

npm run dev

The application is now running locally! The frontend is accessible at http://localhost:5173 and the backend API is live at http://localhost:5000.

📂 Project Structure
The repository is organized into two main folders, frontend and backend, to maintain a clean separation of concerns.

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

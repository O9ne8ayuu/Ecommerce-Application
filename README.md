# 🛍 Aircart-  E-Commerce MERN Stack App

[![Made with MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Made with Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
[![Made with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Made with Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()

A *full-featured E-Commerce* web app built using the *MERN stack* (MongoDB, Express.js, React, Node.js)  
with authentication, cart, wishlist, coupon codes, and payment integration.

---

## 🚀 Features
✅ User authentication (JWT-based)  
✅ Product listing & categories  
✅ Cart and wishlist management  
✅ Coupon & discount support  
✅ Secure payment integration (Razorpay / Stripe)  
✅ Admin dashboard for managing products & orders  

## 🛠 Tech Stack
*Frontend:* React, Redux, Bootstrap/ CSS  
*Backend:* Node.js, Express.js  
*Database:* MongoDB with Mongoose  
*Authentication:* JWT   and web cockies 
*Payments:* Razorpay / strip

## FOLDER STRUCTURE
commers-app/ │── client/ 
# React frontend │── config/   
# Database configuration │── controllers/  
# Backend controllers │── helpers/       
# Helper functions │── middlewares/       
# Auth middleware │── models/         
# Mongoose models │── routes/        
# API routes │── server.js          
# Entry point for backend │── package.json 
│── .gitignore


## ⚙ Installation

### ⿡ 1  Clone the repository
```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app

**## ⿢ 2 Install dependencies**

## Backend
npm install

## frontend
cd client
npm install


##  3 . Set up Environment Variables

Create a .env file in the root and client folders.

Backend .env example:

PORT=3000   or for proxy - port : 8080
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PAYMENT_API_KEY=your_payment_key

Frontend .env example:

REACT_APP_API_URL=http://localhost:3000    or for proxy - 8080

⿤ Run the app

Backend
npm nodemon server.js

Frontend

cd client
npm start

 ## for both (frontend and backend ) use proxy server : port : 8080

  📸 Screenshots

( screenshots here)


---

📜 License

This project is licensed under the MIT License.




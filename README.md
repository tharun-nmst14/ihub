# 🚀 I-Hub – Campus Marketplace (MERN Stack)

🔗 **Live Demo:** https://ihub-phi.vercel.app/  
 

---

## 📌 Overview

**I-Hub** is a full-stack campus marketplace application built using the MERN stack.  
It enables students to buy and sell academic essentials such as books, lab kits, and stationery within their campus ecosystem.

The platform includes secure authentication, role-based access control, private messaging, item lifecycle management, image uploads, and admin monitoring.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt
- Cloudinary (Image Upload)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Version Control: Git & GitHub

---

## ✨ Features

### 👤 User Features
- User Registration & Login (JWT-based Authentication)
- Post Items with Image Upload
- Edit/Delete Own Items
- Mark Item as Sold (with Buyer Student ID)
- Private Product-Based Chat
- Dashboard (Active & Sold Items)
- Submit Suggestions

### 🛡 Admin Features
- View All Users
- Monitor All Items
- Remove Inappropriate Items
- View Sold Items History

---

## 💬 Chat System

- One-to-one private conversations
- Linked to specific products
- Message persistence in MongoDB
- Timestamps for each message

---

## 🖼 Image Upload

- Images uploaded to Cloudinary
- Preview before submission
- Stored as URLs in MongoDB
- Dynamically rendered in listings

---

## 🔐 Authentication Flow

1. User logs in
2. Server validates credentials
3. JWT token generated
4. Token stored in localStorage
5. Axios attaches token to protected requests
6. Backend middleware verifies token

---

## 📦 Database Models

### User
- name
- email
- password (hashed)
- role (user/admin)
- department
- isVerified

### Item
- title
- description
- category
- price
- condition
- images
- status (active/sold)
- buyerStudentId
- seller (Reference to User)

### Conversation
- item
- buyer
- owner
- messages (sender, text, timestamp)

### Suggestion
- name (optional)
- message
- createdAt

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/ihub.git
cd ihub
```
### Backend SetUp

```bash
cd server
npm install
```

## Create .env file :
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
### Run backend :
```bash
npm run dev
```
### Frontend SetUp :

```bash
cd client
npm install
npm run dev
```
---

### 📊 Challenges Faced
- JWT 401 Unauthorized errors due to missing Authorization header

- CORS issues between frontend and backend

- Refresh 404 errors on Vercel (fixed using rewrites)

- Cloudinary upload 500 errors due to env misconfiguration

- Owner-chat button logic issue due to ID comparison mismatch

- MongoDB connection parsing issues with deprecated options

- All were debugged using:

- Browser DevTools (Network tab)

- Console logging

- Proper middleware validation

- Environment configuration review

--- 

### 👨‍💻 Author

 # Tharun Azmeera
 Full-Stack Developer
- MERN Stack | REST APIs | Cloud Deployment



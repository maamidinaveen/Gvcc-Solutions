🔍 Overview

This project displays a product catalog where users can view products and submit enquiries.
Admin users can log in and view all submitted enquiries.
JWT authentication is implemented using HttpOnly cookies for secure session management.

⭐ Features

👤 User Features

- View all products with:

  - Search

  - Category filter

  - Pagination

- Click a product to view full details

- Submit an enquiry for any product

- Lightweight and responsive UI (mobile-friendly)

🔐 Admin Features

- Login using credentials (stored in .env)

- Protected route for viewing all enquiries

- Logout button to clear JWT cookie

🔒 Security

    -JWT authentication using HttpOnly cookie

    -Protected backend routes with middleware

    -Frontend protected route (/enquiries)

    -Backend validation + Frontend validation

🧰 Tech Stack

Frontend

- React (CRA)

- React Router

- Axios

-CSS (flexbox + responsive design)

Backend

Node.js

- Express.js

- SQLite3

- JWT Authentication

- HttpOnly Cookies

- CORS + Cookie Parser

📁 GVCC-ASSIGNMENT — Project Folder Structure

GVCC-ASSIGNMENT/
│
├
│
├── backend/
│ ├── node_modules/
│ │
│ ├── scripts/
│ ├── sql/
│ │
│ ├── src/
│ │ ├── controllers/
│ │ ├── db/
│ │ ├── middleware/
│ │ └── routes/
│ │
│ ├── server.js
│ ├── .env
│ ├── package-lock.json
│ └── package.json
│
├── frontend/
│ ├── node_modules/
│ │
│ ├── public/
│ │
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── styles/
│ │
│ │ ├── App.css
│ │ ├── App.js
│ │ ├── App.test.js
│ │ ├── index.css
│ │ ├── index.js
│ │ ├── logo.svg
│ │ ├── reportWebVitals.js
│ │ └── setupTests.js
│ │
│ ├
│ ├── package-lock.json
│ └── package.json

⚙️ Backend Setup

1️⃣ Install dependencies
cd backend
npm install

2️⃣ Create .env file
ADMIN_USER=admin
ADMIN_PASS=StrongPass123
JWT_SECRET=supersecretkey
PORT= 5000

-- Initialize (create) the SQLite database and seed sample data

# from backend/

    npm run init-db

3️⃣ Start backend
npm start

Server runs on:
👉 http://localhost:5000

🎨 Frontend Setup
1️⃣ Install dependencies
cd frontend
npm install

2️⃣ Configure API (src/services/api.js)
import axios from "axios";

    const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    });

    export default api;

3️⃣ Start frontend
npm start

Frontend runs on:
👉 http://localhost:3000

📡 API Endpoints

Products

Method Endpoint Description
GET /products List products (pagination, search, category)
GET /products/:id Fetch single product

Enquiries

Method Endpoint Description
POST /enquiry/create Create new enquiry
GET /enquiry/get List all enquiries (admin only)

Admin

Method Endpoint Description
POST /admin/login Login + set HttpOnly cookie
POST /admin/logout Clear cookie
GET /admin/me Check login status

🔐 Authentication Flow
Login

User logs in via /admin/login

Server sets:
Set-Cookie: token=JWT; HttpOnly; SameSite=Lax;
-React reads login state using /admin/me

Protected Route

Frontend:

- /enquiries is protected

- If /admin/me → loggedIn: false, React redirects user to /login

Backend:

- /enquiry/get requires JWT via authMiddleware

# Modern Full-Stack Blogging Platform

A production-ready, feature-rich blogging platform built with the MERN stack (MongoDB, Express, React, Node.js) and Vite. This platform offers a premium reading and writing experience with a focus on modern design, typography, and performance.

## 🌟 Key Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- HTTP-only cookies for token storage to prevent XSS attacks
- Bcrypt password hashing
- Rate limiting and express-mongo-sanitize for database security
- Helmet for secure HTTP headers

### 📝 Rich Content Creation
- Advanced WYSIWYG editor powered by **Tiptap**
- Slash commands and floating menus
- Markdown support and code blocks with syntax highlighting (Lowlight)
- Image uploading via Cloudinary integration
- Autosave functionality

### 💬 Social & Community
- Real-time commenting system
- Like / Unlike functionality for posts
- Real-time notifications using **Socket.io**
- User profiles with avatars and bio
- Author follow system (extensible)

### 🎨 Modern UI/UX
- Premium, human-crafted design (No generic templates)
- Custom dark mode tailored for reading comfort
- Glassmorphism effects and subtle micro-animations
- Fully responsive mobile-first design using **Tailwind CSS v3**
- Skeleton loaders for smooth data fetching UX

---

## 🛠 Technology Stack

### Frontend
- **React.js** (v18)
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS** (Utility-first styling)
- **React Router v6** (Navigation)
- **Tiptap** (Headless rich text editor)
- **Socket.io-client** (Real-time events)
- **Axios** (API requests)
- **DOMPurify** (XSS sanitization)

### Backend
- **Node.js** & **Express.js** (Server environment)
- **MongoDB** & **Mongoose** (NoSQL Database & ODM)
- **Socket.io** (WebSockets for real-time features)
- **Cloudinary** (Image hosting)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt.js** (Password encryption)

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/          # Database and external service configurations
│   ├── controllers/     # Route logic and request handling
│   ├── middleware/      # Auth, error handling, file upload middleware
│   ├── models/          # Mongoose schemas (User, Post, Comment, Notification)
│   ├── routes/          # Express API routes
│   ├── utils/           # Helper functions (Cloudinary, Logger)
│   ├── .env             # Environment variables
│   └── server.js        # Entry point for the Node.js server
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Editor, PostCard)
│   │   ├── context/     # React Context for Auth, Toast, Notifications
│   │   ├── pages/       # React route pages (Home, Blog, Profile, Login)
│   │   ├── services/    # API abstraction layer (Axios instances)
│   │   ├── styles/      # Tailwind directives and custom CSS
│   │   ├── utils/       # Utility functions (formatting, sanitization)
│   │   └── App.jsx      # Main application component
│   ├── tailwind.config.js
│   └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB account (Atlas cluster)
- Cloudinary account for image uploads

### 1. Clone the Repository
```bash
git clone https://github.com/QuantumGlitch404/Blog-Platform-with-Comments.git
cd Blog-Platform-with-Comments
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
COOKIE_SECRET=your_cookie_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
CLIENT_URL=http://localhost:5175
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5175`.

---

## 📜 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get current logged-in user

### Post Routes
- `GET /api/posts` - Get all published posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (Protected)
- `PUT /api/posts/:id` - Update post (Protected, Author only)
- `DELETE /api/posts/:id` - Delete post (Protected, Author only)
- `PUT /api/posts/:id/like` - Like/Unlike post (Protected)
- `PUT /api/posts/:id/view` - Increment view count

### Comment Routes
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Add comment to post (Protected)
- `DELETE /api/comments/:id` - Delete comment (Protected, Author only)

### User Routes
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (Protected)

---

## 🛡️ License
This project is licensed under the MIT License.

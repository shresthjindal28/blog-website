# Blogging Platform

A full-stack blogging platform built with React.js, Node.js, and MongoDB Atlas.

## Features

- User Authentication (Login/Signup)
- User Dashboard
- Create, Edit, Delete Blog Posts
- Modern UI with Tailwind CSS
- Responsive Design

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT

## Project Structure

```
blog/
├── frontend/          # React frontend application
└── backend/           # Node.js backend application
```

## Setup Instructions

### Backend Setup
1. Navigate to backend directory
2. Install dependencies: `npm install`
3. Create .env file with required environment variables
4. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints

- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/blogs - Get all blogs
- POST /api/blogs - Create a blog
- PUT /api/blogs/:id - Update a blog
- DELETE /api/blogs/:id - Delete a blog 
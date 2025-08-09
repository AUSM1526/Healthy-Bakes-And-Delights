# Healthy Bakes & Delights

A modern full-stack e-commerce web application for a specialty bakery focusing on healthy baked goods. Built with React, Node.js, and MongoDB, featuring user authentication, product management, cart functionality, order processing, and comprehensive admin dashboard.

![Project Banner](https://img.shields.io/badge/Full--Stack-E--Commerce-brightgreen?style=for-the-badge) ![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## 🌟 Features

### 👤 User Features
- **User Authentication**: Secure registration and login with OTP verification
- **Product Browsing**: Browse products by categories and subcategories
- **Shopping Cart**: Add, remove, and modify cart items
- **Order Management**: Place orders with UPI payment integration
- **Address Management**: Multiple delivery address support
- **Order Tracking**: Real-time order status updates
- **Profile Management**: Update personal information and preferences

### 🛠️ Admin Features
- **Product Management**: Complete CRUD operations for products
- **Category Management**: Manage product types and subcategories
- **Order Processing**: Review, approve, and manage customer orders
- **Inventory Control**: Track and update product stock levels
- **User Management**: View and manage customer accounts
- **Email Notifications**: Automated email system for order updates

### 🔧 Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Image Management**: Cloudinary integration for optimized image storage
- **Email Integration**: Automated notifications with Nodemailer
- **Payment Processing**: UPI QR code generation for Indian payments
- **State Management**: Redux Toolkit with persistence
- **Security**: JWT authentication with refresh tokens

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19.0.0 with Vite
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM 7.4.0
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.8.4
- **UI Components**: Lucide React, React Icons
- **Animations**: Framer Motion 12.6.3
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **File Upload**: Multer 1.4.5
- **Image Storage**: Cloudinary 2.5.1
- **Email Service**: Nodemailer 6.10.0
- **Password Hashing**: Bcrypt 5.1.1
- **Payment**: QRCode 1.5.4 for UPI integration

### Database
- **Database**: MongoDB with Mongoose 8.10.0

### Development Tools
- **Code Formatting**: Prettier
- **Development Server**: Nodemon
- **Environment Management**: Dotenv
- **CORS**: Cross-Origin Resource Sharing
- **Cookie Parsing**: Cookie Parser

## 📁 Project Structure

```
Healthy_Bakes_And_Delights/
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store configuration
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── Backend/                    # Node.js backend application
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/           # Database schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── utils/            # Utility functions
│   │   └── mailTemplates/    # Email templates
│   └── package.json          # Backend dependencies
└── README.md                  # This file
```

## 🚀 Deployment

### Backend (Render)
1. Set up environment variables on Render
2. Deploy the `Backend` directory to Render

### Frontend (Vercel)
1. Deploy the `Frontend` directory to Vercel
2. Configure API base URL in production

## 📊 Database Schema

### Key Collections
- **Users**: User accounts with authentication data
- **Products**: Product catalog with images and pricing
- **ProductTypes**: Product categories (Chocolate, Granola, etc.)
- **SubCategories**: Subcategories with base pricing
- **Orders**: Customer orders with status tracking
- **Addresses**: User delivery addresses
- **OTPs**: Temporary OTP storage for verification

## 🎯 Key Features Showcase

### 1. Conditional Product Hierarchy
- Products can have subcategories based on product type
- Flexible category system for different product types

### 2. Dynamic Pricing System
- Base price from subcategory + additional price from product
- Flexible pricing model for product variations

### 3. Email Automation
- Automated email notifications for all order states
- OTP verification system for user registration

---
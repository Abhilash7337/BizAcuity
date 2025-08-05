# 🏗️ Backend Architecture Documentation

## 📁 Directory Structure

```
Backend/
├── 📄 Server.js                   # Main server entry point
├── 📄 package.json                # Dependencies and scripts
├── 📄 package-lock.json           # Dependency lock file
├── 📄 .env                        # Environment variables
├── 📄 README-Architecture.md      # This file
├── 📁 config/                     # Configuration files
│   ├── 📄 database.js             # MongoDB connection setup
│   └── 📄 middleware.js           # Express middleware configuration
├── 📁 controllers/                # Business logic controllers
│   ├── 📄 adminController.js      # Admin operations
│   ├── 📄 authController.js       # Authentication logic
│   ├── 📄 draftController.js      # Draft management
│   ├── 📄 sharingController.js    # Design sharing logic
│   ├── 📄 uploadController.js     # File upload handling
│   └── 📄 userController.js       # User management
├── 📁 middleware/                 # Custom middleware
│   └── 📄 auth.js                 # JWT authentication middleware
├── 📁 models/                     # Mongoose data models
│   ├── 📄 User.js                 # User schema
│   ├── 📄 Draft.js                # Design draft schema
│   ├── 📄 Payment.js              # Payment tracking schema
│   └── 📄 SharedDraft.js          # Shared design schema
├── 📁 routes/                     # API route definitions
│   ├── 📄 admin.js                # Admin endpoints
│   ├── 📄 auth.js                 # Authentication routes
│   ├── 📄 draft.js                # Draft CRUD operations
│   ├── 📄 fallbackAuth.js         # Fallback authentication
│   ├── 📄 sharing.js              # Design sharing endpoints
│   ├── 📄 upload.js               # File upload endpoints
│   └── 📄 user.js                 # User management routes
├── 📁 scripts/                    # Utility and setup scripts
│   ├── 📄 checkMongoDB.js         # Database connection test
│   ├── 📄 createAdmin.js          # Admin user creation
│   └── 📄 testAdminAccess.js      # Admin API testing
├── 📁 uploads/                    # File storage directory
│   └── 📸 [hashed-files]          # Secure uploaded images
├── 📁 utils/                      # Utility functions
│   ├── 📄 emailService.js         # Email functionality
│   └── 📄 fileUpload.js           # File processing utilities
└── 📁 node_modules/               # Dependencies (managed by npm)
```

## 🚀 Quick Start

### Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Edit with your settings

# Create admin user (first time only)
node scripts/createAdmin.js

# Test database connection
node scripts/checkMongoDB.js

# Start development server
npm start
```

### Testing Admin Access
```bash
# Test admin login and API access
node scripts/testAdminAccess.js
```

## 📋 File Organization Principles

### ✅ **Controllers** (`/controllers/`)
- **Purpose**: Business logic and data processing
- **Naming**: `[feature]Controller.js`
- **Responsibilities**: Request handling, validation, database operations

### ✅ **Routes** (`/routes/`)
- **Purpose**: API endpoint definitions and routing
- **Naming**: `[feature].js`
- **Responsibilities**: URL mapping, middleware application, controller delegation

### ✅ **Models** (`/models/`)
- **Purpose**: Database schema definitions
- **Naming**: `[ModelName].js` (PascalCase)
- **Responsibilities**: Data structure, validation, relationships

### ✅ **Middleware** (`/middleware/`)
- **Purpose**: Request/response processing
- **Naming**: `[functionality].js`
- **Responsibilities**: Authentication, logging, error handling

### ✅ **Config** (`/config/`)
- **Purpose**: Application configuration
- **Naming**: `[component].js`
- **Responsibilities**: Database setup, middleware configuration

### ✅ **Utils** (`/utils/`)
- **Purpose**: Reusable utility functions
- **Naming**: `[functionality].js`
- **Responsibilities**: Email, file processing, helpers

### ✅ **Scripts** (`/scripts/`)
- **Purpose**: Development and maintenance utilities
- **Naming**: `[action][Target].js`
- **Responsibilities**: Setup, testing, maintenance tasks

## 🔐 Security Features

### **Authentication**
- JWT token-based authentication
- Secure password hashing with bcryptjs
- Protected route middleware

### **File Upload Security**
- Hashed filenames for security
- File type validation
- Size limitations
- Secure storage in `/uploads/`

### **API Security**
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Error handling and logging

## 📊 API Endpoints

### **Authentication Routes** (`/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### **User Routes** (`/user`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /update-password` - Change password

### **Draft Routes** (`/drafts`)
- `GET /` - Get user's drafts
- `POST /` - Create new draft
- `GET /single/:id` - Get specific draft
- `PUT /:id` - Update draft
- `DELETE /:id` - Delete draft
- `GET /shared` - Get shared drafts
- `POST /:id/share` - Share draft

### **Admin Routes** (`/admin`)
- `GET /users` - Manage users
- `GET /drafts` - Manage drafts
- `GET /payments` - Payment overview
- `GET /stats` - Dashboard statistics

### **Upload Routes** (`/upload`)
- `POST /` - Upload image files

## 🛠️ Technology Stack

### **Core Framework**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### **Security & Auth**
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing

### **File Handling**
- **multer** - File upload middleware
- **crypto** - File name hashing

### **Development Tools**
- **dotenv** - Environment variable management
- **nodemon** - Development server (if configured)

## 📈 Performance Considerations

### **Database Optimization**
- Indexed fields for fast queries
- Efficient schema design
- Connection pooling

### **File Storage**
- Hashed filenames prevent conflicts
- Organized upload directory structure
- File size and type validation

### **Memory Management**
- Efficient request handling
- Proper error handling and cleanup
- Optimized middleware stack

## 🔧 Maintenance

### **Regular Tasks**
- Monitor `/uploads/` directory size
- Check database performance
- Update dependencies regularly
- Review logs for errors

### **Backup Strategy**
- Regular database backups
- Upload file backups
- Environment configuration backups

## 🚀 Deployment Notes

### **Environment Variables Required**
```env
MONGODB_URI=mongodb://localhost:27017/walldesigner
JWT_SECRET=your-secure-jwt-secret
PORT=5001
```

### **Production Checklist**
- [ ] Set secure JWT secret
- [ ] Configure MongoDB Atlas or production database
- [ ] Set up file storage (cloud or server)
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure logging and monitoring

---

This architecture provides a solid foundation for the wall design application with proper separation of concerns, security best practices, and maintainable code organization.

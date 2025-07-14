# Backend Modular Architecture

This document describes the refactored backend structure that improves code organization, maintainability, and readability.

## New Structure Overview

```
Backend/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection configuration
│   └── middleware.js       # CORS, body parser, multer configurations
├── controllers/            # Business logic separated by functionality
│   ├── adminController.js  # Admin management operations
│   ├── authController.js   # Authentication operations (fallback)
│   ├── draftController.js  # Draft management operations
│   ├── sharingController.js # Admin sharing management operations
│   ├── uploadController.js # File upload operations
│   └── userController.js   # User management operations
├── routes/                 # Route definitions separated by functionality
│   ├── admin.js           # Admin routes
│   ├── auth.js            # Primary auth routes (OTP-based)
│   ├── draft.js           # Draft routes
│   ├── fallbackAuth.js    # Fallback auth routes (direct)
│   ├── sharing.js         # Admin sharing routes
│   ├── upload.js          # Upload routes
│   └── user.js            # User routes
├── middleware/             # Custom middleware
│   └── auth.js            # JWT authentication & authorization
├── models/                 # Database models
│   ├── Draft.js
│   ├── Payment.js
│   ├── SharedDraft.js
│   └── User.js
├── utils/                  # Utility functions
│   ├── emailService.js    # Email sending utilities
│   └── fileUpload.js      # File upload utilities
└── Server.js              # Main server file (now modular)
```

## Key Improvements

### 1. Separation of Concerns
- **Controllers**: Business logic is separated from route handling
- **Routes**: Clean route definitions without business logic
- **Config**: All configuration in dedicated files
- **Utils**: Reusable utility functions

### 2. Modular Architecture
- Each functionality area has its own controller and route file
- Easy to locate and modify specific features
- Better code organization and maintainability

### 3. Configuration Management
- **database.js**: Centralized database connection handling
- **middleware.js**: All middleware configurations in one place
- Environment-specific settings properly organized

### 4. Route Organization
- **auth.js**: Primary OTP-based authentication routes
- **fallbackAuth.js**: Direct login/register fallback routes
- **user.js**: User profile and management routes
- **draft.js**: Draft creation, editing, sharing routes
- **upload.js**: File upload handling routes
- **admin.js**: Admin user and payment management routes
- **sharing.js**: Admin sharing analytics and management routes

### 5. Controller Responsibilities

#### authController.js
- Fallback user registration (without OTP)
- Fallback user login (without email verification)

#### userController.js
- Get user by ID
- Update user password
- Update user profile
- Choose subscription plan
- Search users

#### draftController.js
- Create, read, update, delete drafts
- Share drafts with other users
- Get shared drafts for users
- Remove users from shared drafts

#### uploadController.js
- Handle image uploads
- File validation and storage
- Duplicate file detection

#### adminController.js
- User management (CRUD operations)
- Payment management
- Dashboard statistics
- Draft management for admins

#### sharingController.js
- Revoke/reactivate shared drafts
- Sharing analytics and reporting
- Cleanup old revoked shares
- Draft sharing details

### 6. Utility Functions

#### fileUpload.js
- Create uploads directory
- Save uploaded files with hash-based naming
- Handle file duplicates

#### emailService.js
- Send OTP emails
- Email configuration and templates

### 7. Configuration Files

#### database.js
- MongoDB connection with error handling
- Connection logging and management

#### middleware.js
- CORS configuration for multiple origins
- Body parser settings for large payloads
- Multer configuration for file uploads

## Migration Benefits

### Before (Monolithic Server.js)
- 1,400+ lines of code in a single file
- Mixed concerns (routes, business logic, configuration)
- Difficult to maintain and debug
- Hard to locate specific functionality

### After (Modular Architecture)
- Main server file reduced to ~90 lines
- Clear separation of concerns
- Easy to locate and modify specific features
- Better error handling and debugging
- Improved code readability and maintainability

## Usage

### Starting the Server
```bash
node Server.js
```

### Health Check
```bash
curl http://localhost:5001/health
```

### Route Structure
All routes are organized by functionality:
- Authentication: `/login`, `/register`, `/verify-otp`
- Users: `/user/:id`, `/users/search`
- Drafts: `/drafts`, `/drafts/:id/share`
- Admin: `/admin/users`, `/admin/dashboard`
- Sharing: `/admin/sharing-analytics`
- Upload: `/upload`

## Backward Compatibility

The refactored backend maintains 100% backward compatibility:
- All existing API endpoints work exactly the same
- Same request/response formats
- Same authentication mechanisms
- Same error handling

## Error Handling

Enhanced error handling includes:
- Global error handler for uncaught exceptions
- 404 handler for undefined routes
- Environment-specific error messages
- Proper HTTP status codes

## Future Enhancements

The modular structure makes it easy to:
- Add new features in dedicated controllers/routes
- Implement caching layers
- Add API versioning
- Implement rate limiting
- Add comprehensive logging
- Add automated testing

# 🏗️ Complete Project Layout - BizAcuity

## 📁 Root Structure Overview

```
BizAcuity/
├── 📁 Backend/                    # Node.js/Express API Server
├── 📁 Frontend/                   # React/Vite Client Application
├── 📁 src/                        # Legacy source files (deprecated)
├── 📁 node_modules/               # Root dependencies (shared utilities)
└── 📄 README-Organization.md      # Organization documentation
```

---

## 🔧 Backend Architecture (`/Backend/`)

### **Core Server Files**
```
Backend/
├── 📄 Server.js                   # Main server entry point (90 lines - modularized)
├── 📄 package.json                # Backend dependencies & scripts
├── 📄 package-lock.json           # Dependency lock file
├── 📄 .env                        # Environment variables
└── 📄 README-Backend-Organization.md # Backend architecture documentation
```

### **Configuration Layer**
```
Backend/config/
├── 📄 database.js                 # MongoDB connection configuration
└── 📄 middleware.js               # Express middleware setup
```

### **Controllers (Business Logic)**
```
Backend/controllers/
├── 📄 adminController.js          # Admin dashboard operations
├── 📄 authController.js           # Authentication & authorization
├── 📄 draftController.js          # Draft management operations
├── 📄 sharingController.js        # Design sharing functionality
├── 📄 uploadController.js         # File upload handling
└── 📄 userController.js           # User management operations
```

### **Data Models (MongoDB/Mongoose)**
```
Backend/models/
├── 📄 User.js                     # User schema & authentication
├── 📄 Draft.js                    # Design draft storage
├── 📄 Payment.js                  # Payment & subscription tracking
└── 📄 SharedDraft.js              # Shared design links
```

### **API Routes**
```
Backend/routes/
├── 📄 admin.js                    # Admin panel endpoints
├── 📄 auth.js                     # Authentication routes
├── 📄 draft.js                    # Draft CRUD operations
├── 📄 sharing.js                  # Design sharing endpoints
├── 📄 upload.js                   # File upload endpoints
├── 📄 user.js                     # User profile management
└── 📄 fallbackAuth.js             # Fallback authentication
```

### **Middleware & Security**
```
Backend/middleware/
└── 📄 auth.js                     # JWT token validation & user auth
```

### **Development Scripts**
```
Backend/scripts/                   # Utility and setup scripts
├── 📄 checkMongoDB.js             # Database connection test
├── 📄 createAdmin.js              # Admin user creation script
└── 📄 testAdminAccess.js          # Admin API testing utility
```

### **Utilities & Services**
```
Backend/utils/
├── 📄 emailService.js             # Email sending functionality
└── 📄 fileUpload.js               # File processing utilities
```

### **File Storage**
```
Backend/uploads/                   # User uploaded images & designs
├── 📸 [hashed-filenames].png      # Secure image storage
├── 📸 [hashed-filenames].jpg      # Various image formats
└── 📸 [hashed-filenames].jpeg     # Organized by hash for security
```

---

## ⚛️ Frontend Architecture (`/Frontend/`)

### **Core Application Files**
```
Frontend/
├── 📄 package.json                # Frontend dependencies & scripts
├── 📄 index.html                  # Main HTML entry point
├── 📄 vite.config.js              # Vite build configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 postcss.config.cjs          # PostCSS configuration
└── 📄 eslint.config.js            # Code linting rules
```

### **Source Code Structure**
```
Frontend/src/
├── 📄 main.jsx                    # React application entry point
├── 📄 App.jsx                     # Main app component & routing
├── 📄 index.css                   # Global styles & Tailwind imports
├── 📁 components/                 # React components (organized)
├── 📁 pages/                      # Page-level components
├── 📁 hooks/                      # Custom React hooks
├── 📁 utils/                      # Utility functions
├── 📁 constants/                  # Application constants
└── 📁 assets/                     # Static assets
```

### **🗂️ Organized Components Architecture**
```
Frontend/src/components/
├── 📄 index.js                    # Main component exports
├── 📄 README-Organization.md      # Component organization guide
├── 📁 admin/                      # 👨‍💼 Admin Dashboard Components
│   ├── 📄 DashboardStats.jsx
│   ├── 📄 DraftsManagement.jsx
│   ├── 📄 PaymentsManagement.jsx
│   ├── 📄 SharingManagement.jsx
│   ├── 📄 UsersManagement.jsx
│   └── 📄 index.js
├── 📁 layout/                     # 🏗️ Layout & Navigation
│   ├── 📄 Header.jsx
│   └── 📄 index.js
├── 📁 shared/                     # 🔄 Reusable Components
│   ├── 📄 ExportButton.jsx
│   ├── 📄 SaveDraftModal.jsx
│   ├── 📄 ShareModal.jsx
│   └── 📄 index.js
├── 📁 sidebar/                    # 📋 Sidebar Panels
│   ├── 📄 BackgroundPanel.jsx
│   ├── 📄 DecorsPanel.jsx
│   ├── 📄 UploadImagesPanel.jsx
│   ├── 📄 WallSizePanel.jsx
│   └── 📄 index.js
├── 📁 ui/                         # 🎛️ UI Components
│   ├── 📄 ToggleSwitch.jsx
│   └── 📄 index.js
├── 📁 user/                       # 👤 User Management
│   ├── 📄 ChangePasswordForm.jsx
│   ├── 📄 ProtectedRoute.jsx
│   ├── 📄 UserProfile.jsx
│   ├── 📄 UserProfileForm.jsx
│   └── 📄 index.js
└── 📁 wall/                       # 🎨 Wall Editor
    ├── 📄 DraggableImage.jsx
    ├── 📄 FrameSelector.jsx
    ├── 📄 ImagePropertiesPanel.jsx
    ├── 📄 ShapeSelector.jsx
    ├── 📄 WallCanvas.jsx
    ├── 📄 WallFooter.jsx
    ├── 📄 WallHeader.jsx
    ├── 📄 WallModals.jsx
    ├── 📄 WallSidebar.jsx
    └── 📄 index.js
```

### **Application Pages**
```
Frontend/src/pages/
├── 📄 Login.jsx                   # User authentication
├── 📄 Register.jsx                # User registration
├── 📄 Landing.jsx                 # Landing/dashboard page
├── 📄 WallEditor.jsx              # Main wall design interface
├── 📄 User.jsx                    # User profile management
├── 📄 ChoosePlan.jsx              # Subscription plan selection
├── 📄 AdminDashboard.jsx          # Admin dashboard (legacy)
└── 📄 AdminDashboardModular.jsx   # Modular admin dashboard
```

### **Utilities & Hooks**
```
Frontend/src/utils/
└── 📄 auth.js                     # 🔐 Secure authentication utilities
                                   # (implements localStorage security)

Frontend/src/hooks/
└── 📄 useUser.js                  # 👤 Custom user data hook
                                   # (separates public/private data)

Frontend/src/constants/
└── 📄 wallSizes.js                # Wall dimension constants
```

### **Static Assets**
```
Frontend/public/decors/            # Decorative elements
├── 📸 Black.png, White.png
├── 📸 Flowerplant.png, Flowerpot2.png
├── 📸 Fruit.png, Garland1.png
├── 📸 table4.png, Vintage_Clock.png
└── 📸 Blackt.png

Frontend/src/assets/
└── 📸 react.svg                   # React logo
```

---

## 🛠️ Technology Stack

### **Backend Technologies**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer middleware
- **Security:** bcryptjs for password hashing
- **Email:** Custom email service utility
- **CORS:** Cross-origin resource sharing enabled

### **Frontend Technologies**
- **Framework:** React 18
- **Build Tool:** Vite 7.0
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router
- **State Management:** React hooks & context
- **Image Processing:** html2canvas, jsPDF
- **File Upload:** Native file API
- **Authentication:** JWT token management

### **Development Tools**
- **Linting:** ESLint
- **Code Formatting:** Prettier (configured)
- **CSS Processing:** PostCSS
- **Package Management:** npm
- **Version Control:** Git

---

## 🔐 Security Implementation

### **Data Protection Strategy**
```javascript
// localStorage (Safe - Non-sensitive only)
{
  name: "User Display Name",
  isLoggedIn: true,
  userType: "regular",
  plan: "premium"
}

// Server-only (Sensitive data)
{
  id: "database_user_id",
  email: "user@email.com",
  profilePhoto: "avatar_url",
  // Other PII data
}
```

### **Authentication Flow**
1. **Login:** JWT token stored in localStorage
2. **Public Data:** Name, status, role cached locally
3. **Sensitive Data:** Fetched from server when needed
4. **Logout:** All local data cleared securely

---

## 📊 Application Features

### **Core Functionality**
- 🎨 **Wall Design Editor:** Interactive canvas for wall decoration
- 📸 **Image Upload & Management:** Secure file handling
- 🎯 **Drag & Drop Interface:** Intuitive design placement
- 📤 **Export Capabilities:** PNG, JPEG, PDF formats
- 👥 **Design Sharing:** Collaborative design sharing
- 💾 **Draft System:** Save and resume designs
- 🏷️ **Frame & Shape Selection:** Design customization
- 📱 **Responsive Design:** Mobile-friendly interface

### **User Management**
- 🔐 **Secure Authentication:** JWT-based login system
- 👤 **User Profiles:** Personal account management
- 🔑 **Password Management:** Secure password changes
- 📊 **Plan Management:** Subscription handling

### **Admin Features**
- 📈 **Dashboard Analytics:** User and system metrics
- 👥 **User Management:** Admin user controls
- 💳 **Payment Tracking:** Subscription monitoring
- 📋 **Draft Management:** System-wide draft oversight
- 🔗 **Sharing Management:** Link and access control

---

## 🚀 Build & Deployment

### **Development Workflow**
```bash
# Backend Development
cd Backend
npm install

# Set up environment variables (first time)
cp .env.example .env  # Edit with your settings

# Create admin user (first time only)
node scripts/createAdmin.js

# Test database connection
node scripts/checkMongoDB.js

# Test admin API access
node scripts/testAdminAccess.js

# Start Express server
npm start

# Frontend Development  
cd Frontend
npm install
npm run dev                  # Starts Vite dev server
npm run build               # Production build
npm run preview             # Preview production build
```

### **Production Architecture**
- **Backend:** Express server with MongoDB
- **Frontend:** Static files served by CDN/Web server
- **File Storage:** Secure upload directory with hashed filenames
- **Database:** MongoDB with proper indexing
- **Authentication:** JWT tokens with secure expiration

---

## 📈 Project Statistics

### **Codebase Metrics**
- **Total Components:** 25+ React components
- **Backend Endpoints:** 7 main route files
- **Database Models:** 4 Mongoose schemas
- **Security Layers:** JWT + bcrypt + secure localStorage
- **File Organization:** 7 logical component categories
- **Build System:** Vite with hot reload & optimization

### **Architecture Benefits**
- ✅ **Modular Backend:** Easy to maintain and extend
- ✅ **Organized Frontend:** Logical component grouping
- ✅ **Security-First:** Sensitive data protection
- ✅ **Scalable Design:** Ready for team development
- ✅ **Modern Stack:** Latest technologies and best practices

---

This architecture provides a solid foundation for a wall design application with proper separation of concerns, security best practices, and maintainable code organization.

---

## 🔧 Backend Organization Improvements

### **✅ Cleaned Up Structure**
- **Removed:** Empty category folders (`admin/`, `auth/`, `drafts/`, `shared/`, `user/`)
- **Added:** `scripts/` folder for development utilities
- **Organized:** All utility scripts moved to proper location
- **Documented:** Comprehensive backend architecture documentation

### **📋 File Organization Benefits**
- **Clear Separation:** Core files, scripts, and business logic properly separated
- **Easy Maintenance:** Scripts organized in dedicated folder
- **Better Documentation:** Detailed README with setup instructions
- **Improved Workflow:** Clear development and testing procedures

### **🛠️ Development Scripts**
```bash
# Database Management
node scripts/checkMongoDB.js      # Test MongoDB connection
node scripts/createAdmin.js       # Create admin user
node scripts/testAdminAccess.js   # Test admin authentication

# Server Management
npm start                          # Start development server
npm run prod                       # Start production server (if configured)
```

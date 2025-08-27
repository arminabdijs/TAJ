#👑 TAJ | Programming Education Platform

**TAJ**  is a comprehensive educational website in the field of programming that offers video courses, educational articles, and helpful tools to enhance the learning experience. Users can access the educational content for free or by purchasing a VIP subscription.


---

## ✨ Key Features
- 🎓 High-quality educational video streaming

- 📄 Categorized and searchable technical articles

- 📁 Upload cover images and video files for courses

- 🔐 Secure user authentication with JWT

- 🛒 Online VIP subscription payment via Zarinpal

- 🧑‍💼 Advanced admin panel for managing courses, users, articles, and payments

- 📦 Clean and modular structure suitable for development and scalability

---

## 🛠️ Used Technologies 

### Backend:

- Node.js

- Express.js

- MongoDB with Mongoose

- JWT (for authentication)

- Multer (for file uploads)

- Zarinpal API (for online payment)

- dotenv, cors (for configuration)

- moment-jalaali (for Persian date formatting)

- nodemailer (for sending emails)

---

## 📦 Main Dependencies

```json
{
  "axios": "^1.9.0",
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "fastest-validator": "^1.19.1",
  "joi": "^17.13.3",
  "joi-objectid": "^4.0.2",
  "jsonwebtoken": "^9.0.1",
  "moment-jalaali": "^0.10.4",
  "mongoose": "^7.8.7",
  "multer": "^1.4.5-lts.1",
  "nodemailer": "^6.10.1"
}
```

---

## 📁 Project Structure

```
taj/
├── controllers/              # Controllers to handle incoming requests from routes
│   └── v1/                   # Version 1 of the API (extensible for future versions)
│       ├── article.js              # Article controller
│       ├── articlesComment.js     # Article comments controller
│       ├── auth.js                # Login, registration, and authentication
│       ├── cart.js                # User cart controller
│       ├── category.js            # Categories controller
│       ├── checkout.js            # Payment process handler
│       ├── comment.js             # Course comments controller
│       ├── contact.js             # "Contact Us" messages
│       ├── course.js              # Course management
│       ├── order.js               # User order management
│       ├── search.js              # Search among courses and articles
│       └── user.js                # User profile and settings
│
├── helpers/                  # Shared helper functions and static messages
│   └── responses.js               # Standardized success, error, and response messages
│
├── middlewares/              # Middlewares to check requests before they reach controllers
│   ├── authJsonWebToken.js       # JWT token verification
│   ├── isAdmin.js                # Admin role checker
│   ├── errorHandler.js           # Centralized error handling
│   ├── headers.js                # Security and control headers setup
│   ├── ObjectID.js               # Validate MongoDB ObjectIds
│   └── ...                       # Other middlewares related to various resources
│
├── models/                   # Database models (using Mongoose)
│   ├── Article.js                # Educational articles model
│   ├── ArticleComment.js        # Article comments model
│   ├── Ban.js                   # Banned users model
│   ├── Cart.js                  # User cart model
│   ├── Category.js              # Categories model (for courses or articles)
│   ├── Checkout.js              # Payment information (Zarinpal)
│   ├── Comment.js               # Course comments
│   ├── Contact.js               # Contact messages model
│   ├── Course.js                # Course model
│   ├── Order.js                 # Finalized order model
│   ├── Session.js               # User sessions for security
│   └── User.js                  # User profile, roles, and permissions
│
├── public/                   # Uploaded files by users
│   └── courses/
│       ├── covers/               # Course cover images
│       └── videos/               # Course video files
│
├── routes/                   # API route definitions
│   └── v1/                        # API version 1 routes
│       ├── article.js            # Article routes
│       ├── auth.js               # Login/Registration routes
│       ├── course.js             # Course-related routes
│       └── ...                   # Other routes for various resources
│
├── services/                # Business logic layer
│   ├── userService.js           # User-related operations (register, login, fetch info)
│   └── zarinpal.js              # Zarinpal payment gateway integration
│
├── utils/                   # Utility functions and tools
│   ├── buildUpdateData.js       # Build update object for MongoDB
│   ├── checkDuplicateUser.js    # Check for duplicate email or phone
│   ├── pagination.js            # Data list pagination
│   └── uploader.js              # Multer upload configuration
│
├── validators/              # Input validations using Joi
│   ├── article.js               # Article validation
│   ├── course.js                # Course validation
│   └── ...                      # Other validation schemas
│
├── .env                    # Environment variables (DB URI, JWT key, Zarinpal key, etc.)
├── .gitignore              # Files and folders to exclude from Git
├── app.js                  # Express core config, middlewares, and settings
├── server.js               # Entry point to start the server
├── package.json            # Project metadata, scripts, and dependencies
└── package-lock.json       # Exact dependency versions (ensures consistent installs)


```

---
## ⚙️ Prerequisites

- ✅ Node.js version 16 or higher
- ✅ MongoDB (either local or remote)

---

## 🚀 Project installation steps

```bash
git clone https://github.com/arminabdijs/tagLearnBackend.git
cd tagLearnBackend
npm install
```

---

## ▶️ Project execution

### In development mode:
```bash
npm run dev
```

### In production mode:
```bash
node server.js
```

📍 Default address:
```
http://localhost:3000
```

---

## 👤 Developer
This project is a personal project developed with ❤️ by Armin Abdi.

If you find any bugs or have suggestions, please kindly report them through the [Issues](https://github.com/arminabdijs/tagLearnBackend/issues) section in the GitHub repository.

📫 Contact

📧 Email: arminabdijs@gmail.com

📞 Phone: +98 930 310 8615

💼 LinkedIn: https://www.linkedin.com/in/arminabdijs


---

## 📜 License

MIT License © 2025
# TAJ
# TAJ

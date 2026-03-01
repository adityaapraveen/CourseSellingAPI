# CourseForge — Course Selling Platform

A full-stack course selling web application built with Node.js, Express, and SQLite. The platform supports two distinct user roles — **learners** and **administrators** — each with dedicated authentication flows, dashboards, and capabilities. The entire application, including the frontend, is served from a single Express server and is production-ready for deployment on platforms like Render.

## Architecture

The project follows the **MVC (Model-View-Controller)** pattern with a clear separation of concerns:

```
CourseSellingApp/
  index.js              # Application entry point and Express server
  index.html            # Single-page frontend application
  database/
    db.js               # Database initialization, schema definitions, connection management
  routes/
    user.routes.js      # User authentication and purchase routes
    admin.routes.js     # Admin authentication and course management routes
    course.routes.js    # Public course browsing and purchase execution routes
  controllers/
    user.controller.js  # User signup, signin, and purchase history logic
    admin.controller.js # Admin signup, signin, CRUD operations on courses
  middlewares/
    auth.middleware.js   # JWT verification for user-protected routes
    admin.middleware.js  # JWT verification for admin-protected routes
  configs/
    config.js           # Environment-based configuration for JWT secrets
```

## Technical Implementation

### Backend

The REST API is built on **Express 5** and exposes versioned endpoints under `/api/v1`. Route handlers are decoupled from business logic through dedicated controller modules. The server initializes the database before binding to the port, ensuring all tables exist before any requests are processed.

**Authentication** is implemented using **JSON Web Tokens (JWT)**. User and admin tokens are signed with separate secrets, preventing token reuse across roles. Passwords are hashed using **bcrypt** with a cost factor of 10 before storage. The authentication middleware extracts the Bearer token from the `Authorization` header, verifies it against the appropriate secret, and injects the decoded user ID into the request object for downstream handlers.

**Database operations** use the `sqlite` and `sqlite3` packages with async/await syntax. The schema enforces referential integrity through foreign key constraints between users, admins, courses, and purchases. A `UNIQUE(userId, courseId)` constraint on the purchase table prevents duplicate enrollments at the database level. The database connection is managed through a singleton pattern — initialized once at startup and accessed via a `getDatabase()` function throughout the application.

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/user/signup` | None | Register a new user account |
| POST | `/api/v1/user/signin` | None | Authenticate and receive JWT |
| GET | `/api/v1/user/purchases` | User | Retrieve enrolled courses |
| POST | `/api/v1/admin/signup` | None | Register a new admin account |
| POST | `/api/v1/admin/signin` | None | Authenticate as admin |
| POST | `/api/v1/admin/course` | Admin | Create a new course |
| PUT | `/api/v1/admin/course/:courseId` | Admin | Update course details |
| GET | `/api/v1/admin/course/bulk` | Admin | Fetch all courses by this admin |
| GET | `/api/v1/course/preview` | None | Browse all available courses |
| POST | `/api/v1/course/purchase` | User | Enroll in a course |

### Frontend

The frontend is a **single-page application** built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools. Navigation between views (home, browse, auth, dashboard, admin panel) is handled entirely client-side by toggling CSS classes. API communication is abstracted through a centralized `apiFetch()` function that automatically attaches the appropriate JWT token based on the current user role.

The UI implements a dark theme with consistent design tokens managed through CSS custom properties. Responsive layouts are achieved using CSS Grid and media queries, adapting the interface for both desktop and mobile viewports.

### Security Considerations

- JWT secrets are loaded from environment variables with fallback defaults for local development
- Passwords are never stored in plaintext; bcrypt handles hashing and comparison
- Admin and user token namespaces are isolated to prevent privilege escalation
- Input validation is performed on all endpoints before any database operations
- SQL injection is mitigated through parameterized queries on every database call
- Course ownership is verified before allowing edit operations

### Deployment

The application is configured for deployment on Render. The server reads the `PORT` from environment variables, serves the frontend statically from the root route, and uses relative API paths so the frontend works on any domain without configuration changes.

## Technologies Used

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** SQLite3 with the async `sqlite` wrapper
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcrypt
- **Frontend:** Vanilla HTML5, CSS3 (Custom Properties, Grid, Flexbox), JavaScript (ES6+, Fetch API)
- **Deployment:** Render (Web Service)

## Local Development

```bash
npm install
npm run dev     # Starts with nodemon for hot-reload
```

The server runs at `http://localhost:8000` by default.

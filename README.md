# 📚 Coursify LMS Project

Coursify is a comprehensive Learning Management System (LMS) where I developed a robust backend using Node.js, Express.js, and MongoDB. This backend includes features such as user authentication, user management, course management, lecture management, lecture dashboards, and an admin dashboard. To complement this powerful backend, I also designed a visually appealing and responsive frontend using React.

## Project Structure

The project is organized with a clear structure, separating the backend and frontend components:

## 🌐 Live Preview
Checkout Live Preview[![LivePreview](./client/src/assets/web.jpg)](https://coursify-lms.vercel.app/)
 by clicking the image above.


### Backend
- **server/**
  - **config/**
    - `db.js`: Database configuration.
  - **controller/**
    - `user.controller.js`: User-related logic.
    - `course.controller.js`: Course-related logic.
    - `payment.controller.js`: Payment-related logic.
    - `miscellaneous.controller.js`: Miscellaneous logic.
  - **middleware/**
    - `auth.middleware.js`: Authentication middleware.
    - `error.middleware.js`: Error handling middleware.
    - `multer.middleware.js`: Middleware for file uploads.
  - **models/**
    - `user.model.js`: User data model.
    - `course.model.js`: Course data model.
    - `payment.model.js`: Payment data model.
  - **route/**
    - `user.route.js`: User API routes.
    - `course.route.js`: Course API routes.
    - `payment.route.js`: Payment API routes.
    - `miscellaneous.route.js`: Miscellaneous API routes.
  - **uploads/**
    (Assuming for file uploads)
  - **utils/**
    - `error.utils.js`: Error handling utilities.
    - `email.util.js`: Email-related utilities.
    - `avatar.util.js`: Utilities for handling avatars.
    - `template.util.js`: Template-related utilities.
  - `server.js`: The main server file.
  - `app.js`: Express application configuration.
  - `.env`: Environment variables.
  - `.env.example.js`: Example environment variables.
  - `package.json`: Backend dependencies.

### Frontend
- **client/**
  - **src/**
    - **assets/**
    - **components/**
    - **helpers/**
    - **layout/**
    - **pages/**
    - **redux/**
    - `App.jsx`: React application entry point.
    - `index.css`: Global styles.
    - `main.jsx`: Main React component.
    - ...
  - `.env`: Environment variables.
  - `.env.example.js`: Example environment variables.
  - `.gitignore`: Git ignore file.
  - `index.html`: HTML entry point.
  - `package.json`: Frontend dependencies.
  - `README.md`: Project documentation.
  - ...


## Features
- **User Authentication**: Sign up, log in, change password, and reset password via email.
- **User Profile**: Edit profile details and view profile information.
- **Course Management**: Admin can create, edit, and delete courses.
- **Lecture Management**: Admin can add, edit, and delete lectures within courses.
- **Subscription**: Users can enroll in courses by purchasing a 1-year subscription.
- **Lecture Dashboard**: Display course lectures, play videos, and view lecture descriptions.

## API Endpoints
### User Routes
- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /logout`: Log out a user.
- `GET /me`: Get user profile info.
- `POST /reset`: Send email to reset password.
- `POST /reset/:resetToken`: User resets the password.
- `POST /change-password`: User can change the password using old and new passwords.
- `POST /update/:id`: User can update their profile.

### Course Routes
- `GET /courses`: Get all courses.
- `POST /courses`: Create a new course (Admin only).
- `GET /courses/:id`: Get lectures for a specific course.
- `PUT /courses/:id`: Update course details (Admin only).
- `DELETE /courses/:id`: Delete a course (Admin only).

### Payment Routes
- `GET /razorpay-key`: Get Razorpay API key.
- `POST /subscribe`: Buy a subscription.
- `POST /verify`: Verify a subscription.
- `POST /unsubscribe`: Cancel a subscription.

### Miscellaneous Routes
- `POST /contact`: Contact us.
- `GET /admin/stats/users`: Get user statistics (Admin only).

## 💻 Tech Stack
### Backend
- Node.js
- Express
- MongoDB
- Cors
- bcrypt
- Crypto
- Jsonwebtoken
- Dotenv
- Cookie-Parser
- Multer
- Cloudinary
- Nodemailer
- Razorpay

### Frontend
- React for creating the user interface.
- Tailwind CSS for styling elements.
- DaisyUI for creating a beautiful drawer.
- React-Icons for icons.
- React-Router for navigating between different pages.
- React-hot-toast for displaying small toast notifications.
- React-Redux for state management.
- Redux Toolkit for managing state in the global app.
- Chart.js for displaying charts for admin.
- React-Chartjs-2 for displaying charts for admin.

## Getting Started

Follow these steps to set up the project on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shoaibhasann/Coursify-LMS.git
   ```

2. **Set up the backend**:
   - Navigate to the `server` folder.
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js`.
   - Start the backend server: `npm start`

3. **Set up the frontend**:
   - Navigate to the `client` folder: `cd client`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js`.
   - Start the client development server: `npm run dev`

4. **Access the application**:
   Open your browser and visit: [http://localhost:5173](http://localhost:5173)

Made with ❤️ by Shoaib Hasan
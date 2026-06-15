# SecretClub (Members Only)

A full-stack, secure, invitation-based message board application built with Node.js, Express, and PostgreSQL. This project is part of **The Odin Project** curriculum and focuses on implementing secure user authentication, role-based access control, and clean relational database management.

Live Demo: _[https://secret-club.onrender.com]_


---

## Features

- **Secure Authentication:** User sign-up and log-in powered by `passport-local` and secure password hashing using `bcryptjs`.
- **Persistent Sessions:** User sessions are stored securely in the PostgreSQL database using `connect-pg-simple`, ensuring users stay logged in across server restarts.
- **Role-Based Access Control (RBAC):**
  - **Guests:** Can read all posted secrets, but author names and creation dates are completely hidden (displayed as anonymous).
  - **Members:** Can see who wrote each secret and exactly when it was posted after verifying a secret passcode.
  - **Administrators:** Possess all member privileges plus the exclusive power to delete any post directly from the feed.
- **Modern UI/UX:** Responsive, sleek dark-themed design accented with fresh mint tint, complete with custom glassmorphism notification toasts and progress bars.
- **Input Validation:** Robust server-side validation and sanitization using `express-validator` to prevent malicious data injection and handle form errors gracefully.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` pooling)
- **Authentication:** Passport.js (Local Strategy), bcryptjs
- **Session Management:** express-session, connect-pg-simple
- **View Engine:** EJS (Embedded JavaScript templates)
- **Styling:** Custom CSS (Modern BEM architecture, CSS Variables)

---

## Database Schema

The relational database architecture consists of three optimized tables:

1.  **`users`**: Stores user credentials, hashed passwords, and boolean state flags (`is_member`, `is_admin`) to control authorization privileges.
2.  **`messages`**: Contains post titles, text content, timestamps, and a foreign key (`user_id`) linking back to the `users` table with cascading deletions.
3.  **`session`**: A dedicated table handling persistent express sessions natively inside PostgreSQL.

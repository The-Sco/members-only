# SecretClub (Members Only)

A full-stack, secure, invitation-based message board application built with Node.js, Express, and Prisma ORM (PostgreSQL). This project is part of **The Odin Project** curriculum and focuses on implementing secure user authentication, role-based access control, and clean relational database management.

Live Demo: _[https://secret-club.onrender.com]_

---

## Secret codes

- **To become a member:** `aboba`
- **To become an admin:** `i_am_admin`
- **To reset your role:** `reset`

---

### Features

- **Secure Authentication:** User sign-up and log-in powered by `passport-local` and secure password hashing using `bcryptjs`.
- **Persistent Sessions:** User sessions are handled natively through Prisma ORM using `@quixo3/prisma-session-store`, ensuring users stay logged in across server restarts without using server RAM.
- **Prisma Powered Type-Safety:** Fully type-safe database queries and automated schema versioning powered by Prisma ORM.
- **Role-Based Access Control (RBAC):**
  - **Guests:** Can read all posted secrets, but author names and creation dates are completely hidden (displayed as anonymous).
  - **Members:** Can see who wrote each secret and exactly when it was posted after verifying a secret passcode.
  - **Administrators:** Possess all member privileges plus the exclusive power to delete any post directly from the feed.
- **Modern UI/UX:** Responsive, sleek dark-themed design accented with fresh mint tint, complete with custom glassmorphism notification toasts and progress bars.
- **Input Validation:** Robust server-side validation and sanitization using `express-validator` to prevent malicious data injection and handle form errors gracefully.

---

### Tech Stack

- **Backend:** Node.js, Express.js
- **Database ORM:** Prisma ORM (PostgreSQL)
- **Authentication:** Passport.js (Local Strategy), bcryptjs
- **Session Management:** express-session, @quixo3/prisma-session-store
- **View Engine:** EJS (Embedded JavaScript templates)
- **Styling:** Custom CSS (Modern BEM architecture, CSS Variables)

---

### Database Schema (Prisma Models)

The relational database architecture is strictly managed via our Prisma schema, consisting of three optimized models:

1.  **`users`**: Stores user credentials, hashed passwords, and boolean state flags (`is_member`, `is_admin`) to control authorization privileges. It maintains a 1-to-many relationship with the messages model.
2.  **`messages`**: Contains post titles, text content, timestamps, and a foreign key (`user_id`) mapped natively by Prisma to the `users` table with cascading deletions.
3.  **`Session`**: A dedicated schema structure handling persistent Express sessions mapping data to the `sess` column inside PostgreSQL.

# Clínica Médica - Fullstack Appointment System

Welcome to **Clínica Médica**, a modern fullstack web application for managing medical appointments. This project provides a seamless experience for both patients and clinic staff, allowing users to register, log in, schedule appointments, and for secretaries to manage all bookings via an administrative dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Live Demo on Vercel](#live-demo-on-vercel)
- [Getting Started](#getting-started)

---

## Live Demo on Vercel

You can access a live demo of the project hosted on Vercel:

- [Access the production deployment](https://clinica-medica-ba.vercel.app/)

---

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Registration & Login**: Patients and secretaries can register and log in securely.
- **Role-based Access**: Patients and secretaries have different permissions and dashboards.
- **Appointment Scheduling**: Patients can view available slots and schedule appointments.
- **Admin Dashboard**: Secretaries can view, confirm, or cancel all appointments.
- **Address Autocomplete**: Registration form fetches address details by CEP (Brazilian postal code).
- **Weather Alerts**: Appointments may display weather alerts if relevant.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.

---

## Tech Stack

**Frontend:**

- [Vue 3](https://vuejs.org/) (Composition API)
- [Pinia](https://pinia.vuejs.org/) (state management)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/) (build tool)
- [date-fns](https://date-fns.org/) (date formatting)

**Backend:**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/) (MongoDB ODM)
- [JWT](https://jwt.io/) (authentication)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (password hashing)
- [dotenv](https://github.com/motdotla/dotenv) (environment variables)
- [nodemon](https://nodemon.io/) (development)

---

## Project Structure

```
clinica_medica/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
└── frontend/
		├── src/
		│   ├── assets/
		│   ├── router/
		│   ├── services/
		│   ├── stores/
		│   ├── views/
		│   ├── App.vue
		│   └── main.js
		├── public/
		├── package.json
		├── vite.config.js
		├── index.html
		└── .gitignore
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/clinica-medica.git
cd clinica-medica
```

#### 2. Setup the Backend

```sh
cd backend
npm install
```

Create a `.env` file in the [`backend`](backend) directory with the following variables:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### 3. Setup the Frontend

```sh
cd ../frontend
npm install
```

---

### Running the Application

#### 1. Start the Backend

```sh
cd backend
npm run dev
```

The backend will run on [http://localhost:3000](http://localhost:3000).

#### 2. Start the Frontend

```sh
cd frontend
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Usage

- **Register** as a patient or secretary.
- **Login** to access your dashboard.
- **Patients** can:
  - View and schedule appointments.
  - See weather alerts for their appointments.
- **Secretaries** can:
  - Access the admin dashboard.
  - View all appointments.
  - Confirm or cancel appointments.

---

## API Overview

The backend exposes a RESTful API under `/api`. Example endpoints:

- `POST /api/auth/register` — Register a new user.
- `POST /api/auth/login` — Authenticate and receive a JWT.
- `GET /api/appointments` — List appointments (role-based).
- `POST /api/appointments` — Create a new appointment.
- `PUT /api/appointments/:id` — Update appointment status.
- `GET /api/appointments/availability` — Get available slots for a date.
- `GET /api/utils/cep/:cep` — Fetch address info by CEP.

> **Note:** See the backend [`routes/`](frontend/node_modules/vue-router/dist/vue-router.d.ts) and `controllers/` for full API details.

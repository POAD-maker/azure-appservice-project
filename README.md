# ☁️ DevOps Ticket Booking System

[![CI/CD Pipeline](https://github.com/lambertyno1/azure-appservice-project/actions/workflows/deploy.yml/badge.svg)](https://github.com/lambertyno1/azure-appservice-project/actions/workflows/deploy.yml)

## 📖 Project Overview

Welcome to the **DevOps Ticket Booking System**. 

While this repository contains a fully functional web application for browsing events, booking tickets, and managing an admin dashboard, **the application is merely the vehicle**. The true focus of this project is the **engine**: a production-ready, automated Cloud and DevOps lifecycle. 

This project demonstrates the ability to design, secure, automate, deploy, monitor, and maintain a cloud-native application using industry-standard practices, including containerization, CI/CD pipelines, infrastructure as code principles, and zero-downtime deployment strategies.

---

## ✨ Key Features

### Application Features
- **User Authentication**: Role-based login (User vs. Admin) with mock JWT token generation.
- **RESTful API**: Clean, documented endpoints for fetching events and creating bookings.
- **Dynamic Frontend**: A responsive, single-page application (SPA) built with vanilla HTML/CSS/JS.
- **Admin Dashboard**: Secure, token-protected view of all database bookings.
- **Duplicate Prevention**: Logic to ensure a single email cannot book the same event twice.

### DevOps & Cloud Features
- **Automated CI/CD**: GitHub Actions pipeline that builds, tests, and deploys on every merge to `main`.
- **Containerization**: Dockerized application ensuring 100% environment consistency.
- **Zero-Downtime Deployment**: Utilizes Azure App Service Deployment Slots (Staging → Production swap).
- **Quality Gates**: Automated `/health` endpoint checks before promoting code to production.
- **Secure Secrets Management**: Zero hardcoded credentials. All secrets are managed via GitHub Secrets and Azure Application Settings.
- **Observability**: Integrated Azure Log Stream and Application Logging for real-time troubleshooting.

---

## 🏗️ Architecture

The application follows a modern, decoupled architecture:
1. **Client**: Browser-based frontend communicating via REST API.
2. **Server**: Node.js/Express backend handling business logic and authentication.
3. **Database**: A dedicated integration layer (`app/database.js`). *(Note: For demonstration reliability, this uses an in-memory mock store structured identically to a real Azure PostgreSQL database).*
4. **Cloud Infrastructure**: Hosted on Microsoft Azure (App Service + Container Registry).

> 📌 **For a detailed visual diagram and deep-dive explanation, please see:** [`docs/architecture.md`](docs/architecture.md)

---

## 🛠️ Tech Stack

| Category | Technologies Used |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (Fetch API) |
| **Containerization** | Docker, Azure Container Registry (ACR) |
| **CI/CD** | GitHub Actions |
| **Cloud Provider** | Microsoft Azure (App Service, Log Analytics) |
| **Version Control** | Git, GitHub (Feature Branches & Pull Requests) |

---

## 📂 Project Structure

The repository is organized to reflect professional DevOps standards:

```text
azure-appservice-project/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline configuration
├── app/                        # Application source code
│   ├── database.js             # Database integration layer
│   ├── server.js               # Express backend, REST API, and Auth middleware
│   └── public/
│       └── index.html          # Frontend Single Page Application (SPA)
├── tests/                      # Automated Jest tests
├── docs/                       # Comprehensive project documentation
│   ├── architecture.md         # System design and data flow
│   ├── deployment.md           # Step-by-step deployment guide
│   └── troubleshooting.md      # Failure recovery and debugging guide
├── .dockerignore               # Files to exclude from Docker build
├── .env.example                # Template for required environment variables
├── .gitignore                  # Files to exclude from Git tracking
├── Dockerfile                  # Instructions for building the container image
├── package.json                # Node.js dependencies and scripts
└── README.md                   # This file

----

## 🔌 API Documentation

The application exposes a RESTful API for managing authentication, events, and bookings. 

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Health check for CI/CD pipeline and monitoring. | ❌ No |
| **POST** | `/api/register` | Registers a new user and hashes the password using `bcryptjs`. | ❌ No |
| **POST** | `/api/login` | Authenticates a user and returns a role-based session token. | ❌ No |
| **GET** | `/api/events` | Fetches the list of available events with countdown data. | ❌ No |
| **POST** | `/api/bookings` | Creates a new booking (enforces cooldown & duplicate checks). | ✅ Yes (User/Admin) |
| **GET** | `/api/admin/bookings` | Fetches all system bookings (Admin Dashboard data). | ✅ Yes (Admin Only) |

**Example Request (Create Booking):**
```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_TOKEN>" \
-d '{"eventId": 1, "userName": "John Doe", "userEmail": "john@example.com"}' \
https://your-app.azurewebsites.net/api/bookings

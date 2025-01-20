# Vacation Management System - Website Overview

## Introduction:
Welcome to the **Vacation Management System** – a streamlined platform designed to help organizations efficiently manage employee leave requests. The system is divided into two main portals: the **Admin Panel** and the **Employee Portal**, each offering distinct features to suit the needs of both administrators and employees.

---

## Admin Panel:
The **Admin Panel** provides administrators with full control over employee leave management. Key features include:
- **Employee Management**: Admins can easily add, update, or remove employee records.
- **Leave Requests Management**: Admins can review and process employee leave applications, either **approving** or **rejecting** leave requests.
- **Leave History Tracking**: Admins can view the complete leave history for all employees, providing transparency and easy access to past leave data.

---

## Employee Portal:
The **Employee Portal** is designed for employees to manage their leave requests and view their leave history. Key features include:
- **Leave History**: Employees can view their past leave requests and status, helping them keep track of their leave entitlements.
- **Apply for Leave**: Employees can submit new leave requests, choosing the type of leave and the dates, making the process seamless and easy.

---

With this system, both employees and admins can efficiently manage and track leave requests, ensuring smooth vacation planning and compliance with organizational policies.

# Setup Project
Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/guptaxvivek/vacation-manager.git

# Step 2: Navigate to the project directory.
cd vacation-manager

# Step 3: Start the server with auto-reloading and an instant preview.
docker-compose build
docker-compose up -d
```

## Access the WebApp
- Navigate to [localhost:3000](http://localhost:3000/)

## Login with Default Admin Account
Email: `adminuser@default.com`

Password: `adminpass`

## Stopping the Application
To stop the running containers:
```sh
docker-compose down
```

## What technologies are used for this project?

This project is built with .

- Python
- Django Rest Framework
- Vite
- React
- Tailwind CSS


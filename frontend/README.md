# Welcome to our Vacation Mangement project

## Project info
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

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/guptaxvivek/vacation-manager.git

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>
cd frontend

# Step 3: Install the necessary dependencies from terminal.
npm install date-fns@2.30.0 && npm i 

#You will get some version warnings but no issues it will run smoothly, we have different external date/time libraries used in project that give us date/time issues with inbuilt libraries but it will instead works well they are just warning.

# Step 4 : Add env variables into the project. Create .env file and add values 
REACT_APP_API_BASE_URL="http://127.0.0.1:8000/"

# Step 5: Start the development server with auto-reloading and an instant preview.
npm start
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- React
- Tailwind CSS


# ClaimBridge_Portal

## Overview
The **ClaimBridge_Portal** is a web application designed to streamline the process of submitting, tracking, and managing insurance claims. It provides separate portals for **patients** and **insurers**, enabling efficient claim handling.

Deployment link :- [https://claimbridgeportal.vercel.app/](https://claimbridgeportal.vercel.app/)

## Features

### Patient Side
- **Submit a Claim:**
  - Form fields: Name, Email, Claim Amount, Description
  - Upload supporting documents (e.g., receipts, prescriptions)
- **View Claims:**
  - Dashboard to track claim status: Pending, Approved, Rejected
  - Displays submission date and approved amount.

### Insurer Side
- **Claims Dashboard:**
  - View all submitted claims with filtering options by status, date, and claim amount
- **Manage Claims:**
  - Review claim details and uploaded documents
  - Update claim status (Approve/Reject) with approved amount and comments

### Shared Features
- **Authentication:**
  - Basic login system for patients and insurers (mock users for simplicity)
- **API Development:**
  - Endpoints for submitting, fetching, and updating claims
- **Database Management:**
  - Store claims data including ID, Name, Email, Claim Amount, Description, Status, Submission Date, and Insurer Comments

## Tech Stack
- **Frontend:** React.js (Typescript)
- **Backend:** Node.js & Express.js Framework
- **Database:** MongoDB

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Clone Repository
```sh
git clone https://github.com/qnasir/ClaimBridge_Portal.git
cd ClaimBridge_Portal
```

### Backend Setup
```sh
cd server
npm install
modemon index.js
```

### Frontend Setup
```sh
cd client
npm install
npm run dev
```

## License
This project is licensed under the MIT License.

## Contribution
Contributions are welcome! Feel free to submit a pull request or open an issue.


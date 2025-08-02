# 💼 JobBoard - Employer-side Job Management Platform

A full-featured **MERN Stack** application that allows employers to manage job postings with **CRUD functionality**, built with scalability in mind for future integration with applicant management, resume uploads, and user authentication.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

---

## 🖼️ Project Overview

JobBoard allows employers to:

- 📝 **Create** new job listings
- 📖 **Read** existing job listings
- 🛠️ **Update** job details
- ❌ **Delete** listings when needed
- **Filtering** listings by category, location, type, experience, and salary
- **Searching** jobs by keyword

This forms the foundation of a scalable job recruitment platform.

## 🚀 Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Other Tools:** REST API(JSON), React Router v6, Postman (for testing)

## 📂 Folder Structure
```bash
JobBoard/
├── client/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│             ├── FilterModal.jsx
│             ├── JobCard.jsx
│             ├── JobForm.jsx
│             ├── Navbar.jsx
│             └── ProtectedRoute.jsx
│       ├── contexts/
│             └── AuthContext.jsx
│       ├── pages/
│             ├── admin
│                   └── Dashboard.jsx
│             ├── EditJob.jsx
│             ├── Home.jsx
│             ├── JobListing.jsx
│             ├── PostJob.jsx
│             ├── Signup.jsx
│             └── Login.jsx
│       └── App.jsx
├── backend/           # Express backend
│   ├── models/
│   ├── routes/
│   ├── contants/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── README.md
```

## Key Features
### CRUD Operations
     - Create: Fill form to add new jobs
     - Read: View all jobs on home page
     - Update: Edit jobs via modal or form
     - Delete: Remove jobs instantly
### Filter + Search
     - Filter jobs by type, category, location, etc.
     - Real-time keyword search
### UI
     - Responsive design with TailwindCSS
     - Gradient backgrounds and modals
     - Dynamic badges and cards

## Future Scope
- Upgraded to full job recruitment platform
- Separate dashboards for employers vs job seekers
- Application/resume management
- Pagination, infinite scroll
- Email notifications


## ⚙️ Getting Started
🧰 Prerequisites
Node.js
MongoDB (Local or MongoDB Atlas)

```bash
# Clone the repository
git clone https://github.com/Nikhil-0010/JobBoard.git
cd JobBoard

# Start Backend
cd server
npm install
npm run dev

# Start Frontend
cd ../client
npm install
npm start
```


## 🔄 API Endpoints
| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/jobs`        | Get all jobs(with filters)  |
| GET   | `/api/options`      | Fetch dropdown filter data  |
| POST   | `/api/auth/signup` | Register user               |
| POST   | `/api/auth/login`  | Login user                  |
| POST   | `/api/jobs`        | Create a new job            |
| PUT    | `/api/jobs/:id`    | Update a specific job       |
| DELETE | `/api/jobs/:id`    | Delete a specific job       |

## Author
[Nikhil Yadav](https://github.com/Nikhil-0010)

***Thanks for reading***



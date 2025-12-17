## Project Title
Full Stack Web Application using Node.js, Express, EJS, and Supabase

## Project Description

This project is a full stack web application developed as part of the Cognifyz Technologies Internship program. The application demonstrates the implementation of both frontend and backend concepts including server-side rendering, form validation, RESTful APIs, database integration, authentication, and protected routes.

The project has been developed incrementally by completing Tasks 1 to 6 as defined in the internship task list.


## Objectives

* To understand server-side rendering using EJS
* To implement form handling and validation
* To design responsive user interfaces
* To develop RESTful APIs
* To integrate a cloud-based database
* To implement authentication and authorization
* To protect application routes using sessions


## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* EJS (Embedded JavaScript Templates)
* Supabase (PostgreSQL)
* express-session
* Git and GitHub



## Project Structure


cognifyz-internship/
│
├── app.js
├── package.json
├── package-lock.json
├── supabaseClient.js
├── supabaseClientPublic.js
├── public/
│   ├── css/
│   └── js/
├── views/
│   ├── index.ejs
│   ├── form.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   └── thankyou.ejs
├── .gitignore
└── README.md
```

---

## Tasks Completed

---

### Task 1: HTML Structure and Basic Server Interaction

**Objective:**
Introduce server-side rendering and basic form submission.

**Implementation:**

* Created HTML structure using EJS templates
* Set up a Node.js server using Express
* Implemented server-side routes
* Dynamically rendered pages using EJS

---

### Task 2: Inline Styles, Basic Interaction, and Server-Side Validation

**Objective:**
Enhance user interaction and implement validation.

**Implementation:**

* Added client-side validation using JavaScript
* Implemented server-side validation for form inputs
* Displayed validation error messages
* Stored validated data temporarily on the server


### Task 3: Advanced CSS Styling and Responsive Design

**Objective:**
Improve user interface and responsiveness.

**Implementation:**

* Designed responsive layouts using CSS
* Enhanced visual appearance of pages
* Structured pages into multiple sections
* Ensured compatibility across devices

---

### Task 4: Complex Form Validation and Dynamic DOM Manipulation

**Objective:**
Improve form usability and dynamic behavior.

**Implementation:**

* Implemented password strength validation
* Dynamically updated DOM based on user input
* Enhanced user experience using JavaScript
* Improved form interaction and feedback

---

### Task 5: API Integration and Front-End Interaction

**Objective:**
Introduce RESTful API communication.

**Implementation:**

* Created RESTful API endpoints
* Implemented CRUD operations
* Connected frontend with backend APIs
* Displayed API responses dynamically

**API Endpoints:**

* GET `/api/entries`
* POST `/api/entries`
* PUT `/api/entries/:id`
* DELETE `/api/entries/:id`

---

### Task 6: Database Integration and Authentication

**Objective:**
Implement persistent storage and user authentication.

**Implementation:**

* Integrated Supabase as the backend database
* Created database tables for storing entries
* Implemented user registration and login
* Managed user sessions using express-session
* Protected routes such as the dashboard
* Stored form submissions permanently in the database

---

## Authentication Features

* User registration
* User login
* User logout
* Session-based authentication
* Protected dashboard route

---

## How to Run the Project Locally

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Configure environment variables

Create a `.env` file (not included in the repository):

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SESSION_SECRET=your_secret
```

### Step 3: Start the server

```bash
npm run dev
```

### Step 4: Open in browser

```
http://localhost:3000
```

---

## Outputs

Screenshots included in the final submission demonstrate:

* Home page
* Registration page
* Login page
* Dashboard page
* API response output

---

## GitHub Repository

```
https://github.com/uday2224/cognifyz-internship
```

---

## Conclusion

This project successfully demonstrates the practical implementation of full stack development concepts learned during the Cognifyz Internship. All assigned tasks up to Task 6 have been completed as per the guidelines.



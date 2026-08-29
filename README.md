# Survey Hub

A web application that lets registered users create surveys, add questions, publish them with a shareable public link, collect responses from anyone, and study the results with statistics and charts.

The project is built on Node.js with Express, follows the MVC pattern, renders pages on the server with EJS, and stores everything in MongoDB.

---

## Features

- Register, log in and log out with session based authentication
- Passwords hashed with bcrypt before they are stored
- Create, view, edit and delete your own surveys from a personal dashboard
- Four question types: single choice, multiple choice, short text and rating
- Add, edit, reorder and remove questions while a survey is still a draft
- Draft to published to closed lifecycle, with the option to reopen a closed survey
- Unique public share link for every published survey, with copy to clipboard
- Anyone can answer a published survey without creating an account
- Server side validation with Joi on every form, including submitted answers
- Results page with total responses, per question counts, percentages, rating averages and charts
- Admin role that can see all users, all surveys and overall statistics
- Flash messages, form repopulation, and friendly 404 and 500 pages

---

## Technology

| Area | Choice |
|------|--------|
| Language | JavaScript (Node.js) |
| Web framework | Express.js |
| Architecture | MVC (Model, View, Controller) |
| View engine | EJS with express-ejs-layouts |
| Styling | Bootstrap 5, Font Awesome 6, custom CSS |
| Database | MongoDB with Mongoose |
| Validation | Joi |
| Charts | Chart.js (loaded from a CDN on the results page only) |

### npm packages and why each one is needed

| Package | Why it is used |
|---------|----------------|
| `express` | The web framework that handles routing, middleware and requests |
| `ejs` | Template engine used to render HTML pages on the server |
| `express-ejs-layouts` | Lets every page share one base layout instead of repeating the head, navbar and footer |
| `mongoose` | Connects to MongoDB and defines the schemas for users, surveys and responses |
| `dotenv` | Loads configuration such as the port and database URI from a `.env` file |
| `joi` | Validates all submitted form data on the server |
| `express-session` | Keeps the logged in user's id in a session so login persists between requests |
| `connect-flash` | Stores one time success and error messages across a redirect |
| `bcrypt` | Hashes passwords so plain passwords are never stored |
| `cookie-parser` | Parses the cookie header, used alongside the session middleware |
| `method-override` | Lets HTML forms send PUT and DELETE requests, which forms cannot do on their own |
| `nodemon` (dev only) | Restarts the server automatically while developing |

---

## Folder and file structure

```
MyOwn OSS/
├── app.js                      Application entry point: middleware, routes, server start
├── package.json                Project metadata, dependencies and npm scripts
├── .env                        Local configuration (not committed)
├── .env.example                Template showing which variables are needed
├── .gitignore                  Keeps node_modules and .env out of version control
├── README.md                   This file
│
├── config/
│   └── database.js             Connects to MongoDB and reports connection status
│
├── models/
│   ├── User.js                 User schema, password hashing, password comparison
│   ├── Survey.js               Survey schema with the embedded question sub schema
│   └── Response.js             Stores one submitted response and its answers
│
├── controllers/
│   ├── homeController.js       Home, about and contact pages
│   ├── authController.js       Register, login and logout
│   ├── surveyController.js     Survey CRUD, publish/close/reopen, results
│   ├── questionController.js   Add, edit, move and delete questions in a survey
│   ├── responseController.js   Public survey page, answer submission, thank you page
│   └── adminController.js      Admin statistics, user and survey management
│
├── routes/
│   ├── homeRoutes.js           Public informational pages
│   ├── authRoutes.js           /auth register, login and logout routes
│   ├── surveyRoutes.js         /surveys routes, all protected by login
│   ├── questionRoutes.js       Question routes nested under a survey
│   ├── responseRoutes.js       /s public routes reached by share link
│   └── adminRoutes.js          /admin routes, protected by the admin role
│
├── middleware/
│   ├── auth.js                 isAuthenticated and isGuest guards
│   ├── currentUser.js          Loads the logged in user into res.locals for the views
│   ├── ownership.js            Loads a survey and checks it belongs to the current user
│   ├── admin.js                isAdmin guard for the admin section
│   ├── validate.js             Reusable Joi validation runner used by every form route
│   └── errorHandler.js         404 catch all and the global error handler
│
├── validators/
│   ├── authValidator.js        Joi schemas for register and login
│   ├── surveyValidator.js      Joi schemas for a survey and for a single question
│   └── responseValidator.js    Builds a Joi schema from a survey's own questions
│
├── utils/
│   ├── questionTypes.js        The question types, their labels and the rating scale
│   ├── slug.js                 Generates a unique public share slug
│   ├── aggregate.js            Turns raw responses into per question statistics
│   ├── AppError.js             Small error class carrying an HTTP status code
│   └── seed.js                 Optional script that creates sample data
│
├── views/
│   ├── layouts/main.ejs        Base layout with head, navbar, content slot and footer
│   ├── partials/
│   │   ├── navbar.ejs          Navigation that changes with login state and role
│   │   ├── footer.ejs          Page footer
│   │   ├── flash.ejs           Renders success and error messages
│   │   └── statusBadge.ejs     Coloured badge for a survey status
│   ├── home/                   index.ejs, about.ejs, contact.ejs
│   ├── auth/                   register.ejs, login.ejs
│   ├── surveys/
│   │   ├── index.ejs           Dashboard listing the user's own surveys
│   │   ├── new.ejs             Create survey page
│   │   ├── edit.ejs            Edit survey page
│   │   ├── form.ejs            Shared survey form used by new.ejs and edit.ejs
│   │   ├── show.ejs            Survey detail, questions, share link, lifecycle buttons
│   │   └── results.ejs         Statistics and charts for one survey
│   ├── questions/
│   │   ├── new.ejs             Add question page
│   │   ├── edit.ejs            Edit question page
│   │   └── form.ejs            Shared question form used by new.ejs and edit.ejs
│   ├── respond/
│   │   ├── show.ejs            The public form a respondent fills in
│   │   └── thankyou.ejs        Confirmation after submitting
│   ├── admin/                  dashboard.ejs, users.ejs, surveys.ejs
│   └── errors/                 404.ejs, 500.ejs
│
└── public/
    ├── css/style.css           All custom styling
    └── js/
        ├── questionForm.js     Shows, hides and adds option fields on the question form
        ├── share.js            Copies the public share link to the clipboard
        └── results.js          Draws the result charts with Chart.js
```

---

## Requirements

- Node.js (LTS version) and npm
- A running MongoDB instance, either installed locally or a MongoDB Atlas connection string

---

## Installation and setup

1. Install the dependencies:

```bash
npm install
```

2. Create your `.env` file from the template:

```bash
cp .env.example .env
```

3. Open `.env` and fill in the values.

### Environment variables

| Variable | Meaning |
|----------|---------|
| `PORT` | Port the server listens on. Defaults to 3000 if left out |
| `MONGODB_URI` | MongoDB connection string, for example `mongodb://127.0.0.1:27017/online_survey_system` |
| `SESSION_SECRET` | A long random string used to sign the session cookie. Use your own value |
| `NODE_ENV` | `development` while working locally, `production` when deployed |

Note: when `NODE_ENV` is set to `production` the session cookie is marked `secure`, which means the browser only sends it over HTTPS. Keep it as `development` when running on plain `http://localhost`.

---

## Running the project

Start with automatic restarts while developing:

```bash
npm run dev
```

Start normally:

```bash
npm start
```

Then open `http://localhost:3000` in a browser. The server connects to MongoDB first and only starts listening once the connection succeeds, so a connection problem is reported clearly instead of failing later.

---

## Sample data and the admin account

An optional seed script creates two accounts, two surveys and a few responses so the app can be demonstrated straight away:

```bash
npm run seed
```

It prints the logins when it finishes:

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | `admin@example.com` | `admin123` | admin |
| Survey creator | `riya@example.com` | `riya1234` | user |

Running the script again replaces the sample records it created before and leaves any other data alone. These passwords are only meant for local demonstration, so change them before using the project anywhere real.

To make an existing account an admin instead of using the seed script, change its `role` field to `admin` in the `users` collection.

---

## Project workflow

1. A visitor opens the landing page and registers an account.
2. After logging in they land on their dashboard, which lists only their own surveys.
3. They create a survey with a title and description.
4. They add questions of any of the four types. Choice questions need at least two options.
5. They publish the survey. Publishing requires at least one question and generates a unique share link.
6. Once published the question structure is locked so that collected answers stay meaningful. The title and description can still be edited.
7. They share the public link. Anyone can open it and submit answers without an account.
8. Answers are validated on the server against that survey's own questions and then stored.
9. The owner opens the results page to see totals, per question counts, percentages, rating averages, written answers and charts.
10. The survey can be closed to stop new responses, and reopened later. The share link stays the same.
11. An admin can review all users and surveys and remove anything unwanted.

---

## npm scripts

| Script | What it does |
|--------|--------------|
| `npm start` | Runs the server with node |
| `npm run dev` | Runs the server with nodemon and restarts on changes |
| `npm run seed` | Creates the sample accounts, surveys and responses |

---

## Notes and assumptions

- **Implementation language.** The original brief listed C++ as the language while also requiring a Node.js, Express, EJS and MongoDB stack. A server rendered MongoDB web application on that stack has to be written in JavaScript, so JavaScript on Node.js is used throughout.
- **Respondents do not need accounts.** Answering a published survey only needs the link. Creating and managing surveys needs a login. If a logged in user happens to answer a survey their id is stored with the response, otherwise it is left empty.
- **Authentication** is session based with bcrypt hashed passwords. No third party sign in is used, which keeps the project self contained.
- **Editing rule.** Questions can only be changed while a survey is a draft. This is a deliberate choice so that responses already collected still line up with the questions that were asked.
- **Percentages** on the results page are calculated from the number of people who answered that particular question, not the total number of responses. Each question shows "N of M answered" so the base is always clear. Multiple choice percentages can add up to more than 100 because one person can pick several options.
- **Rating questions** use a fixed 1 to 5 scale.
- **Deleting** a survey also deletes its responses, and deleting a user from the admin area also deletes their surveys and those responses.
- **Charts** are drawn in the browser with Chart.js, but every number shown is calculated on the server.

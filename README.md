# GitHub Developer Explorer

GitHub Developer Explorer is a responsive web application that allows users to search for GitHub developers and explore their public profile information, repositories, programming languages, and repository statistics through an intuitive and professional interface.

The project is developed using **HTML, CSS, and JavaScript** and follows a modular architecture where UI rendering and API/business logic are separated for easier collaboration and maintenance.

## Features

### Developer Search

* Search GitHub users by username
* Instant search functionality
* User-friendly interface

### Profile Information

* Profile Avatar
* Full Name
* Username
* Bio
* Followers Count
* Following Count
* Public Repository Count

### Repository Explorer

* Repository Name
* Repository Description
* Star Count
* Fork Count
* Primary Language
* Responsive Repository Cards

### Language Breakdown

* Display programming languages used across repositories
* Repository count per language
* Organized language statistics

### Repository Sorting

* Sort by Repository Name
* Sort by Stars
* Sort by Forks

### API Information

* API Rate Limit Status
* Error Handling
* Loading Indicators

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### API

* GitHub REST API

## JavaScript Concepts Implemented

### DOM Manipulation

* getElementById()
* querySelector()
* querySelectorAll()
* createElement()
* appendChild()
* innerHTML
* innerText
* classList.add()

### Event Handling

* addEventListener()
* click event
* input event

### Asynchronous JavaScript

* fetch()
* async / await
* Promise Handling

### Error Handling

* try
* catch
* finally
* Error Object

### Array Methods

* forEach()
* filter()
* find()
* map()
* reduce()
* sort()
* includes()

### ES6 Features

* let & const
* Arrow Functions
* Template Literals
* Destructuring

## Project Structure

```text
GitHub-Developer-Explorer/
│
├── index.html
├── style.css
├── ui.js
├── api.js
├── app.js
├── package.json
├── .gitignore
└── README.md
```

## Architecture

### Member 1 – UI Layer

Files:

* index.html
* style.css
* ui.js

Functions:

* displayProfile()
* displayRepositories()
* displayLanguages()
* showLoader()
* hideLoader()
* showError()

### Member 2 – API & Business Logic

Files:

* api.js
* app.js

Functions:

* fetchProfile()
* fetchRepositories()
* fetchRateLimit()
* searchUser()
* sortRepositories()
* calculateLanguageBreakdown()

## License

This project is intended for educational and learning purposes.

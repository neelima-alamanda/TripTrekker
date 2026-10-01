# 🌍 TripTrekker – Smart Travel Planning Web App

TripTrekker is a full-stack travel planning web application that helps users explore tourist attractions, hotels, and restaurants based on their selected city.

The application combines a web-based frontend, Express.js backend, MongoDB authentication, Geoapify location data, and a trip budget estimation system into a single travel planning platform.

---

## 🚀 Overview

TripTrekker simplifies travel planning by bringing important travel information into one application.

Users can:

- 🔐 Create an account and log in
- 🌍 Explore tourist attractions by city
- 🏨 Discover hotels in the selected city
- 🍽️ Find restaurants in the selected city
- 💰 Estimate their trip budget
- 📊 View a final estimated trip cost

---

## ✨ Key Features

### 🔐 User Authentication

- User registration
- User login
- MongoDB-based user storage
- Required-field validation
- Duplicate username/email checking
- Password hashing using bcrypt
- Database connection string stored in an environment variable

### 🌍 Tourism Recommendations

- City-based tourist attraction recommendations
- Curated attraction data for supported cities
- Geoapify fallback for additional tourism locations
- Attraction information such as name, address, and entry fee when available

### 🏨 Hotel Recommendations

- Dynamic hotel discovery using Geoapify
- City-based hotel search
- Hotel name and address information
- Rating information when available

### 🍽️ Restaurant Recommendations

- Dynamic restaurant discovery using Geoapify
- City-based restaurant search
- Restaurant name and address information
- Rating information when available

### 💰 Trip Budget Estimation

The application provides an estimated trip budget based on user-selected values.

The estimation considers:

- Hotel budget × number of nights
- Food budget × meals per day × travellers × trip days
- Trip days = number of nights + 1
- Known tourist attraction entry fees

Attractions without a known entry fee are excluded from the tourism cost.

The final page displays the estimated hotel, food, tourism, and total trip costs.

> **Note:** Hotel and restaurant amounts are budget estimates based on user selections and are not live room or menu prices.

---

## 🛠️ Tech Stack

### 👨‍💻 Frontend

- HTML
- CSS
- JavaScript

### ⚙️ Backend

- Node.js
- Express.js

### 🗄️ Database

- MongoDB
- Mongoose

### 🌐 External API

- Geoapify API

---

## 🧠 System Architecture

```text
User
  │
  ▼
Frontend
HTML + CSS + JavaScript
  │
  ▼
Express.js Backend
  │
  ├── Authentication
  │      │
  │      ▼
  │   MongoDB
  │
  ├── Tourism Recommendations
  │      │
  │      ├── Curated Data
  │      └── Geoapify Fallback
  │
  ├── Hotel Recommendations
  │      │
  │      ▼
  │   Geoapify API
  │
  └── Restaurant Recommendations
         │
         ▼
      Geoapify API
```

---

## 📂 Project Structure

```text
TripTrekker/
│
├── public/
│   ├── index.html
│   ├── signup.html
│   ├── preview.html
│   ├── tourism.html
│   ├── hotels.html
│   ├── rest.html
│   ├── conclusion.html
│   ├── about.html
│   │
│   └── images/
│       └── logo.png
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/neelima-alamanda/TripTrekker.git
```

### 2. Navigate to the project

```bash
cd TripTrekker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
GEOAPIFY_API_KEY=your_geoapify_api_key
```

### 5. Start the server

```bash
node server.js
```

### 6. Open the application

```text
http://localhost:3001
```

---

## 🔐 Environment Note

⚠️ API keys and database connection details should be stored securely using a `.env` file.

Required environment variables:

```text
MONGODB_URI
GEOAPIFY_API_KEY
```

The `.env` file should **not** be committed to GitHub.

---

## 📊 Highlights

- Combines frontend, backend, database, and external API integration
- Uses curated tourism data with a Geoapify fallback
- Provides hotel and restaurant recommendations by city
- Includes trip budget estimation
- Uses bcrypt for password hashing

---

## 📈 Future Improvements

- 📱 Further mobile responsiveness improvements
- 🗺️ Advanced interactive map integration
- 🔐 JWT-based authentication
- ⭐ User reviews and ratings
- 🌐 Expansion of curated tourism data
- 💾 Saving and managing personalized trips
- 📊 More detailed trip cost breakdowns

---

## 👨‍💻 Author

**Neelima Alamanda**

This project was originally developed as a team project.
Original team repository:
https://github.com/BhanuTeja1705/TripTrekker

This fork contains my additional work, including:

- Backend and Geoapify integration
- Improved tourism recommendations
- Hotel and restaurant recommendations
- Trip budget estimation
- Environment-based configuration
- Password hashing using bcrypt
- Documentation updates
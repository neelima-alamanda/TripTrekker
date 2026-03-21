# 🌍 TripTrekker – Smart Travel Planning Web App

A full-stack travel planning web application that helps users explore tourist attractions, hotels, and restaurants based on selected cities.  
The system provides an interactive UI along with real-time data fetched from external APIs.

---

## 🚀 Overview

TripTrekker is designed to simplify travel planning by combining **location-based services**, **user authentication**, and **real-time data** into one platform.

Users can:
- Explore tourist places 🏝️  
- Find hotels 🏨  
- Discover restaurants 🍽️  
- Create accounts and manage access 🔐  

---

## ✨ Key Features

- 🔐 User Registration & Login (MongoDB + Express)
- 🌍 Explore tourist attractions by city
- 🏨 Hotel recommendations
- 🍽️ Restaurant suggestions
- ⚡ Real-time data using Geoapify API
- 🎨 Clean and interactive UI
- 📱 Responsive frontend pages

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
- MongoDB (Mongoose)

### 🌐 APIs
- Geoapify API (Tourism, Hotels, Restaurants)

---

## 🧠 System Architecture

- **Frontend (HTML/CSS/JS)** → User Interface  
- **Backend (Express Server)** → Handles routes & logic  
- **Database (MongoDB)** → Stores user data  
- **External API** → Fetches real-time travel data  

---

## 📂 Project Structure

```bash
TripTrekker/
├── public/                 # Frontend files
│   ├── index.html
│   ├── signup.html
│   ├── tourism.html
│   ├── hotels.html
│   ├── rest.html
│   ├── preview.html
│   ├── about.html
│   ├── images/
│
├── server.js               # Backend server
├── package.json            # Dependencies
├── package-lock.json
├── .gitignore
├── README.md

⚙️ Installation & Setup

Clone the repository:
git clone https://github.com/BhanuTeja1705/TripTrekker.git

Navigate to project:
cd TripTrekker

Install dependencies:
npm install

Run the server:
node server.js

Open in browser:
http://localhost:3000

🔐 Environment Note

⚠️ API keys and database URLs should be stored securely using .env file.

Example:

MONGO_URI=your_mongodb_url

API_KEY=your_api_key

📊 Unique Value

Combines frontend + backend + database + API

Real-world use case (travel planning)

Full-stack architecture

Dynamic data fetching

📈 Future Improvements

📱 Mobile responsive improvements
🗺️ Map integration (Google Maps)
🔐 JWT authentication
🌐 Multi-city global support
⭐ User reviews & ratings

👨‍💻 Author

Goriparthi Bhanu Teja

⭐ If you like this project, give it a star!

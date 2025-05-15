# 🧼 DoorStep Shine – Car Wash Booking Website

**DoorStep Shine** is a fully responsive and interactive car wash booking platform built with the **MERN stack**. It offers a seamless experience for both users and admins, featuring role-based access control, dynamic pricing, time-slot validation, and an AI-powered chatbot for assistance.

## 🚘 Features

### 🔓 Authentication & Authorization
- Secure registration and login
- Role-based access for **Users** and **Admins**

### 🧑‍💼 User Features
- 🚗 **Dynamic Car Type Selection**: Pricing updates based on the selected car type.
- 📅 **Time Slot Booking**: Smart slot allocation where each slot allows max 3 bookings.
- ❌ **Full Slot Indicator**: Similar to movie seat booking – unavailable slots are marked full.
- 📋 **Booking History**: View past and current bookings.
- ✍️ **Feedback Submission**: Leave reviews for past bookings.
- 🗑️ **Delete Booking**: Users can cancel upcoming bookings.
- 🤖 **AI Chatbot**: Ask questions about services and get instant answers.

### 🛠️ Admin Features
- 📊 **Admin Dashboard**: View all users and all bookings.
- 👤 **User Booking View**: Click on any user to see their detailed booking history.
- 📆 **Date Filter**: Filter bookings by selected dates.
- 🔄 **Status Management**: Update booking status (Pending, Completed, Cancelled).

## 💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based role control
- **AI Chatbot**: Integrated conversational assistant for user queries

## 📦 Project Structure

/client → React frontend
/server → Node.js + Express backend
/config → Environment & DB configuration
/models → MongoDB schema definitions
/routes → API endpoints
/middleware → Auth and role-based access handlers

bash
Copy
Edit

## 🧠 Smart Features

### 🎯 Dynamic Pricing
Based on the car type selected, prices automatically adjust in the UI and backend.

### ⌛ Time-Slot Validation
Each time slot allows a maximum of **3 cars**.
If a slot is full, it appears as **disabled** on the frontend to prevent overbooking.

### 🤖 AI Chatbot
An interactive bot that helps users navigate the platform and get answers to common queries.

## 🖼️ UI Preview

> _Add relevant screenshots/gifs here showcasing booking, time-slot logic, admin panel, etc._

## 📋 How to Run

### Prerequisites
- Node.js & npm
- MongoDB instance (local or cloud)
- Environment variables (`.env` files for backend & frontend)

### Installation

```bash
# Clone the repo
git clone https://github.com/tejraval11/DoorStep-Shine.git
cd DoorStep-Shine

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start backend
cd ../server
npm run dev

# Start frontend
cd ../client
npm start
📅 Booking Status Lifecycle
text
Copy
Edit
Pending ➝ Completed / Cancelled (updated by Admin)
🚀 Future Enhancements
Payment Gateway Integration (Razorpay/Stripe)

Email Notifications for Booking Confirmations

Admin Analytics Dashboard

Multi-location support

📜 License
MIT License

👤 Author
Tej Raval
📧 tejraval.connect@gmail.com
🔗 GitHub
🔗 LinkedIn
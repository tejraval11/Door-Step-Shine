import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Services from "./Services";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Booking from "./Booking";
import GetBookings from "./BookingList";
import Chatbot from "./Chatbot";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import MyBookings from "./MyBookings";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Services />
                <HowItWorks />
                <Testimonials />
                <BookingWrapper />
                <Footer />
              </>
            } />
            <Route path="/get-bookings" element={<ProtectedRoute><GetBookings /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
};

const BookingWrapper: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return isAuthenticated ? (
    <Booking />
  ) : (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to book your car wash?</h2>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Login to Book
        </button>
        <button
          onClick={() => window.location.href = '/register'}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminAuthenticated = !!localStorage.getItem('token') && user.isAdmin;
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default App;
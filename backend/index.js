require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Booking = require('./models/Booking');
const User = require('./models/User');

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://ravaltej11:359cr8YrMASafNHS@cluster0.frcpa.mongodb.net/bookings")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Door Step Shine Backend');
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Create Booking (Authenticated)
app.post("/create", authenticate, async (req, res) => {
  try {
    const { carType, service, price, date, time } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newBooking = new Booking({
      userId,
      name: user.name,
      email: user.email,
      carType,
      service,
      price,
      date,
      time
    });
    
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Bookings (Authenticated)
app.get('/user-bookings', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings', details: error.message });
  }
});

// ========== ADMIN ENDPOINTS ========== //

// Get all users (Admin only)
app.get('/admin/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
});

// Get bookings for a specific user (Admin only)
app.get('/admin/user/:userId/bookings', authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user bookings', details: error.message });
  }
});

// Get all bookings (Admin only)
app.get('/admin/bookings', authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all bookings', details: error.message });
  }
});

// Update booking status (Admin only)
app.put('/admin/bookings/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking', details: error.message });
  }
});

// Delete any booking (Admin only)
app.delete('/admin/bookings/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking', details: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  carType: { type: String, required: true },
  service: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String }
}, { timestamps: true });

// Add index for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
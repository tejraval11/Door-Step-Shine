import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CarPricing {
  [key: string]: {
    [key: string]: number;
  };
}

const carPricing: CarPricing = {
  "Hatchback": { "Exterior Wash": 300, "Interior Detailing": 500, "Full Car Detailing": 800 },
  "Sedan": { "Exterior Wash": 400, "Interior Detailing": 600, "Full Car Detailing": 1000 },
  "SUV": { "Exterior Wash": 500, "Interior Detailing": 700, "Full Car Detailing": 1200 },
};

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [carType, setCarType] = useState("");
  const [service, setService] = useState("");
  const [datetime, setDatetime] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    if (!carType) validationErrors.carType = "Car type is required";
    if (!service) validationErrors.service = "Service selection is required";
    if (!datetime) validationErrors.datetime = "Date and time are required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleServiceChange = (selectedService: string) => {
    setService(selectedService);
    if (carType && selectedService) {
      setPrice(carPricing[carType][selectedService]);
    } else {
      setPrice(null);
    }
  };

  const handleCarTypeChange = (selectedCarType: string) => {
    setCarType(selectedCarType);
    if (selectedCarType && service) {
      setPrice(carPricing[selectedCarType][service]);
    } else {
      setPrice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Please login to make a booking");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    // Extracting date and time separately
    const selectedDate = new Date(datetime);
    const date = selectedDate.toISOString().split("T")[0];
    const time = selectedDate.toTimeString().split(" ")[0];

    const bookingData = {
      carType,
      service,
      price: price ?? 0,
      date,
      time,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/create",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Booking confirmed:", response.data);
      alert(`Booking confirmed! Total Price: ₹${price}`);

      // Clear form fields after successful booking
      setCarType("");
      setService("");
      setDatetime("");
      setPrice(null);
      setErrors({});

      // Redirect to my-bookings page
      navigate("/my-bookings");
    } catch (error: any) {
      console.error("Error confirming booking:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("There was an error with your booking. Please try again.");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <section id="book" className="py-16 bg-gray-100 text-black text-center">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Please Login to Book</h2>
          <p className="mb-6">You need to be logged in to make a booking.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Register
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-16 bg-gray-100 text-black text-center">
      <h2 className="text-3xl font-bold mb-8">Book Your Car Wash Today!</h2>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6 text-left">
          <p className="font-semibold">Booking as: {user?.name}</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Car Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Select Car Type</label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={carType}
              onChange={(e) => handleCarTypeChange(e.target.value)}
            >
              <option value="">-- Choose a Car Type --</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
            {errors.carType && <p className="text-red-500 text-sm mt-1">{errors.carType}</p>}
          </div>

          {/* Service Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Select Service</label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={service}
              onChange={(e) => handleServiceChange(e.target.value)}
            >
              <option value="">-- Choose a Service --</option>
              <option value="Exterior Wash">Exterior Wash</option>
              <option value="Interior Detailing">Interior Detailing</option>
              <option value="Full Car Detailing">Full Car Detailing</option>
            </select>
            {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
          </div>

          {/* Date and Time */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Select Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            />
            {errors.datetime && <p className="text-red-500 text-sm mt-1">{errors.datetime}</p>}
          </div>

          {/* Display Price */}
          {price !== null && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-bold text-blue-700">Total Price: ₹{price}</p>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Confirm Booking
          </button>

          {/* View Bookings Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View My Bookings →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Booking;
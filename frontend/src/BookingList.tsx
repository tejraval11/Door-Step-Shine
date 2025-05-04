import React, { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  _id: string;
  name: string;
  email: string;
  carType: string;
  service: string;
  price: number;
  date: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getbookings");
      setBookings(response.data);
    } catch (err: any) {
      setError("Error fetching bookings");
      console.error(err);
    }
  };

  // Delete a booking by name
  const handleDelete = async (name: string) => {
    try {
      const response = await axios.delete("http://localhost:5000/bookings", {
        data: { name },
      });

      if (response.data.deletedCount > 0) {
        setBookings(bookings.filter((booking) => booking.name !== name));
        alert("Booking(s) deleted successfully!");
      } else {
        alert("No booking found with that name.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("There was an error deleting the booking.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to format date and time properly
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Bookings</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="max-w-lg mx-auto">
          {bookings.length === 0 ? (
            <p className="text-center">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 mb-6 rounded-lg shadow-md border border-gray-200"
              >
                <p className="font-bold text-lg text-blue-600">🚗 {booking.carType}</p>
                <p><span className="font-semibold">Name:</span> {booking.name}</p>
                <p><span className="font-semibold">Email:</span> {booking.email}</p>
                <p><span className="font-semibold">Service:</span> {booking.service}</p>
                <p><span className="font-semibold">Price:</span> ₹{booking.price}</p>
                <p><span className="font-semibold">Date & Time:</span> {formatDateTime(booking.date)}</p>
                <button
                  onClick={() => handleDelete(booking.name)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full"
                >
                  Delete Booking
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingList;

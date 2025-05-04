import React, { useEffect, useState } from "react";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/user-bookings/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBookings(data.bookings);
        }
      })
      .catch(() => setError("Failed to fetch bookings."))
      .finally(() => setLoading(false));
  }, [userId]);

  // Delete booking by name
  const handleDelete = async (name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete bookings for "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:5000/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.name !== name));
      } else {
        setError(result.message || "Failed to delete booking.");
      }
    } catch {
      setError("Error deleting booking.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-yellow-500 mb-6">
          My Bookings
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-400">No bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking._id} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-lg font-medium">{booking.service}</p>
                <p className="text-gray-400">
                  {new Date(booking.date).toDateString()} at {booking.time}
                </p>
                <button
                  onClick={() => handleDelete(booking.name)}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Cancel Booking
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserBookings;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean; // Added role to the interface
}

interface Booking {
  _id: string;
  userId: string;
  name: string;
  email: string;
  carType: string;
  service: string;
  price: number;
  date: string;
  time?: string;
  status?: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin');
          return;
        }

        // Fetch all users and filter out admin users
        const usersResponse = await axios.get('http://localhost:5000/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter out admin users (assuming admin has role: 'admin')
        const regularUsers = usersResponse.data.filter((user: User) => user.isAdmin === false);
        setUsers(regularUsers);

        // Fetch all bookings
        const bookingsResponse = await axios.get('http://localhost:5000/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAllBookings(bookingsResponse.data);
        setFilteredBookings(bookingsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleViewUserBookings = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedUserId === userId) {
        // If clicking the same user, reset to show all bookings
        const bookingsResponse = await axios.get('http://localhost:5000/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedUserId(null);
        setSelectedUserName('');
        setAllBookings(bookingsResponse.data);
        setFilteredBookings(bookingsResponse.data);
        setDateFilter('');
        setMonthFilter('');
      } else {
        // Fetch bookings for the specific user
        const response = await axios.get(`http://localhost:5000/admin/user/${userId}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = users.find(u => u._id === userId);
        setSelectedUserId(userId);
        setSelectedUserName(user?.name || '');
        setAllBookings(response.data);
        setFilteredBookings(response.data);
        setDateFilter('');
        setMonthFilter('');
      }
    } catch (err) {
      setError('Failed to fetch user bookings');
    }
  };

  const handleResetFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const bookingsResponse = await axios.get('http://localhost:5000/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedUserId(null);
      setSelectedUserName('');
      setAllBookings(bookingsResponse.data);
      setFilteredBookings(bookingsResponse.data);
      setDateFilter('');
      setMonthFilter('');
    } catch (err) {
      setError('Failed to reset filters');
    }
  };

  useEffect(() => {
    // Apply date/month filters to the current bookings (all or user-specific)
    let filtered = [...allBookings];

    if (dateFilter) {
      filtered = filtered.filter(booking => 
        new Date(booking.date).toISOString().split('T')[0] === dateFilter
      );
    }

    if (monthFilter) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        const bookingMonth = bookingDate.getMonth() + 1;
        const bookingYear = bookingDate.getFullYear();
        return `${bookingYear}-${bookingMonth.toString().padStart(2, '0')}` === monthFilter;
      });
    }

    setFilteredBookings(filtered);
  }, [allBookings, dateFilter, monthFilter]);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/admin/bookings/${bookingId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the bookings
      const updatedBookings = allBookings.map(b => 
        b._id === bookingId ? { ...b, status } : b
      );
      
      setAllBookings(updatedBookings);
      setFilteredBookings(updatedBookings.filter(booking => {
        // Maintain current filters
        if (dateFilter && new Date(booking.date).toISOString().split('T')[0] !== dateFilter) return false;
        if (monthFilter) {
          const bookingDate = new Date(booking.date);
          const bookingMonth = bookingDate.getMonth() + 1;
          const bookingYear = bookingDate.getFullYear();
          if (`${bookingYear}-${bookingMonth.toString().padStart(2, '0')}` !== monthFilter) return false;
        }
        return true;
      }));
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update both allBookings and filteredBookings
      const updatedAllBookings = allBookings.filter(b => b._id !== bookingId);
      const updatedFilteredBookings = filteredBookings.filter(b => b._id !== bookingId);
      
      setAllBookings(updatedAllBookings);
      setFilteredBookings(updatedFilteredBookings);
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div 
                  key={user._id} 
                  className={`p-3 rounded cursor-pointer ${selectedUserId === user._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleViewUserBookings(user._id)}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Panel */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedUserId 
                  ? `Bookings for ${selectedUserName}` 
                  : 'All Bookings'}
              </h2>
              
              {(selectedUserId || dateFilter || monthFilter) && (
                <button 
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Filter Controls */}
            {!selectedUserId && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setMonthFilter('');
                    }}
                    className="text-sm border rounded p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
                  <input
                    type="month"
                    value={monthFilter}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                      setDateFilter('');
                    }}
                    className="text-sm border rounded p-2"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredBookings.length === 0 ? (
                <p className="text-gray-500">No bookings found</p>
              ) : (
                filteredBookings.map(booking => (
                  <div key={booking._id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{booking.service} - {booking.carType}</p>
                        <p className="text-sm text-gray-600">₹{booking.price}</p>
                        <p className="text-sm">
                          {new Date(booking.date).toLocaleDateString()} {booking.time && `• ${booking.time}`}
                        </p>
                        {!selectedUserId && (
                          <p className="text-sm">By: {booking.name} ({booking.email})</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <select
                          value={booking.status || 'Pending'}
                          onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                          className="text-sm border rounded p-1 h-fit"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-500 hover:text-red-700 text-sm h-fit"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
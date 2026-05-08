// =========================
// React Frontend (CRUD for Booking + Customer)
// =========================
// Assumptions:
// Booking API: http://localhost:8089/booking
// Customer API: http://localhost:8098/customer

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          ✈️ Flight Booking System
        </h1>
        <div className="space-y-8">
          <Customer />
          <Booking />
        </div>
      </div>
    </div>
  );
}

// ================= CUSTOMER COMPONENT =================
function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    custid: "",
    cname: "",
    caddress: "",
    ccity: "",
  });

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:8089/customer/all");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (form.custid) {
        await axios.put(`http://localhost:8089/customer/update/${form.custid}`, form);
      } else {
        await axios.post("http://localhost:8089/customer/insert", form);
      }
      setForm({ custid: "", cname: "", caddress: "", ccity: "" });
      fetchCustomers();
    } catch (error) {
      console.error("Error submitting customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8089/customer/delete/${id}`);
    fetchCustomers();
  };

  const handleEdit = (cust) => {
    setForm(cust);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <span className="mr-2">👥</span> Customer Management
      </h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="cname"
            placeholder="Customer Name"
            value={form.cname}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            name="caddress"
            placeholder="Address"
            value={form.caddress}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <input
            name="ccity"
            placeholder="City"
            value={form.ccity}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg button-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="loading w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : null}
            {form.custid ? "✏️ Update Customer" : "➕ Add Customer"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((c, index) => (
              <tr key={c.custid} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} table-row`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.custid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.cname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.caddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.ccity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200 font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.custid)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200 font-medium"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= BOOKING COMPONENT =================
function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    booking_id: "",
    flightname: "",
    customer_id: "",
  });

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:8098/booking/allBooking");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (form.booking_id) {
        await axios.put(`http://localhost:8098/booking/update/${form.booking_id}`, form);
      } else {
        await axios.post("http://localhost:8098/booking/insertWithCustId", form);
      }
      setForm({ booking_id: "", flightname: "", customer_id: "" });
      fetchBookings();
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8098/booking/delete/${id}`);
    fetchBookings();
  };

  const handleEdit = (b) => {
    setForm(b);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <span className="mr-2">🎫</span> Booking Management
      </h2>

      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="flightname"
            placeholder="Flight Name"
            value={form.flightname}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <input
            name="customer_id"
            placeholder="Customer ID"
            value={form.customer_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg button-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="loading w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : null}
            {form.booking_id ? "✏️ Update Booking" : "➕ Add Booking"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Flight Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((b, index) => (
              <tr key={b.booking_id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} table-row`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.booking_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.flightname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.customer_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200 font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.booking_id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200 font-medium"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

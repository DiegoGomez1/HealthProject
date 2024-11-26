import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    // Get user data from token (you can decode JWT or make an API call)
    // For now, we'll just get the email from localStorage if you stored it
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUserData({ email: userEmail });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Your Profile
              </h2>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Statistics Cards */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700">
                  Total Logins
                </h3>
                <p className="text-2xl font-bold text-blue-900">1</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">
                  Days Active
                </h3>
                <p className="text-2xl font-bold text-green-900">1</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700">
                  Last Login
                </h3>
                <p className="text-2xl font-bold text-purple-900">Today</p>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Activity
              </h2>
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <p className="text-gray-600">Logged in successfully</p>
                  <p className="text-sm text-gray-400">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

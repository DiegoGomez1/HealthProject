import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClinicMap from "./ClinicMap";

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

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUserData({ email: userEmail });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Your Profile
              </h2>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Medical Facilities Near You
            </h2>
            <div className="bg-gray-50 rounded-lg">
              <ClinicMap />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-700">
                Major Hospitals
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Access to UF Health Shands and North Florida Regional Medical
                Center
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-700">
                Urgent Care Centers
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Multiple locations for immediate care needs
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-700">
                Specialized Clinics
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Various specialized medical services available
              </p>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Healthcare Resources
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800">
                  Emergency Services
                </h3>
                <p className="text-gray-600">
                  Call 911 for medical emergencies
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800">
                  UF Health Direct
                </h3>
                <p className="text-gray-600">
                  24/7 access to healthcare providers
                </p>
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-gray-800">
                  Telehealth Options
                </h3>
                <p className="text-gray-600">
                  Virtual appointments available at most facilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

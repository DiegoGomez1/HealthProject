import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClinicMap from "./ClinicMap";
// Dashboard.js
import { authAPI, clinicsAPI } from "../services/api";

// Rest of your Dashboard component code...

function Dashboard() {
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userProfile = await authAPI.getProfile();
        setUserData(userProfile);

        // Fetch clinics
        const clinicsData = await clinicsAPI.getClinics();
        setClinics(clinicsData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("token")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {userData.firstName || "User"}
            </h1>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Your Profile
              </h2>
              <p className="text-gray-600">Email: {userData.email}</p>
              {userData.firstName && (
                <p className="text-gray-600">
                  Name: {userData.firstName} {userData.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Medical Facilities Near You
            </h2>
            <div className="bg-gray-50 rounded-lg">
              <ClinicMap clinics={clinics} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-700">
                Available Clinics
              </h3>
              <p className="text-2xl font-bold text-blue-900">
                {clinics.length}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-700">
                Emergency Rooms
              </h3>
              <p className="text-2xl font-bold text-green-900">2</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-700">
                Urgent Care
              </h3>
              <p className="text-2xl font-bold text-purple-900">3</p>
            </div>
          </div>

          {/* List of Clinics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Nearby Clinics
            </h2>
            <div className="space-y-4">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="border-b pb-4">
                  <h3 className="font-semibold text-gray-800">{clinic.name}</h3>
                  <p className="text-gray-600">{clinic.address}</p>
                  {clinic.phone && (
                    <p className="text-gray-600">Phone: {clinic.phone}</p>
                  )}
                  {clinic.type && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-2">
                      {clinic.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Welcome
        </h1>
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

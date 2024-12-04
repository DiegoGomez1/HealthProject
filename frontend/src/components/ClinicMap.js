import React, { useEffect, useRef } from "react";

const ClinicMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Gainesville clinic data
    const clinics = [
      {
        id: 1,
        name: "UF Health Family Medicine - Main",
        lat: 29.6399,
        lng: -82.3447,
        address: "1707 N Main St, Gainesville, FL 32609",
      },
      {
        id: 2,
        name: "CareSpot Urgent Care - Gainesville",
        lat: 29.6272,
        lng: -82.3758,
        address: "3581 SW Archer Rd, Gainesville, FL 32608",
      },
      {
        id: 3,
        name: "UF Health Shands Hospital",
        lat: 29.6392,
        lng: -82.3438,
        address: "1600 SW Archer Rd, Gainesville, FL 32610",
      },
      {
        id: 4,
        name: "North Florida Regional Medical Center",
        lat: 29.6651,
        lng: -82.375,
        address: "6500 W Newberry Rd, Gainesville, FL 32605",
      },
      {
        id: 5,
        name: "Gainesville VA Medical Center",
        lat: 29.6451,
        lng: -82.3684,
        address: "1601 SW Archer Rd, Gainesville, FL 32608",
      },
    ];

    if (!window.L) {
      console.error("Leaflet is not loaded");
      return;
    }

    // Initialize map if it hasn't been initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [29.6516, -82.3248],
        12
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each clinic
    clinics.forEach((clinic) => {
      const marker = window.L.marker([clinic.lat, clinic.lng]).bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-lg">${clinic.name}</h3>
            <p class="text-gray-600">${clinic.address}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              clinic.address
            )}" 
               class="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
               target="_blank"
               rel="noopener noreferrer">
              Get Directions
            </a>
          </div>
        `);

      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg relative">
      <div ref={mapRef} className="h-full w-full"></div>
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[1000]">
        <h3 className="font-semibold text-gray-700">
          Gainesville Medical Facilities
        </h3>
        <p className="text-sm text-gray-500">
          Click markers for more information
        </p>
      </div>
    </div>
  );
};

export default ClinicMap;

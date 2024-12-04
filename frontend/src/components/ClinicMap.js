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
      {
        id: 6,
        name: "UF Health Pediatrics - Gainesville",
        lat: 29.6394,
        lng: -82.3741,
        address: "1699 SW 16th Ave, Gainesville, FL 32608",
      },
    ];

    // Only initialize the map if it hasn't been initialized yet
    if (!mapInstanceRef.current && window.L) {
      // Initialize the map centered on Gainesville
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [29.6516, -82.3248],
        12
      );

      // Add the OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Create a custom marker icon
      const clinicIcon = window.L.divIcon({
        html: '<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">+</div>',
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      // Add markers for each clinic
      clinics.forEach((clinic) => {
        const marker = window.L.marker([clinic.lat, clinic.lng], {
          icon: clinicIcon,
        }).bindPopup(`
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

      // Add a "Gainesville" label
      const cityLabel = window.L.divIcon({
        html: '<div class="px-3 py-1 bg-white rounded-full shadow-md text-gray-700 font-semibold">Gainesville</div>',
        className: "city-label",
        iconSize: [100, 30],
        iconAnchor: [50, 15],
      });

      window.L.marker([29.6516, -82.3248], { icon: cityLabel }).addTo(
        mapInstanceRef.current
      );
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => {
          marker.remove();
        });
        markersRef.current = [];
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg relative">
      <div ref={mapRef} className="h-full w-full"></div>
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[1000]">
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

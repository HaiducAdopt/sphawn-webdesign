"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/* =====================================================
   Dynamic import pentru hartă (evită probleme SSR)
===================================================== */
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

export default function GpsLab() {
  /* =====================================================
     STATE MANAGEMENT
  ===================================================== */

  // Indică dacă tracking-ul este activ
  const [isTracking, setIsTracking] = useState(false);

  // Poziția curentă (lat, lng)
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Lista tuturor punctelor parcurse (pentru polyline)
  const [route, setRoute] = useState<[number, number][]>([]);

  // Momentul de start (pentru timer)
  const [startTime, setStartTime] = useState<number | null>(null);

  // Timpul scurs în milisecunde
  const [elapsed, setElapsed] = useState(0);

  // ID-ul watcher-ului GPS (ca să îl putem opri)
  const watchIdRef = useRef<number | null>(null);

  /* =====================================================
     DETECTARE POZIȚIE LA ÎNCĂRCARE PAGINĂ
     (nu pornește tracking, doar centrează harta)
  ===================================================== */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
      },
      (err) => {
        console.error("Initial location error:", err);
      }
    );
  }, []);

  /* =====================================================
     START TRACKING
     - Resetează datele
     - Pornește watchPosition
     - Salvează fiecare punct
  ===================================================== */
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    // Reset date
    setRoute([]);
    setElapsed(0);
    setStartTime(Date.now());

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Actualizează poziția curentă
        setPosition([lat, lng]);

        // Adaugă punct nou în traseu
        setRoute((prev) => [...prev, [lat, lng]]);
      },
      (err) => {
        console.error("Tracking error:", err);
        alert("Location error: " + err.message);
      },
      { enableHighAccuracy: true }
    );

    setIsTracking(true);
  };

  /* =====================================================
     STOP TRACKING
     - Oprește watchPosition
  ===================================================== */
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  /* =====================================================
     TIMER (actualizat la fiecare secundă)
  ===================================================== */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  /* =====================================================
     CALCUL DISTANȚĂ (formula Haversine)
  ===================================================== */
  function calculateDistance(route: [number, number][]) {
    let total = 0;

    for (let i = 1; i < route.length; i++) {
      const [lat1, lon1] = route[i - 1];
      const [lat2, lon2] = route[i];

      const R = 6371e3;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) *
          Math.cos(φ2) *
          Math.sin(Δλ / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      total += R * c;
    }

    return total;
  }

  const distanceKm = (calculateDistance(route) / 1000).toFixed(2);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  /* =====================================================
     RESET COMPLET
  ===================================================== */
  const resetAll = () => {
    stopTracking();
    setRoute([]);
    setElapsed(0);
    setStartTime(null);
  };

  /* =====================================================
     RECENTER MANUAL
  ===================================================== */
  const recenter = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="flex flex-col items-center pt-24 px-6 pb-6 gap-4">
      <h1 className="text-2xl font-bold">GPS Lab</h1>

      {!position && (
        <p className="text-gray-500">Detecting your location...</p>
      )}

      {/* STATS */}
      <div className="flex gap-6 text-lg font-medium">
        <p>Distance: {distanceKm} km</p>
        <p>
          Time: {minutes}m {seconds}s
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 flex-wrap">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}

        <button
          onClick={resetAll}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={recenter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Recenter
        </button>
      </div>

      {/* MAP */}
      <div className="w-full h-[500px]">
        <MapComponent position={position} route={route} />
      </div>
    </div>
  );
}
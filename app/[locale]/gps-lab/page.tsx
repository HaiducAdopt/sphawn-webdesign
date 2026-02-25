"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

export default function GpsLab() {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setRoute((prev) => [...prev, [lat, lng]]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">GPS Lab</h1>

      <div className="flex gap-4">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}
      </div>

      <div className="w-full h-[500px]">
        <MapComponent position={position} route={route} />
      </div>
    </div>
  );
}
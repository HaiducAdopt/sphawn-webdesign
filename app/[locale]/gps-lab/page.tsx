"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

/* =====================================================
   Dynamic import pentru hartă (evită SSR issues)
===================================================== */
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

/* =====================================================
   Cheia din localStorage unde ținem "draft-ul"
===================================================== */
const DRAFT_KEY = "gpsLabDraft_v1";

/* =====================================================
   Tipul pentru draft-ul salvat local
===================================================== */
type Draft = {
  version: 1;
  isTracking: boolean;
  position: [number, number] | null;
  route: [number, number][];
  startTime: number | null;
  elapsed: number;
  updatedAt: number;
};

/* =====================================================
   Helper: citim draft din localStorage (safe)
   - definit OUTSIDE component ca să fie "pur" pentru ESLint
===================================================== */
function readDraftFromStorage(): Draft | null {
  try {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || parsed.version !== 1) return null;
    if (!Array.isArray(parsed.route)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export default function GpsLab() {
  /* =====================================================
     STATE: draftData se inițializează direct din localStorage
     (fără useEffect, fără setState în effect)
  ===================================================== */
  const [draftData, setDraftData] = useState<Draft | null>(() =>
    readDraftFromStorage()
  );

  /* =====================================================
     STATE: tracking + date (ce se vede pe ecran)
  ===================================================== */
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  /* =====================================================
     Ref pentru geolocation watcher
  ===================================================== */
  const watchIdRef = useRef<number | null>(null);

  /* =====================================================
     Helper: salvăm draft în localStorage (safe)
===================================================== */
  const saveDraft = (data: Omit<Draft, "version" | "updatedAt">) => {
    const draft: Draft = {
      version: 1,
      updatedAt: Date.now(),
      ...data,
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn("Could not save draft to localStorage:", e);
    }
  };

  /* =====================================================
     Helper: ștergem draft
===================================================== */
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setDraftData(null);
  };

  /* =====================================================
     Dacă NU există draft, facem o localizare inițială (centrare)
     NOTĂ: aici setState e într-un callback async => OK pentru regula ESLint
===================================================== */
  useEffect(() => {
    if (draftData) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Initial location error:", err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [draftData]);

  /* =====================================================
     DISTANȚĂ: Haversine (metri)
===================================================== */
  function calculateDistanceMeters(points: [number, number][]) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const [lat1, lon1] = points[i - 1];
      const [lat2, lon2] = points[i];

      const R = 6371e3;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return total;
  }

  const distanceKm = useMemo(() => {
    return (calculateDistanceMeters(route) / 1000).toFixed(2);
  }, [route]);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  /* =====================================================
     Geolocation watcher:
===================================================== */
  const startGeolocationWatcher = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setRoute((prev) => [...prev, [lat, lng]]);
      },
      (err) => {
        console.error("Tracking error:", err);
        alert("Location error: " + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  /* =====================================================
     START / STOP / RESET / RECENTER
===================================================== */
  const startTracking = () => {
    setDraftData(null); // începem o sesiune nouă
    setRoute([]);
    setElapsed(0);

    setStartTime(() => Date.now());
    setIsTracking(true);

    startGeolocationWatcher();
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const resetAll = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);
    setRoute([]);
    setElapsed(0);
    setStartTime(null);

    clearDraft();
  };

  const recenter = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Recenter error:", err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* =====================================================
     RESUME / DISCARD draft
===================================================== */
  const resumeDraft = () => {
    if (!draftData) return;

    setIsTracking(draftData.isTracking);
    setPosition(draftData.position);
    setRoute(draftData.route);
    setElapsed(draftData.elapsed);

    setStartTime(() => {
      if (!draftData.elapsed) return null;
      return Date.now() - draftData.elapsed;
    });

    setDraftData(null);

    if (draftData.isTracking) {
      startGeolocationWatcher();
    }
  };

  const discardDraft = () => {
    clearDraft();
    resetAll();
  };

  /* =====================================================
     TIMER
===================================================== */
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  /* =====================================================
     AUTOSAVE:
     - dacă există draftData, nu suprascriem până nu alegi.
     - altfel salvăm state-ul curent
===================================================== */
  useEffect(() => {
    if (draftData) return;

    saveDraft({
      isTracking,
      position,
      route,
      startTime,
      elapsed,
    });
  }, [isTracking, position, route, startTime, elapsed, draftData]);

  /* =====================================================
     UI: Draft found
===================================================== */
  if (draftData) {
    const draftKm =
      draftData.route.length > 1
        ? (calculateDistanceMeters(draftData.route) / 1000).toFixed(2)
        : "0.00";

    const dMin = Math.floor(draftData.elapsed / 60000);
    const dSec = Math.floor((draftData.elapsed % 60000) / 1000);

    return (
      <div className="flex flex-col items-center pt-24 px-6 pb-6 gap-4">
        <h1 className="text-2xl font-bold">GPS Lab</h1>

        <div className="w-full max-w-xl rounded-xl border bg-white p-5 shadow-sm">
          <p className="font-semibold mb-2">Draft found</p>
          <p className="text-gray-600">
            You have an unfinished walk saved on this device.
          </p>

          <div className="mt-3 text-sm text-gray-700">
            <p>
              Saved distance: <span className="font-medium">{draftKm} km</span>
            </p>
            <p>
              Saved time:{" "}
              <span className="font-medium">
                {dMin}m {dSec}s
              </span>
            </p>
            <p className="text-gray-500 mt-1">
              (Stored locally in your phone browser.)
            </p>
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <button
              onClick={resumeDraft}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Resume
            </button>
            <button
              onClick={discardDraft}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI normal
===================================================== */
  return (
    <div className="flex flex-col items-center pt-24 px-6 pb-6 gap-4">
      <h1 className="text-2xl font-bold">GPS Lab</h1>

      {!position && (
        <p className="text-gray-500">Detecting your location...</p>
      )}

      <div className="flex gap-6 text-lg font-medium flex-wrap justify-center">
        <p>Distance: {distanceKm} km</p>
        <p>
          Time: {minutes}m {seconds}s
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
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

      <div className="w-full h-[500px]">
        <MapComponent position={position} route={route} />
      </div>
    </div>
  );
}
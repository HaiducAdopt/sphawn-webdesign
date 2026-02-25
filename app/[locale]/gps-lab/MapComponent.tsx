"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  position: [number, number] | null;
  route: [number, number][];
};

export default function MapComponent({ position, route }: Props) {
  return (
    <MapContainer
      center={position || [52.1, 5.1]}
      zoom={13}
      scrollWheelZoom
      className="w-full h-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {position && <Marker position={position} />}
      {route.length > 1 && <Polyline positions={route} pathOptions={{ color: "blue" }} />}
    </MapContainer>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const LeafletMap = dynamic(
  async () => {
    const {
      MapContainer,
      TileLayer,
      Marker,
      Polyline,
      useMap,
    } = await import("react-leaflet");
    const L = await import("leaflet");

    const DefaultIcon = L.icon({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    function FollowUser({ position }: { position: [number, number] }) {
      const map = useMap();

      useEffect(() => {
        map.setView(position, 16);
      }, [position, map]);

      return null;
    }

    return function MapComponentInner({
      position,
      route,
    }: {
      position: [number, number] | null;
      route: [number, number][];
    }) {
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
          {position && <FollowUser position={position} />}

          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "blue", weight: 4 }}
            />
          )}
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function MapComponent({
  position,
  route,
}: {
  position: [number, number] | null;
  route: [number, number][];
}) {
  return <LeafletMap position={position} route={route} />;
}
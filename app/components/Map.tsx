"use client";

import { useEffect, useRef } from "react";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[]; // [lat, lng]
}

const Map: React.FC<MapProps> = ({ center }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const position: LatLngExpression = (center ?? [
      51, -0.09,
    ]) as LatLngExpression;

    //  Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: position,
        zoom: center ? 4 : 2,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    } else {
      //  If map already exists, just move it
      mapRef.current.setView(position, center ? 4 : 2);
    }

    //  Update marker based on center
    // Remove old markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new marker if center is provided
    if (center) {
      L.marker(position).addTo(mapRef.current);
    }

    // Cleanup on unmount (handles React strict mode double mount)
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center]);

  return <div ref={mapContainerRef} className="h-[35vh] w-full rounded-lg" />;
};

export default Map;

"use client";

import { useEffect, useRef } from "react";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error Leaflet's default icon path is not included in its TypeScript declarations.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

export interface MapMarker {
  id: string;
  position: number[];
  listings: { id: string; title: string; price: number }[];
}

interface MapProps {
  center?: number[];
  markers?: MapMarker[];
  containerClassName?: string;
}

const Map: React.FC<MapProps> = ({
  center,
  markers = [],
  containerClassName = "h-[65vh] w-full rounded-lg",
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);
    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markersLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    for (const marker of markers) {
      const popup = document.createElement("div");
      popup.className = "flex min-w-40 flex-col gap-2";
      for (const listing of marker.listings) {
        const link = document.createElement("a");
        link.href = `/listings/${encodeURIComponent(listing.id)}`;
        link.className = "font-medium hover:underline";
        link.textContent = `${listing.title} · $${listing.price}/night`;
        popup.appendChild(link);
      }
      L.marker(marker.position as LatLngExpression).bindPopup(popup).addTo(markerLayer);
    }

    if (markers.length) {
      const bounds = L.latLngBounds(markers.map((marker) => marker.position as LatLngExpression));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 5 });
    } else if (center) {
      map.setView(center as LatLngExpression, 4);
    } else {
      map.setView([20, 0], 2);
    }
  }, [center, markers]);

  return <div ref={mapContainerRef} className={containerClassName} />;
};

export default Map;

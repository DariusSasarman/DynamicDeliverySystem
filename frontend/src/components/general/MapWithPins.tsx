import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// default marker fix for bundlers
const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function ChangeMapView({ position, zoom = 13 }: { position: any; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom);
    }
  }, [position, map, zoom]);
  return null;
}

type MapWithPinsProps = {
  fetchItems: () => Promise<any[]>;
  posAccessor?: (item: any) => [number, number];
  buttonLabel?: (item: any) => string;
  title?: string;
  initialZoom?: number;
  minMapWidth?: number;
};

export default function MapWithPins({
  fetchItems,
  posAccessor = (i) => i.pos,
  buttonLabel = (i) => i.id || i.email || "Item",
  title = "",
  initialZoom = 13,
  minMapWidth = 640,
}: MapWithPinsProps) {
  const [items, setItems] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = (await fetchItems()) || [];
        if (!mounted) return;
        setItems(list);
        if (list.length > 0) setActive(list[0]);
      } catch (err) {
        console.error("MapWithPins fetch failed", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetchItems]);

  const center = active ? posAccessor(active) : undefined;

  return (
    <div className="active-card map-layout" style={{ width: "100%" }}>
      <div className="map-container" style={{ minWidth: minMapWidth }}>
        {center ? (
          <MapContainer center={center} zoom={initialZoom} scrollWheelZoom={false} className="map-container" style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeMapView position={center} zoom={initialZoom} />
            {items.map((it, idx) => {
              const pos = posAccessor(it);
              return (
                <Marker key={idx} position={pos}>
                  <Popup>{buttonLabel(it)}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      <div className="map-side">
        {title && <h3>{title}</h3>}
        {items.map((it, idx) => (
          <button key={idx} onClick={() => setActive(it)} style={{ display: "block", width: "100%", marginBottom: "10px" }}>
            {buttonLabel(it)}
          </button>
        ))}
      </div>
    </div>
  );
}

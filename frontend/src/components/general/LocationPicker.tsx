import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type Position = [number, number];

type LocationPickerProps = {
  value?: Position | null;
  onChange: (position: Position) => void;
  height?: string;
  label?: string;
  helperText?: string;
  defaultPosition?: Position;
};

function PickerMap({ value, onChange, defaultPosition }: { value?: Position | null; onChange: (position: Position) => void; defaultPosition: Position }) {
  const map = useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  useEffect(() => {
    if (value) {
      map.flyTo(value, 13);
    }
  }, [map, value]);

  return value ? <Marker position={value} /> : null;
}

export default function LocationPicker({
  value,
  onChange,
  height = "180px",
  label,
  helperText,
  defaultPosition = [46.770439, 23.589722],
}: LocationPickerProps) {
  const currentPosition = value ?? defaultPosition;

  return (
    <div>
      {label ? <label style={{ display: "block", marginBottom: "4px", fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase" }}>{label}</label> : null}
      {helperText ? <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{helperText}</div> : null}
      <div
        style={{
          height,
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #d6d6d6",
        }}
      >
        <MapContainer center={currentPosition} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <PickerMap value={value ?? null} onChange={onChange} defaultPosition={defaultPosition} />
        </MapContainer>
      </div>
      {value ? (
        <div style={{ marginTop: "6px", fontSize: "12px", color: "#666" }}>
          Selected point: {value[0].toFixed(4)}, {value[1].toFixed(4)}
        </div>
      ) : (
        <div style={{ marginTop: "6px", fontSize: "12px", color: "#888" }}>No point selected yet.</div>
      )}
    </div>
  );
}

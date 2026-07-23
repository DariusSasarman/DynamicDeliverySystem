import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { getAssignedCouriers } from "../../../utils/ClientRequests/ManagerApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

// Fix Leaflet's default marker icons breaking under bundlers (Vite/Webpack)
const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function ChangeMapView({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return null;
}

function CouriersCurrentPosition() {
  const [courierList, setCourierList] = useState([]);
  const [activeCourier, setActiveCourier] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourierList = async () => {
      try {
        const list = await getAssignedCouriers(getStoredEmail());
        if (!isMounted) return;

        setCourierList(list);
        if (list.length > 0) {
          setActiveCourier(list[0]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch courier list", error);
        alert("Couldn't load courier positions.");
      }
    };

    fetchCourierList();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "150px",
        gap: "20px",
        width: "100%",
      }}
    >
      {/* Map */}
      <div>
        {activeCourier ? (
          <MapContainer
            center={activeCourier.pos}
            zoom={13}
            scrollWheelZoom={false}
            style={{
              height: "500px",
              width: "1000px",
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ChangeMapView position={activeCourier.pos} />

            {courierList.map((courier) => (
              <Marker key={courier.email} position={courier.pos}>
                <Popup>{courier.email}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      {/* Courier List */}
      <div
        style={{
          width: "250px",
          height: "500px",
          overflowY: "auto",
          overflowX: "hidden",
          border: "2px solid #ccc",
          padding: "10px",
          background: "#f9f9f9",
        }}
      >
        <h3>Couriers</h3>

        {courierList.map((courier) => (
          <button
            key={courier.email}
            onClick={() => setActiveCourier(courier)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              marginLeft: 0,
            }}
          >
            {courier.email}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CouriersCurrentPosition;
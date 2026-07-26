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
import { getPackageClientList } from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

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

function PackagesStatus() {
  const [packageList, setPackageList] = useState([]);
  const [activePackage, setActivePackage] = useState(null);

  useEffect(() => {
    const fetchPackageList = async () => {
      try {
        const list = await getPackageClientList(getStoredEmail());
        setPackageList(list);
        if (list.length > 0) setActivePackage(list[0]);
      } catch (error) {
        console.error("Failed to fetch package list", error);
      }
    };
    fetchPackageList();
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
        {activePackage ? (
          <MapContainer
            center={activePackage.pos}
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

            <ChangeMapView position={activePackage.pos} />

            <Marker position={activePackage.pos}>
              <Popup>Package #{activePackage.id}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div>Loading map...</div>
        )}
      </div>

      {/* Package List */}
      <div
        style={{
          width: "250px",
          height: "500px",
          overflowY: "auto",
          overflowX: "clip",
          border: "2px solid #ccc",
          padding: "10px",
          background: "#f9f9f9",
        }}
      >
        <h3>Last known location:</h3>

        {packageList.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setActivePackage(pkg)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              marginLeft: "0",
            }}
          >
            Package #{pkg.id}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PackagesStatus;
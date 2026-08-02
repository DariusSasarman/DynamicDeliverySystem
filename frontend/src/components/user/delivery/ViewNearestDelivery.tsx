import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import { getNearestPackage } from "../../../utils/ClientRequests/DeliveryApiCalls";

function FitBounds({ currentPosition, packagePosition }) {
  const map = useMap();

  useEffect(() => {
    if (!currentPosition || !packagePosition) return;

    map.fitBounds([currentPosition, packagePosition], {
      padding: [50, 50],
      animate: true,
      maxZoom: 16,
    });
  }, [map, currentPosition, packagePosition]);

  return null;
}

function ViewNearestDelivery() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [nearestPackage, setNearestPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try{
      navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentPos = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setCurrentPosition(currentPos);

        try {
          const nearest = await getNearestPackage(currentPos, getStoredAuthToken());

          setNearestPackage(nearest);
        } catch (err) {
          console.error(err);
        }

        setLoading(false);
      },
      (err) => {
        console.error("Couldn't obtain location:", err);
        setLoading(false);
      },
    );
    }
    catch(error){
      alert("Couldn't obtain location: " + error);
    }
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (!currentPosition || !nearestPackage) {
    return <div>No nearby package found.</div>;
  }

  return (
    <div style={{ marginTop: 0 }}>
      <MapContainer
        center={currentPosition}
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

        <FitBounds
          currentPosition={currentPosition}
          packagePosition={nearestPackage.pos}
        />

        <Marker position={currentPosition}>
          <Popup>Your current location</Popup>
        </Marker>

        <Marker position={nearestPackage.pos}>
          <Popup>Package #{nearestPackage.id}</Popup>
        </Marker>
      </MapContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            width: "60vw",
          }}
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&origin=${currentPosition[0]},${currentPosition[1]}&destination=${nearestPackage.pos[0]},${nearestPackage.pos[1]}&travelmode=driving`,
              "_blank",
            )
          }
        >
          Open route in Google Maps
        </button>
      </div>
    </div>
  );
}

export default ViewNearestDelivery;

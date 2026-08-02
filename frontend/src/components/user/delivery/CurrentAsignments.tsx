import React, { useEffect, useState } from "react";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import {
  getAssignedPackageList,
  getPackageDetails,
} from "../../../utils/ClientRequests/DeliveryApiCalls";

type PackageItem = {
  id: number;
  pos?: number[];
};

type PackageDetails = {
  type: string;
  phoneNumber: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  availableFrom: string;
  availableUntil: string;
};

function CurrentAssignments() {
  const [packageList, setPackageList] = useState<PackageItem[]>([]);
  const [detailsCache, setDetailsCache] = useState<Record<number, PackageDetails>>({});

  useEffect(() => {
    async function loadPackages() {
      try {
        const list = await getAssignedPackageList(getStoredAuthToken());
        setPackageList(list);
      } catch (error) {
        alert("Couldn't load assigned packages!");
      }
    }

    loadPackages();
  }, []);

  async function handleOpen(packageId: number) {
    if (detailsCache[packageId]) return;
    try {
      const details = await getPackageDetails(getStoredAuthToken(), packageId);

      setDetailsCache((prev) => ({
        ...prev,
        [packageId]: details,
      }));
    } catch (error) {
      alert("Couldn't get package details.");
    }
  }

  return (
    <div className="active-card" style={{ width: "60vw", margin: "30px auto", display: "flex", flexDirection: "column", gap: "16px", color: "#222f68" }}>
      <h1 style={{ marginBottom: "10px" }}>Current Assignments</h1>

      {packageList.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >
          No packages assigned.
        </div>
      ) : (
        packageList.map((pkg) => (
          <details
            key={pkg.id}
            onToggle={(e: React.SyntheticEvent<HTMLDetailsElement>) => {
              if (e.currentTarget.open) {
                handleOpen(pkg.id);
              }
            }}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                padding: "18px 24px",
                fontSize: "20px",
                fontWeight: "bold",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
              }}
            >
              <span>📦 Package #{pkg.id}</span>
              <span style={{ fontSize: "14px", color: "#666" }}>
                Click to view
              </span>
            </summary>

            <div
              style={{
                borderTop: "1px solid #eee",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                rowGap: "18px",
                columnGap: "20px",
                fontSize: "17px",
              }}
            >
              {detailsCache[pkg.id] ? (
                <>
                  <strong>📥 Type </strong>
                  <span>{detailsCache[pkg.id].type}</span>

                  <strong>📞 Phone</strong>
                  <span>{detailsCache[pkg.id].phoneNumber}</span>

                  <strong>📍 Coordinates</strong>
                  <span>
                    {detailsCache[pkg.id].coordinates
                      ? `${detailsCache[pkg.id].coordinates?.latitude}, ${detailsCache[pkg.id].coordinates?.longitude}`
                      : "Not available"}
                  </span>

                  <strong>🕒 Available</strong>
                  <span>
                    {detailsCache[pkg.id].availableFrom} -{" "}
                    {detailsCache[pkg.id].availableUntil}
                  </span>
                </>
              ) : (
                <div
                  style={{
                    gridColumn: "1 / span 2",
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  Loading package information...
                </div>
              )}
            </div>
          </details>
        ))
      )}
    </div>
  );
}

export default CurrentAssignments;

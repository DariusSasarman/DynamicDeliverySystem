import React, { useEffect, useState } from "react";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import {
  confirmDeposit,
  confirmPickup,
  getDeliveryCode,
  getDropoffAssignments,
  getPackageDetails,
  getPickupAssignments,
} from "../../../utils/ClientRequests/DeliveryApiCalls";

type Assignment = {
  id: number;
  status: string;
  assignmentType: string;
};

type PackageDetails = {
  type: string;
  status: string;
  phoneNumber: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  availableFrom: string;
  availableUntil: string;
};

type DeliveryAssignmentListProps = {
  mode: "pickup" | "dropoff";
  title: string;
  emptyMessage: string;
};

function DeliveryAssignmentList({
  mode,
  title,
  emptyMessage,
}: DeliveryAssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [detailsCache, setDetailsCache] = useState<Record<number, PackageDetails>>({});
  const [deliveryCodes, setDeliveryCodes] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadAssignments() {
      try {
        const list =
          mode === "pickup"
            ? await getPickupAssignments(getStoredAuthToken())
            : await getDropoffAssignments(getStoredAuthToken());
        setAssignments(list);
      } catch (error) {
        alert(
          `Couldn't load ${mode} assignments: ` +
            (error instanceof Error ? error.message : error)
        );
      }
    }

    loadAssignments();
  }, [mode]);

  async function handleOpen(packageId: number) {
    if (detailsCache[packageId]) return;
    try {
      const details = await getPackageDetails(getStoredAuthToken(), packageId);
      setDetailsCache((prev) => ({ ...prev, [packageId]: details }));
    } catch (error) {
      alert(
        "Couldn't get package details: " +
          (error instanceof Error ? error.message : error)
      );
    }
  }

  async function handleConfirmPickup(packageId: number) {
    try {
      await confirmPickup(getStoredAuthToken(), packageId);
      alert("Pickup confirmed!");
      window.location.reload();
    } catch (error) {
      alert(
        "Couldn't confirm pickup: " +
          (error instanceof Error ? error.message : error)
      );
    }
  }

  async function handleConfirmDeposit(packageId: number) {
    try {
      await confirmDeposit(getStoredAuthToken(), packageId);
      alert("Deposit confirmed!");
      window.location.reload();
    } catch (error) {
      alert(
        "Couldn't confirm deposit: " +
          (error instanceof Error ? error.message : error)
      );
    }
  }

  async function handleShowDeliveryCode(packageId: number) {
    try {
      const code = await getDeliveryCode(packageId, getStoredAuthToken());
      setDeliveryCodes((prev) => ({ ...prev, [packageId]: code }));
    } catch (error) {
      alert(
        "Couldn't retrieve delivery code: " +
          (error instanceof Error ? error.message : error)
      );
    }
  }

  return (
    <div
      className="active-card"
      style={{
        width: "60vw",
        margin: "30px auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        color: "#222f68",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>{title}</h1>

      {assignments.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >
          {emptyMessage}
        </div>
      ) : (
        assignments.map((assignment) => (
          <details
            key={assignment.id}
            onToggle={(e: React.SyntheticEvent<HTMLDetailsElement>) => {
              if (e.currentTarget.open) {
                handleOpen(assignment.id);
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
              <span>
                {mode === "pickup" ? "📍" : "📦"} Package #{assignment.id}
              </span>
              <span style={{ fontSize: "14px", color: "#666" }}>
                {assignment.status.replace("_", " ")}
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
              {detailsCache[assignment.id] ? (
                <>
                  <strong>Type</strong>
                  <span>{detailsCache[assignment.id].type}</span>

                  <strong>Status</strong>
                  <span>{detailsCache[assignment.id].status}</span>

                  <strong>Phone</strong>
                  <span>{detailsCache[assignment.id].phoneNumber}</span>

                  <strong>Coordinates</strong>
                  <span>
                    {detailsCache[assignment.id].coordinates
                      ? `${detailsCache[assignment.id].coordinates?.latitude}, ${detailsCache[assignment.id].coordinates?.longitude}`
                      : "Not available"}
                  </span>

                  <strong>Available</strong>
                  <span>
                    {detailsCache[assignment.id].availableFrom} -{" "}
                    {detailsCache[assignment.id].availableUntil}
                  </span>

                  <strong>Actions</strong>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {mode === "pickup" && assignment.status === "PENDING" && (
                      <button
                        className="buttonStyle"
                        onClick={() => handleConfirmPickup(assignment.id)}
                      >
                        Confirm Pickup
                      </button>
                    )}
                    {mode === "pickup" && assignment.status === "PICKED_UP" && (
                      <button
                        className="buttonStyle"
                        onClick={() => handleConfirmDeposit(assignment.id)}
                      >
                        Confirm Deposit
                      </button>
                    )}
                    {mode === "dropoff" && (
                      <>
                        <button
                          className="buttonStyle"
                          onClick={() => handleShowDeliveryCode(assignment.id)}
                        >
                          Show Delivery Code
                        </button>
                        {deliveryCodes[assignment.id] && (
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              letterSpacing: "4px",
                              padding: "8px 12px",
                              background: "#f8f9ff",
                              borderRadius: "8px",
                            }}
                          >
                            {deliveryCodes[assignment.id]}
                          </span>
                        )}
                      </>
                    )}
                  </div>
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

export default DeliveryAssignmentList;

import React, { useEffect, useState } from "react";
import {
  AssignPackage,
  getAssignedCouriers,
  getPickedUpPackages,
} from "../../../utils/ClientRequests/ManagerApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

function AssignPackages() {
  const [courierList, setCourierList] = useState([]);
  const [activeCourier, setActiveCourier] = useState(null);

  const [packageList, setPackageList] = useState([]);
  const [activePackage, setActivePackage] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const fetchedCourierList = await getAssignedCouriers(getStoredEmail());
        const fetchedPackageList = await getPickedUpPackages(getStoredEmail());
        setCourierList(fetchedCourierList);
        setPackageList(fetchedPackageList);
      } catch (error) {
        console.error("Failed to fetch list", error);
        alert("Couldn't load list.");
      }
    };

    fetchList();
  }, []);

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  };

  const postAssignment = async () => {
    try {
      AssignPackage(activePackage.id, activeCourier.email);
    } catch (error) {
      console.error("Failed to execute assignment", error);
      alert("Couldn't assign package");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "white",
          borderRadius: "12px",
          border: "1px solid #ddd",
          padding: "28px",
        }}
      >
        {!activePackage && (
          <>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#222f68",
              }}
            >
              Stored packages
            </h2>

            <p
              style={{
                color: "#222f68",
                marginBottom: "24px",
              }}
            >
              Select a package.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {packageList.length === 0 ? (
                <p
                  style={{
                    color: "#222f68",
                    textAlign: "center",
                  }}
                >
                  No packages available.
                </p>
              ) : (
                packageList.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg)}
                    style={{ ...buttonStyle, color: "#222f68" }}
                  >
                    📦 Package #{pkg.id}
                  </button>
                ))
              )}
            </div>
          </>
        )}
        {activePackage && !activeCourier && (
          <>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#222f68",
              }}
            >
              Courier list
            </h2>

            <p
              style={{
                color: "#222f68",
                marginBottom: "24px",
              }}
            >
              Assign a deliverer
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {courierList.length === 0 ? (
                <p
                  style={{
                    color: "#222f68",
                    textAlign: "center",
                  }}
                >
                  No couriers available.
                </p>
              ) : (
                courierList.map((c) => (
                  <button
                    key={c.email}
                    onClick={() => setActiveCourier(c)}
                    style={{ ...buttonStyle, color: "#222f68" }}
                  >
                    👤 Courier #{c.email}
                  </button>
                ))
              )}
              <button
                style={{ ...buttonStyle, color: "#222f68" }}
                onClick={() => setActivePackage(null)}
              >
                {" "}
                Back
              </button>
            </div>
          </>
        )}
        {activeCourier && activePackage && (
          <>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#222f68",
              }}
            >
              Summary
            </h2>

            <p
              style={{
                color: "#222f68",
                marginBottom: "24px",
              }}
            >
              Review the assignment before confirming.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "24px",
                padding: "16px",
                borderRadius: "8px",
                background: "#f5f5f5",
              }}
            >
              <div style={{ color: "#222f68" }}>
                <strong>📦 Package:</strong> #{activePackage.id}
              </div>
              <div style={{ color: "#222f68" }}>
                <strong>👤 Courier:</strong> {activeCourier.email}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                style={{
                  ...buttonStyle,
                  background: "#222f68",
                  color: "white",
                }}
                onClick={() => {
                  postAssignment();
                  window.location.reload();
                }}
              >
                Confirm
              </button>
              <button
                style={{ ...buttonStyle, color: "#222f68" }}
                onClick={() => setActiveCourier(null)}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssignPackages;

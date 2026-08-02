import React, { useEffect, useState } from "react";
import {
  AssignPackage,
  getAssignedCouriers,
} from "../../../utils/ClientRequests/ManagerApiCalls";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import "../../general/GeneralView.css"

function DeliveryRequestAssignments( {getPackageList,type}) {
  const [courierList, setCourierList] = useState([]);
  const [activeCourier, setActiveCourier] = useState(null);

  const [pickUpList, setPickUpList] = useState([]);
  const [activePackage, setActivePackage] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const fetchedCourierList = await getAssignedCouriers(getStoredAuthToken());
        const fetchedPickUpList = await getPackageList(getStoredAuthToken());
        setCourierList(fetchedCourierList);
        setPickUpList(fetchedPickUpList);
      } catch (error) {
        console.error("Failed to fetch list", error);
        alert("Couldn't load list.");
      }
    };

    fetchList();
  }, []);

  
  const postAssignment = async () => {
    try {
      await AssignPackage(activePackage.id, activeCourier.email);
      window.location.reload();
    } catch (error) {
      console.error("Failed to execute assignment", error);
      alert("Couldn't assign package");
    }
  };

    return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="active-card" style={{ width: "380px" }}>
        {!activePackage && (
          <>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#222f68",
              }}
            >
              Pick-up requests
            </h2>

            <p
              style={{
                color: "#222f68",
                marginBottom: "24px",
              }}
            >
              Select a pick-up request.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {pickUpList.length === 0 ? (
                <p
                  style={{
                    color: "#222f68",
                    textAlign: "center",
                  }}
                >
                  No packages available.
                </p>
              ) : (
                pickUpList.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackage(pkg)}
                    className="buttonStyle"
                  >
                    {type} {pkg.id}
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
                    className="buttonStyle"
                  >
                    👤 Courier : {c.email}
                  </button>
                ))
              )}
              <button
                className="buttonStyle"
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
                <strong> {type}</strong> {activePackage.id}
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
                className="buttonStyle"
                onClick={async () => {
                  await postAssignment();
                }}
              >
                Confirm
              </button>
              <button
                className="buttonStyle"
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

export default DeliveryRequestAssignments;

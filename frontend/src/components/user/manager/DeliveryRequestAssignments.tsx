import React, { useEffect, useState } from "react";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import "../../general/GeneralView.css";

function DeliveryRequestAssignments({
  getPackageList,
  getRecipientList,
  assignFunction,
  recipientLabel,
  type,
}) {
  const [recipientList, setRecipientList] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(null);

  const [packageList, setPackageList] = useState([]);
  const [activePackage, setActivePackage] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const fetchedRecipientList = await getRecipientList(
          getStoredAuthToken()
        );
        const fetchedPackageList = await getPackageList(
          getStoredAuthToken()
        );

        setRecipientList(fetchedRecipientList);
        setPackageList(fetchedPackageList);
      } catch (error) {
        console.error("Failed to fetch list", error);
        alert("Couldn't load list.");
      }
    };

    fetchList();
  }, [getPackageList, getRecipientList]);

  const postAssignment = async () => {
    try {
      await assignFunction(
        getStoredAuthToken(),
        activePackage.id,
        activeRecipient.email
      );

      window.location.reload();
    } catch (error) {
      console.error("Failed to execute assignment", error);
      alert("Couldn't complete operation.");
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
              Available packages
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
                    className="buttonStyle"
                  >
                    {type} {pkg.id}
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {activePackage && !activeRecipient && (
          <>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
                color: "#222f68",
              }}
            >
              Recipient list
            </h2>

            <p
              style={{
                color: "#222f68",
                marginBottom: "24px",
              }}
            >
              Select a recipient.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {recipientList.length === 0 ? (
                <p
                  style={{
                    color: "#222f68",
                    textAlign: "center",
                  }}
                >
                  No recipients available.
                </p>
              ) : (
                recipientList.map((recipient) => (
                  <button
                    key={recipient.email}
                    onClick={() => setActiveRecipient(recipient)}
                    className="buttonStyle"
                  >
                    {recipientLabel}: {recipient.email}
                  </button>
                ))
              )}

              <button
                className="buttonStyle"
                onClick={() => setActivePackage(null)}
              >
                Back
              </button>
            </div>
          </>
        )}

        {activePackage && activeRecipient && (
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
              Review before confirming.
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
                <strong>{type}</strong> {activePackage.id}
              </div>

              <div style={{ color: "#222f68" }}>
                <strong>{recipientLabel}:</strong>{" "}
                {activeRecipient.email}
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
                onClick={postAssignment}
              >
                Confirm
              </button>

              <button
                className="buttonStyle"
                onClick={() => setActiveRecipient(null)}
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
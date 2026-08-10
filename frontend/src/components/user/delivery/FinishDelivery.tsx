import React, { useEffect, useState } from "react";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import {
    getAssignedPackageList,
    getDeliveryCode,
} from "../../../utils/ClientRequests/DeliveryApiCalls";
import "../../general/GeneralView.css"
function FinishDelivery() {
    const [targetDelivery, setTargetDelivery] = useState(null);
    const [packageList, setPackageList] = useState([]);
    const [deliveryCode, setDeliveryCode] = useState("");
    const [confirmationStatus, setConfirmationStatus] = useState(false);

    const fetchPackages = async () => {
        try {
            const list = await getAssignedPackageList(getStoredAuthToken());
            setPackageList(list || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSelectPackage = async (pkg) => {
        try {
            const code = await getDeliveryCode(pkg.id,getStoredAuthToken());

            setTargetDelivery(pkg);
            setDeliveryCode(code);
        } catch (err) {
            console.error(err);
            alert("Couldn't retrieve delivery code.");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="active-card" style={{ width: "380px" }}>
                {!targetDelivery && !confirmationStatus && (
                    <>
                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "8px",
                                color: "#222f68",
                            }}
                        >
                            Delivery Code
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
                                        onClick={() => handleSelectPackage(pkg)}
                                        className="buttonStyle"
                                        style={{
                                            color: "#222f68",
                                        }}
                                    >
                                        📦 Package #{pkg.id}
                                    </button>
                                ))
                            )}
                        </div>
                    </>
                )}

                {targetDelivery && !confirmationStatus && (
                    <>
                        <h2
                            style={{
                                marginTop: 0,
                                color: "#222f68",
                            }}
                        >
                            Package #{targetDelivery.id}
                        </h2>

                        <p
                            style={{
                                color: "#222f68",
                                marginBottom: "16px",
                            }}
                        >
                            Show this delivery code to the customer.
                        </p>

                        <div
                            style={{
                                width: "40vw",
                                maxWidth: "100%",
                                overflowX: "auto",
                                overflowY: "hidden",
                                whiteSpace: "nowrap",
                                padding: "24px",
                                border: "2px dashed #222f68",
                                borderRadius: "10px",
                                marginBottom: "24px",
                                background: "#f8f9ff",
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    minWidth: "100%",
                                    textAlign: "center",
                                    fontSize: "48px",
                                    fontWeight: "bold",
                                    fontFamily: "monospace",
                                    color: "#222f68",
                                    letterSpacing: "6px",
                                }}
                            >
                                {deliveryCode}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    setTargetDelivery(null);
                                    setDeliveryCode("");
                                }}
                                className="buttonStyle"
                                style={{
                                    background: "#eee",
                                    color: "#333",
                                }}
                            >
                                Back
                            </button>

                            <button
                                onClick={async () => {
                                    setConfirmationStatus(true);
                                    window.location.reload();
                                }}
                                className="buttonStyle"
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FinishDelivery;
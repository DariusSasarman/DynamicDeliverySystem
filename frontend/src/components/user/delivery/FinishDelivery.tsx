import React, { useEffect, useState } from "react";
import { getStoredEmail } from "../../../utils/InternalUtils";
import {
    getAssignedPackageList,
    getDeliveryCode,
} from "../../../utils/ClientRequests/DeliveryApiCalls";

function FinishDelivery() {
    const [targetDelivery, setTargetDelivery] = useState(null);
    const [packageList, setPackageList] = useState([]);
    const [deliveryCode, setDeliveryCode] = useState("");
    const [confirmationStatus, setConfirmationStatus] = useState(false);

    const fetchPackages = async () => {
        try {
            const list = await getAssignedPackageList(getStoredEmail());
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
            const code = await getDeliveryCode(pkg.id);

            setTargetDelivery(pkg);
            setDeliveryCode(code);
        } catch (err) {
            console.error(err);
            alert("Couldn't retrieve delivery code.");
        }
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
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
                                        style={{
                                            ...buttonStyle,
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
                                style={{
                                    ...buttonStyle,
                                    background: "#eee",
                                    color: "#333",
                                }}
                            >
                                Back
                            </button>

                            <button
                                onClick={() => {
                                    setConfirmationStatus(true);
                                    window.location.reload();
                                }}
                                style={buttonStyle}
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
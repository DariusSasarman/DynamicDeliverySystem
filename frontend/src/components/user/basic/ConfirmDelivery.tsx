import React, { useEffect, useState } from "react";
import {
    getPackageClientList,
    sendDeliveryConfirmation,
} from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";
import "../../general/GeneralView.css"

function ConfirmDelivery() {
    const [targetDelivery, setTargetDelivery] = useState(null);
    const [packageList, setPackageList] = useState([]);
    const [deliveryCode, setDeliveryCode] = useState("");
    const [confirmationStatus, setConfirmationStatus] = useState(false);

    const fetchPackages = async () => {
            try {
                const list = await getPackageClientList(getStoredEmail());
                setPackageList(list || []);
            } catch (err) {
                console.error(err);
            }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleConfirm = async () => {
        try{
            const success = await sendDeliveryConfirmation(
                targetDelivery.id,
                deliveryCode
            );
            if (success) {
                setConfirmationStatus(true);
            } else {
                alert("Invalid delivery code.");
            }
        }
        catch(error)
        {
            alert("Couldn't process confirmation");
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
                {!targetDelivery && !confirmationStatus && (
                    <>
                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "8px",
                                color:"#222f68"
                            }}
                        >
                            Confirm Delivery
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
                                        onClick={() => setTargetDelivery(pkg)}
                                        className="buttonStyle"
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
                            }}
                        >
                            Package #{targetDelivery.id}
                        </h2>

                        <p
                            style={{
                                color: "#222f68",
                                marginBottom: "20px",
                            }}
                        >
                            Enter your delivery code.
                        </p>

                        <input
                            type="text"
                            value={deliveryCode}
                            onChange={(e) =>
                                setDeliveryCode(e.target.value)
                            }
                            placeholder="Delivery code"
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "20px",
                                boxSizing: "border-box",
                            }}
                        />

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
                                onClick={handleConfirm}
                                className="buttonStyle"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                )}

                {confirmationStatus && (
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "48px",
                                marginBottom: "12px",
                                color:"#222f68"
                            }}
                        >
                            🚚
                        </div>

                        <h2>Delivery Confirmed</h2>

                        <p
                            style={{
                                color: "#222f68",
                            }}
                        >
                            Your confirmation has been received.
                        </p>

                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="buttonStyle"
                            style={{
                                
                                marginTop: "24px",
                            }}
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfirmDelivery;
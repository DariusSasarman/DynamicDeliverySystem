import React, { useState } from "react";
import { sendPickupRequest } from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

function PlaceDelivery() {
    const [newRequestDeliveryEmail, setNewRequestDeliveryEmail] = useState("");
    const [pickUpDate, setNewPickUpDate] = useState("");

    const handlePickupRequest = async () => {
        try{
            const success = await sendPickupRequest(
                pickUpDate,
                newRequestDeliveryEmail,
                getStoredEmail()
            );

            if (!success) {
                alert("Couldn't handle delivery.");
                return;
            }

            alert("Pickup request sent!");
            window.location.reload();
        }
        catch(error)
        {
            alert("Couldn't execute request: " + error);
        }
    };

    return (
        <div
            style={{
                minHeight: "60vh",
                marginTop:"10vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#eef2f7",
                padding: "30px",
            }}
        >
            <div
                style={{
                    width: "400px",
                    background: "white",
                    borderRadius: "15px",
                    padding: "35px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        textAlign: "center",
                        color: "#333",
                    }}
                >
                    📦 New Delivery
                </h2>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label
                        style={{
                            fontWeight: "600",
                            color: "#555",
                        }}
                    >
                        Recipient Email
                    </label>

                    <input
                        type="email"
                        value={newRequestDeliveryEmail}
                        onChange={(e) =>
                            setNewRequestDeliveryEmail(e.target.value)
                        }
                        placeholder="john@example.com"
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            outline: "none",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label
                        style={{
                            fontWeight: "600",
                            color: "#555",
                        }}
                    >
                        Pickup Date
                    </label>

                    <input
                        type="date"
                        value={pickUpDate}
                        onChange={(e) => setNewPickUpDate(e.target.value)}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            outline: "none",
                        }}
                    />
                </div>

                <button
                    onClick={handlePickupRequest}
                >
                    Send Pickup Request
                </button>
            </div>
        </div>
    );
}

export default PlaceDelivery;
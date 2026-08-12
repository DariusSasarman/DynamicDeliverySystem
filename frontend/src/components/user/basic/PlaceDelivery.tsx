import React, { useState } from "react";
import { sendPickupRequest } from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredAuthToken } from "../../../utils/InternalUtils";

function PlaceDelivery() {
    const [newRequestDeliveryEmail, setNewRequestDeliveryEmail] = useState("");
    const [pickUpDate, setNewPickUpDate] = useState("");

    const handlePickupRequest = async () => {
        if (!newRequestDeliveryEmail.trim()) {
            alert("Please enter a recipient email.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(newRequestDeliveryEmail.trim())) {
            alert("Please enter a valid recipient email.");
            return;
        }

        if (!pickUpDate) {
            alert("Please select a pickup date.");
            return;
        }

        const selectedDate = new Date(`${pickUpDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("Pickup date cannot be in the past.");
            return;
        }

        try {
            await sendPickupRequest(
                getStoredAuthToken(),
                pickUpDate,
                newRequestDeliveryEmail.trim()
            );

            alert("Pickup request sent!");
            window.location.reload();
        } catch (error) {
            alert(
                "Couldn't execute request: " +
                    (error instanceof Error ? error.message : error)
            );
        }
    };

    return (
        <div
            style={{
                minHeight: "60vh",
                marginTop: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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

                <button onClick={handlePickupRequest}>
                    Send Pickup Request
                </button>
            </div>
        </div>
    );
}

export default PlaceDelivery;

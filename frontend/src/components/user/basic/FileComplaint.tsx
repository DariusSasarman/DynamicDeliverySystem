import React, { useEffect, useState } from "react";
import {
    getDeliveredPackageClientList,
    sendComplaint,
} from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredEmail } from "../../../utils/InternalUtils";

function FileComplaint() {
    const [deliveredPackageList, setDeliveredPackageList] = useState([]);
    const [activePackage, setActivePackage] = useState(null);
    const [complaint, setComplaint] = useState("");

    useEffect(() => {
        const fetchPackageList = async () => {
            try {
                const list = await getDeliveredPackageClientList(getStoredEmail());
                setDeliveredPackageList(list);
            } catch (error) {
                console.error("Failed to fetch package list:", error);
            }
        };

        fetchPackageList();
    }, []);

    const sendComplaintButton = async () => {
        if (!activePackage || complaint.trim() === "") {
            alert("Please enter a complaint.");
            return;
        }

        try {
            await sendComplaint(
                getStoredEmail(),
                activePackage.id,
                complaint
            );

            alert("Complaint sent successfully.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to send complaint.");
        }
    };

    return (
        <div
            style={{
                width: "300px",
                minHeight: "500px",
                overflowY: "auto",
                overflowX: "hidden",
                marginTop: "60px",
                border: "2px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
            }}
        >
            

            {activePackage === null ? (
                <>
                <h3>Here are your last delivered packages</h3>
                {deliveredPackageList.length > 0 ? (
                    deliveredPackageList.map((pkg) => (
                        <button
                            key={pkg.id}
                            onClick={() => setActivePackage(pkg)}
                            style={{
                                display: "block",
                                width: "90%",
                                padding: "10px",
                                marginBottom: "10px",
                                cursor: "pointer",
                            }}
                        >
                            Package #{pkg.id}
                        </button>
                    )
                    )
                ) : (
                    <p>No delivered packages found.</p>
                )}
                </>
            ) : (
                <>
                    <h4>Package #{activePackage.id}</h4>

                    <textarea
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        placeholder="Please describe your complaint..."
                        rows={8}
                        style={{
                            width: "90%",
                            resize: "vertical",
                            marginBottom: "15px",
                        }}
                    />

                    <button
                        onClick={sendComplaintButton}
                        style={{
                            width: "90%",
                            padding: "10px",
                            cursor: "pointer",
                        }}
                    >
                        Submit Complaint
                    </button>

                    <button
                        onClick={() => {
                            setActivePackage(null);
                            setComplaint("");
                        }}
                        style={{
                            width: "90%",
                            padding: "10px",
                            marginTop: "10px",
                            cursor: "pointer",
                        }}
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    );
}

export default FileComplaint;
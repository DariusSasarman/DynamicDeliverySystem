import React, { useEffect, useState } from "react";
import {
    confirmInvoice,
    getInvoiceList,
} from "../../utils/ClientRequests/HeaderApiCalls";
import { getStoredEmail } from "../../utils/InternalUtils";

function InvoiceView() {
    const [invoicesList, setInvoicesList] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        async function loadInvoices() {
            const invoiceList = await getInvoiceList(getStoredEmail());
            setInvoicesList(invoiceList);
        }

        loadInvoices();
    }, []);

    async function handleConfirm(invoiceId) {
        setLoadingId(invoiceId);

        try {
            await confirmInvoice(invoiceId);

            setInvoicesList((prev) =>
                prev.filter((invoice) => invoice.id !== invoiceId)
            );
            
        }
        catch(error){
            alert("Couldn't load invoices!");
        }
        finally {
            setLoadingId(null);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                maxHeight: "500px",
                overflowY: "auto",
                padding: "20px",
            }}
        >
            {invoicesList.length === 0 ? (
                <div
                    style={{
                        width: "50vw",
                        padding: "30px",
                        textAlign: "center",
                        backgroundColor: "#f7f7f7",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        color: "#666",
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    🎉 No invoices left!
                </div>
            ) : (
                invoicesList.map((invoice) => (
                    <div
                        key={invoice.id}
                        style={{
                            width: "50vw",
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            padding: "20px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <h3
                                style={{
                                    margin: "0 0 8px 0",
                                    color: "#333",
                                }}
                            >
                                Invoice #{invoice.id}
                            </h3>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#555",
                                    lineHeight: "1.5",
                                }}
                            >
                                {invoice.text}
                            </p>
                        </div>

                        <button
                            onClick={() => handleConfirm(invoice.id)}
                            disabled={loadingId === invoice.id}
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor:
                                    loadingId === invoice.id
                                        ? "#9ca3af"
                                        : "#22c55e",
                                color: "white",
                                fontWeight: "bold",
                                cursor:
                                    loadingId === invoice.id
                                        ? "not-allowed"
                                        : "pointer",
                                minWidth: "120px",
                                transition: "0.2s",
                            }}
                        >
                            {loadingId === invoice.id
                                ? "Confirming..."
                                : "Confirm"}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default InvoiceView;
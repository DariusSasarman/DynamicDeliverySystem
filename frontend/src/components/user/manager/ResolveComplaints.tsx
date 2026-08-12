import React, { useEffect, useState } from "react";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import {
  getComplaintsList,
  resolveComplaint,
} from "../../../utils/ClientRequests/ManagerApiCalls";
import "../../general/GeneralView.css"
function ResolveComplaints() {
  const [complaintList, setComplaintList] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const list = await getComplaintsList(getStoredAuthToken());
        setComplaintList(list);
      } catch (error) {
        alert(
          "Couldn't load complaints: " +
            (error instanceof Error ? error.message : error)
        );
      }
    }

    loadComplaints();
  }, []);

  function handleDraftChange(complaintId, value) {
    setReplyDrafts((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  }

  async function handleSend(complaintId) {
    const replyText = (replyDrafts[complaintId] || "").trim();
    if (!replyText) return;

    setSendingId(complaintId);

    try{
        await resolveComplaint(getStoredAuthToken(), complaintId, replyText);
        setComplaintList((prev) =>
            prev.filter((complaint) => complaint.id !== complaintId)
        );

        setReplyDrafts((prev) => {
          const next = { ...prev };
          delete next[complaintId];
          return next;
        });

        setSendingId(null);
    }
    catch(error)
    {
        alert("Couldn't execute resolve: " + error);
    }
  }

  return (
    <div className="active-card" style={{ width: "60vw", margin: "30px auto", display: "flex", flexDirection: "column", gap: "20px", color: "#222f68" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>📋 Complaint Center</h1>
          <p
            style={{
              marginTop: "6px",
              color: "#666",
              fontSize: "15px",
            }}
          >
            Review customer complaints and provide a resolution.
          </p>
        </div>

        <div
          style={{
            background: "#eef2ff",
            color: "#222f68",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          {complaintList.length} Open
        </div>
      </div>

      {complaintList.length === 0 ? (
        <div
          style={{
            padding: "60px 30px",
            textAlign: "center",
            borderRadius: "14px",
            border: "1px dashed #ccd3eb",
            background: "#fafbff",
          }}
        >
          <div style={{ fontSize: "56px" }}>🎉</div>

          <h2
            style={{
              marginTop: "16px",
              marginBottom: "8px",
              color: "#222f68",
            }}
          >
            All caught up!
          </h2>

          <p
            style={{
              color: "#666",
              margin: 0,
              fontSize: "16px",
            }}
          >
            There are no unresolved complaints at the moment.
          </p>
        </div>
      ) : (
        complaintList.map((complaint) => {
          const draft = replyDrafts[complaint.id] || "";
          const canSend = draft.trim().length > 0;
          const isSending = sendingId === complaint.id;

          return (
            <details
              key={complaint.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "0.2s",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  padding: "18px 24px",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📦</span>

                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Package #{complaint.packageId}
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      Complaint #{complaint.id}
                    </div>
                  </div>
                </span>

                <span
                  style={{
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Click to view
                </span>
              </summary>

              <div
                style={{
                  borderTop: "1px solid #eee",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
                    rowGap: "18px",
                    columnGap: "20px",
                    fontSize: "16px",
                  }}
                >
                  <strong>📦 Package ID</strong>
                  <span>{complaint.packageId}</span>

                  <strong>📅 Delivered on</strong>
                  <span>{complaint.deliveredOn}</span>

                  <strong>🚚 Courier</strong>
                  <span>{complaint.courierEmail}</span>

                  <strong>📝 Complaint</strong>

                  <div
                    style={{
                      background: "#fff8e6",
                      borderLeft: "5px solid #f5b942",
                      padding: "16px",
                      borderRadius: "8px",
                      lineHeight: 1.6,
                    }}
                  >
                    {complaint.complaintText}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8f9fc",
                    border: "1px solid #e6e8f2",
                    borderRadius: "10px",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    ✅ Resolution
                  </label>

                  <textarea
                    value={draft}
                    onChange={(e) =>
                      handleDraftChange(complaint.id, e.target.value)
                    }
                    placeholder="Describe how this complaint was resolved..."
                    rows={4}
                    style={{
                      resize: "vertical",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "15px",
                      fontFamily: "inherit",
                    }}
                  />

                  <button
                    onClick={() => handleSend(complaint.id)}
                    disabled={!canSend || isSending}
                    className="buttonStyle"
                    style={{
                      cursor: canSend && !isSending ? "pointer" : "not-allowed"
                    }}
                  >
                    {isSending ? "Sending..." : "✓ Resolve Complaint"}
                  </button>
                </div>
              </div>
            </details>
          );
        })
      )}
    </div>
  );
}

export default ResolveComplaints;
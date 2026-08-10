import React, { useState } from "react";
import { sendInvoice } from "../../../utils/ClientRequests/ManagerApiCalls";
import "../../general/GeneralView.css"
import { getStoredAuthToken } from "../../../utils/InternalUtils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SendInvoices() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text: string }

  async function handleSend() {
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      alert("Please enter an email.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!trimmedMessage) {
      alert("Please enter a message.");
      return;
    }

    try {
      setSending(true);
      setStatus(null);
      await sendInvoice(getStoredAuthToken(),trimmedEmail, trimmedMessage);
      
      setStatus({ type: "success", text: "Invoice sent successfully!" });
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: "Failed to send invoice. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.ctrlKey && !sending) {
      handleSend();
    }
  }

  return (
    <div
      style={{
        width: "60vw",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>📧 Send Invoice</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="email"
          placeholder="Client email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sending}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <textarea
          placeholder="Invoice message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={8}
          disabled={sending}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
        />

        <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "right" }}>
          {message.length} characters
        </div>

        {status && (
          <div
            style={{
              padding: "0.7rem 0.9rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              background: status.type === "success" ? "#e6f4ea" : "#fdecea",
              color: status.type === "success" ? "#1e7e34" : "#c62828",
            }}
          >
            {status.text}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending}
          className="buttonStyle"
          style={{
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "📨 Send Invoice"}
        </button>
      </div>
    </div>
  );
}

export default SendInvoices;

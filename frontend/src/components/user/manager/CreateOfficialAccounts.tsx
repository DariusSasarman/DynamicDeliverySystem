import React, { useState } from "react";
import { getStoredEmail } from "../../../utils/InternalUtils";
import { createOfficialAccount } from "../../../utils/ClientRequests/ManagerApiCalls";

function CreateOfficialAccounts() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("manager");

  const handleCreate = () => {
    
    createOfficialAccount(getStoredEmail(),email, password, type);

    setEmail("");
    setPassword("");
    setType("manager");
  };

  return (
    <div
      style={{
        width: "60vw",
        margin: "80px auto",
        marginTop : "100px",
        padding: "32px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <h2
        style={{
          margin: 0,
          textAlign: "center",
          color: "#2d3748",
        }}
      >
        👤 Create Official Account
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <label>Email</label>
        <input
          type="email"
          placeholder="employee@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <label>Account Type</label>

        <label style={radioStyle}>
          <input
            type="radio"
            checked={type === "manager"}
            onChange={() => setType("manager")}
          />
          🧑‍💼 Manager
        </label>

        <label style={radioStyle}>
          <input
            type="radio"
            checked={type === "delivery"}
            onChange={() => setType("delivery")}
          />
          🚚 Delivery
        </label>
      </div>

      <button
        onClick={handleCreate}
        style={{
          padding: "14px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ➕ Create Account
      </button>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
};

const radioStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "16px",
  cursor: "pointer",
};

export default CreateOfficialAccounts;
import { useState } from "react";
import LocationPicker from "../../general/LocationPicker";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import { createManagerAccount, createDeliveryAccount } from "../../../utils/ClientRequests/ManagerApiCalls";
import "../../general/GeneralView.css";

const radioStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "16px",
  cursor: "pointer",
};

function CreateOfficialAccounts() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("manager");
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [mainLocation, setMainLocation] = useState<[number, number] | null>(null);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setAdditionalInformation("");
    setMainLocation(null);
  };

  // Only used for delivery accounts (manager city text removed)
  const additionalLabel = type === "delivery"
    ? "Responsible manager email"
    : "";

  const additionalPlaceholder = type === "delivery"
    ? "manager@company.com"
    : "";

  // API calls are exported from ManagerApiCalls.tsx

  const handleCreate = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email.");
      return;
    }
    if (!password.trim()) {
      alert("Please enter a password.");
      return;
    }
    if (type === "manager" && !mainLocation) {
      alert("Please pick a main location for the manager.");
      return;
    }
    if (type === "delivery" && !additionalInformation.trim()) {
      alert("Please enter the responsible manager email.");
      return;
    }

    try {
      if (type === "manager") {
        await createManagerAccount(
          getStoredAuthToken(),
          email.trim(),
          password,
          mainLocation,
        );
      } else {
        await createDeliveryAccount(
          getStoredAuthToken(),
          email.trim(),
          password,
          additionalInformation.trim(),
        );
      }
      alert("Account created successfully.");
      setEmail("");
      setPassword("");
      setType("manager");
      setAdditionalInformation("");
      setMainLocation(null);
    } catch (error) {
      alert(
        "Couldn't create account: " +
          (error instanceof Error ? error.message : error)
      );
    }
  };

  return (
    <div
      style={{
        width: "60vw",
        margin: "80px auto",
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
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "15px",
            outline: "none",
            boxSizing: "border-box",
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
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "15px",
            outline: "none",
            boxSizing: "border-box",
          }}
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
            onChange={() => handleTypeChange("manager")}
          />
          🧑‍💼 Manager
        </label>

        <label style={radioStyle}>
          <input
            type="radio"
            checked={type === "delivery"}
            onChange={() => handleTypeChange("delivery")}
          />
          🚚 Delivery
        </label>
      </div>

      {type === "delivery" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>{additionalLabel}</label>
          <input
            type="email"
            placeholder={additionalPlaceholder}
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {type === "manager" && (
        <LocationPicker
          value={mainLocation}
          onChange={setMainLocation}
          label="Main location"
          helperText="Pick the main location for this manager."
          height="220px"
        />
      )}

      <button
        onClick={handleCreate}
        className="buttonStyle"
      >
        Create Account
      </button>
    </div>
  );
}

export default CreateOfficialAccounts;

import { AccountTypes } from "./InternalUtils";
import { clearStoredAuthToken, getStoredAuthToken, setStoredAuthToken } from "./InternalUtils";

export async function submitRegistration(email: string, password: string) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const payload = await response.json();
    if (payload?.token) {
      setStoredAuthToken(payload.token);
    }
  }

  return response;
}

export async function submitLogin(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const payload = await response.json();
    if (payload?.token) {
      setStoredAuthToken(payload.token);
    }
  }

  return response;
}

export async function getTargetState(): Promise<AccountTypes> {
  const authToken = getStoredAuthToken();

  if (!authToken) {
    return AccountTypes.NONE;
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      clearStoredAuthToken();
      return AccountTypes.NONE;
    }

    const ret = await response.json();
    switch ((ret?.accountType ?? "").toLowerCase()) {
      case "manager":
        return AccountTypes.MANAGER;
      case "basic":
        return AccountTypes.BASIC;
      case "delivery":
        return AccountTypes.DELIVERY;
      default:
        return AccountTypes.NONE;
    }
  } catch (error) {
    clearStoredAuthToken();
    console.log("Failed to fetch account type.");
    return AccountTypes.NONE;
  }
}
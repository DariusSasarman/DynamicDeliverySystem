import { AccountTypes } from "./InternalUtils";

export async function submitRegistration(email: String, password: String) {
  return null;
}

export async function submitLogin(email: String, password: String) {
  return null;
}

export async function getTargetState(): Promise<AccountTypes> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return AccountTypes.BASIC;

  /// The actual code that will be final is down here
  /// |
  /// V
  try {
    const response = await fetch("/api/accountType", {});

    const ret = await response.json();
    switch (ret?.type) {
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
    console.log("Faile to fetch account type.");
    return AccountTypes.NONE;
  }
}
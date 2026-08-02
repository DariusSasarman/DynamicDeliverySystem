export enum AccountTypes {
  NONE = "none",
  BASIC = "basic",
  DELIVERY = "delivery",
  MANAGER = "manager",
}

export function getStoredAuthToken()
{
  return localStorage.getItem("dynamic-delivery-auth-token") ?? ""
}

export function setStoredAuthToken(token: string) {
  localStorage.setItem("dynamic-delivery-auth-token", token)
}

export function clearStoredAuthToken() {
  localStorage.removeItem("dynamic-delivery-auth-token")
}
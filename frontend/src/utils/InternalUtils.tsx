export enum AccountTypes {
  NONE = "none",
  BASIC = "basic",
  DELIVERY = "delivery",
  MANAGER = "manager",
}

export function getStoredAuthToken()
{
  return "example-auth-token"
}
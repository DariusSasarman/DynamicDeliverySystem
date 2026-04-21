export enum AccountTypes {
  NONE = "none",
  BASIC = "basic",
  DELIVERY = "delivery",
  MANAGER = "manager",
}

export function getTargetState() : AccountTypes {
  return AccountTypes.NONE;
}

export const AccountTypes = {
  NONE: "none",
  BASIC: "basic",
  DELIVERY: "delivery",
  MANAGER: "manager",
} as const;

export function getTargetState() {
  return AccountTypes.BASIC;
}

import { AccountTypes } from "./InternalUtils";

export async function submitRegistration(email: String, password : String) {
    return null;
}

export async function submitLogin (email : String, password : String)  {
    return null;
}

export function getTargetState(): AccountTypes {
  return AccountTypes.NONE;
}

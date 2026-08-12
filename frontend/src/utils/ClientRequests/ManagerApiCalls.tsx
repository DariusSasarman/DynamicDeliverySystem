import { throwIfNotOk } from "./apiError";

export async function getAssignedCouriers(authToken: string) {
  const response = await fetch("/api/manager/get-assigned-couriers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch assigned couriers");
  return response.json();
}

export async function getPickedUpPackages(authToken: string) {
  const response = await fetch("/api/manager/picked-up-packages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch picked up packages");
  const ids: number[] = await response.json();
  return ids.map((id) => ({ id }));
}

export async function getPickUpRequests(authToken: string) {
  const response = await fetch("/api/manager/pick-up-requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch pickup requests");
  const ids: number[] = await response.json();
  return ids.map((id) => ({ id }));
}

export async function AssignPackage(
  authToken: string,
  packageId: number,
  courierEmail: string
) {
  const response = await fetch("/api/manager/assign-package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ packageId, email: courierEmail }),
  });

  await throwIfNotOk(response, "Failed to assign package");
}

export async function getComplaintsList(authToken: string) {
  const response = await fetch("/api/manager/get-complaints", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch complaints");
  return response.json();
}

export async function resolveComplaint(
  authToken: string,
  complaintId: number,
  replyText: string
) {
  const response = await fetch("/api/manager/resolve-complaint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ complaintId, replyText }),
  });

  await throwIfNotOk(response, "Failed to resolve complaint");
}

export async function sendInvoice(
  authToken: string,
  clientEmail: string,
  text: string
) {
  const response = await fetch("/api/manager/send-invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ clientEmail, text }),
  });

  await throwIfNotOk(response, "Failed to send invoice");
}

export async function getManagers(authToken: string) {
  const response = await fetch("/api/manager/get-managers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch managers");
  const emails: string[] = await response.json();
  return emails.map((email) => ({ email }));
}

export async function createManagerAccount(
  ownerAuthToken: string,
  email: string,
  password: string,
  mainLocation: [number, number] | null
) {
  const response = await fetch("/api/auth/manager", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ownerAuthToken}`,
    },
    body: JSON.stringify({
      email,
      password,
      mainLocation,
    }),
  });

  await throwIfNotOk(response, "Failed to create manager account");
  return response.json();
}

export async function createDeliveryAccount(
  ownerAuthToken: string,
  email: string,
  password: string,
  responsibleManagerEmail: string
) {
  const response = await fetch("/api/auth/delivery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ownerAuthToken}`,
    },
    body: JSON.stringify({
      email,
      password,
      responsibleManagerEmail,
    }),
  });

  await throwIfNotOk(response, "Failed to create delivery account");
  return response.json();
}

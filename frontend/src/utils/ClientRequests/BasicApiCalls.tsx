import { throwIfNotOk } from "./apiError";

export async function getPackageClientList(authToken: string) {
  const response = await fetch("/api/basic/package-client-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch package client list");
  return response.json();
}

export async function getDeliveredPackageClientList(authToken: string) {
  const response = await fetch("/api/basic/delivered-package-client-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch delivered package client list");
  return response.json();
}

export async function sendDeliveryConfirmation(
  authToken: string,
  packageId: number,
  deliveryCode: string
): Promise<boolean> {
  const response = await fetch("/api/basic/delivery-confirmation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      packageId,
      deliveryCode,
    }),
  });

  await throwIfNotOk(response, "Failed to send delivery confirmation");
  const data = await response.json();
  return Boolean(data.confirmation);
}

export async function sendPickupRequest(
  authToken: string,
  pickUpDate: string,
  receiverEmail: string
) {
  const formattedDate = pickUpDate.includes("T")
    ? pickUpDate
    : `${pickUpDate}T14:00:00`;

  const response = await fetch("/api/basic/pickup-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      pickUpDate: formattedDate,
      receiverEmail,
    }),
  });

  await throwIfNotOk(response, "Failed to send pickup request");
  return response.json();
}

export async function getSchedule(authToken: string) {
  const response = await fetch("/api/basic/get-schedule", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch schedule");
  return response.json();
}

export async function saveSchedule(authToken: string, schedule: unknown) {
  const response = await fetch("/api/basic/save-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(schedule),
  });

  await throwIfNotOk(response, "Failed to save schedule");
  return response.json();
}

export async function sendComplaint(
  authToken: string,
  deliveryID: number,
  text: string
) {
  const response = await fetch("/api/basic/send-complaint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      deliveryID,
      text,
    }),
  });

  await throwIfNotOk(response, "Failed to send complaint");
  return response.json();
}

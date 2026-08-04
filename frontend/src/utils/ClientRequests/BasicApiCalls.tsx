
export async function getPackageClientList(authToken: String) {
  const response = await fetch("/api/basic/package-client-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch package client list");
  }

  const data = await response.json();
  return data;
}

export async function getDeliveredPackageClientList(authToken: String) {
  const response = await fetch("/api/basic/delivered-package-client-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch delivered package client list");
  }

  const data = await response.json();
  return data;
}

export async function sendDeliveryConfirmation(
    packageId: number,
    deliveryCode: string
) {
    const response = await fetch("/api/basic/delivery-confirmation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            packageId,
            deliveryCode,
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.confirmation) {
        throw new Error("Failed to send delivery confirmation");
    }

    return data;
}

export async function sendPickupRequest(pickUpDate : Date, receiverEmail : String)
{
    const response = await fetch("/api/basic/pickup-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pickUpDate,
            receiverEmail
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error("Failed to send pickup request");
    }

    return data;
}

export async function getSchedule(authToken: string) {
  const response = await fetch("/api/basic/get-schedule", {
      method: "GET",
      headers: {
          Authorization: `Bearer ${authToken}`,
      },
  });

  if (!response.ok) {
      throw new Error("Failed to fetch schedule");
  }
  
  const data = await response.json();
  return data;
}

export async function saveSchedule(authToken: string, schedule: any)
{
  const response = await fetch("/api/basic/save-schedule", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(schedule),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
      throw new Error("Failed to save schedule");
  }

  return data;
}

export async function sendComplaint(authToken: string, deliveryID: number, text: string)
{
  const response = await fetch("/api/basic/send-complaint", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        deliveryID,
        text
      }),
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
      throw new Error("Failed to send complaint");
  }

  return data;
}
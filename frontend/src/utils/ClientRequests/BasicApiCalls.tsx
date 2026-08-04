
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

export async function getSchedule(authToken) {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    phoneNumber: "07yeah",
    schedule: [
      {
        from: 8,
        until: 16,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        position: [46.770439, 23.589722],
      },
      {
        from: 16,
        until: 20,
        days: ["Mon", "Wed"],
        position: [46.765, 23.595],
      },
    ],
  };
}

export async function saveSchedule(authToken,schedule)
{

}

export async function sendComplaint(authToken, deliveryID, text)
{

}
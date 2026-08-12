import { throwIfNotOk } from "./apiError";

export async function getNearestPackage(
  currentPos: number[],
  authToken: string
) {
  const response = await fetch(
    `/api/delivery/nearest-package?longitude=${currentPos[1]}&latitude=${currentPos[0]}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  await throwIfNotOk(response, "Failed to fetch nearest package");
  return response.json();
}

export async function getPickupAssignments(authToken: string) {
  const response = await fetch("/api/delivery/get-pickup-assignments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch pick-up assignments");
  return response.json();
}

export async function getDropoffAssignments(authToken: string) {
  const response = await fetch("/api/delivery/get-dropoff-assignments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch drop-off assignments");
  return response.json();
}

export async function getAssignedPackageList(authToken: string) {
  const response = await fetch("/api/delivery/get-assigned-packages", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch assigned package list");
  return response.json();
}

export async function getPackageDetails(authToken: string, packageId: number) {
  const response = await fetch(
    `/api/delivery/get-package-details?packageId=${packageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  await throwIfNotOk(response, "Failed to fetch package details");
  return response.json();
}

export async function getDeliveryCode(packageId: number, authToken: string) {
  const response = await fetch(
    `/api/delivery/get-delivery-code?packageId=${packageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  await throwIfNotOk(response, "Failed to fetch delivery code");
  return response.text();
}

export async function confirmPickup(authToken: string, packageId: number) {
  const response = await fetch(
    `/api/delivery/confirm-pickup?packageId=${packageId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  await throwIfNotOk(response, "Failed to confirm pickup");
}

export async function confirmDeposit(authToken: string, packageId: number) {
  const response = await fetch(
    `/api/delivery/confirm-deposit?packageId=${packageId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  await throwIfNotOk(response, "Failed to confirm deposit");
}

export async function getDeliveryOnlyPackageList(authToken: string) {
  const packages = await getDropoffAssignments(authToken);
  return packages.map((pkg: { id: number }) => ({ id: pkg.id }));
}

export async function getNearestPackage(
  currentPos: number[],
  authToken: string
) {
  const response = await fetch(
    `/api/delivery/nearest-package?longitude=${currentPos[0]}&latitude=${currentPos[1]}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch nearest package");
  }

  return await response.json();
}

export async function getAssignedPackageList(authToken: string) {
  const response = await fetch(
    "/api/delivery/get-assigned-packages",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch assigned package list");
  }

  return await response.json();
}

export async function getPackageDetails(
  authToken: string,
  packageId: number
) {
  const response = await fetch(
    `/api/delivery/get-package-details?packageId=${packageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch package details");
  }

  return await response.json();
}

export async function getDeliveryCode(
  packageId: number,
  authToken: string
) {
  const response = await fetch(
    `/api/delivery/get-delivery-code?packageId=${packageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch delivery code");
  }

  return await response.text();
}
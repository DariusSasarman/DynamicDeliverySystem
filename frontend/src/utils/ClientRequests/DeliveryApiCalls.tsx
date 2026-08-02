export async function getNearestPackage(currentPos, authToken) {
  // Sends the location and the back-end saves it
  return {
    id: 15,
    pos: [57.12, 43.9],
  };
}

export async function getAssignedPackageList(authToken)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 124, pos: [9, 3] }, {id : 121, pos: [9,8]}];
}

export async function getPackageDetails(authToken, packageId) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    type: "Drop-off",
    phoneNumber: "0712 345 678",
    coordinates: {
      latitude: 46.7712,
      longitude: 23.6236,
    },
    availableFrom: "09:00",
    availableUntil: "17:00",
  };
}

export async function getDeliveryCode(packageId)
{
  return "Placeholder";
}
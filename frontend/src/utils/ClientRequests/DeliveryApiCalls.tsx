export async function getNearestPackage(currentPos, email) {
  //let's not dox ourselves
  return {
    id: 15,
    pos: [57.12, 43.9],
  };
}

export async function getAssignedPackageList(email)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 124, pos: [9, 3] }, {id : 121, pos: [6,9]}];
}

export async function getPackageDetails(email, packageId) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    phoneNumber: "0712 345 678",
    location: "12 Republicii Street, Cluj-Napoca",
    availableFrom: "09:00",
    availableUntil: "17:00",
  };
}

export async function getDeliveryCode(packageId)
{
  return "Placeholder";
}
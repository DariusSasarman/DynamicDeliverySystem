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

export async function getDeliveryCode(packageId)
{
  return "Placeholder";
}
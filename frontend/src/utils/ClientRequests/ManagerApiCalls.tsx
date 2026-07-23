
export async function getAssignedCouriers(managerEmail)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
        {email : "gigel@gmail.com", pos:[15,15]},
        {email : "marcel@gmail.com", pos:[15.2,15.2]},
    ];
}

export async function getPickedUpPackages(managerEmail)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 124}, {id : 123}];
}

export async function AssignPackage(packageId, courierEmail) {
    await new Promise((resolve) => setTimeout(resolve, 50));
}
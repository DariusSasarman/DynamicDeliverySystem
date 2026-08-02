import React from "react";
import { getAssignedCouriers } from "../../../utils/ClientRequests/ManagerApiCalls";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import MapWithPins from "../../general/MapWithPins";

function CouriersCurrentPosition() {
  return (
    <MapWithPins
      fetchItems={() => getAssignedCouriers(getStoredAuthToken())}
      posAccessor={(c: any) => c.pos}
      buttonLabel={(c: any) => c.email}
      title="Couriers"
      initialZoom={13}
      minMapWidth={640}
    />
  );
}

export default CouriersCurrentPosition;
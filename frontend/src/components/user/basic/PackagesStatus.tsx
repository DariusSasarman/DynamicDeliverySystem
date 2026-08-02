import React from "react";
import { getPackageClientList } from "../../../utils/ClientRequests/BasicApiCalls";
import { getStoredAuthToken } from "../../../utils/InternalUtils";
import MapWithPins from "../../general/MapWithPins";

function PackagesStatus() {
  return (
    <MapWithPins
      fetchItems={() => getPackageClientList(getStoredAuthToken())}
      posAccessor={(p: any) => p.pos}
      buttonLabel={(p: any) => `Package #${p.id}`}
      title="Last known location:"
      initialZoom={13}
      minMapWidth={640}
    />
  );
}

export default PackagesStatus;
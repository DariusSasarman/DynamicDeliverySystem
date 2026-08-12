import PickupAssignments from "./PickupAssignments";
import DropoffAssignments from "./DropoffAssignments";
import FinishDelivery from "./FinishDelivery";
import ViewNearestDelivery from "./ViewNearestDelivery";

export const getDeliveryButtonList = (setActiveView) => [
  {
    label: "Next destination",
    onClick: () => setActiveView(() => ViewNearestDelivery),
  },
  {
    label: "Pick-ups",
    onClick: () => setActiveView(() => PickupAssignments),
  },
  {
    label: "Drop-offs",
    onClick: () => setActiveView(() => DropoffAssignments),
  },
];

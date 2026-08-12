import DeliveryAssignmentList from "./DeliveryAssignmentList";

function PickupAssignments() {
  return (
    <DeliveryAssignmentList
      mode="pickup"
      title="Pick-up Assignments"
      emptyMessage="No pick-up assignments yet. Confirm the manager's assignment notification, then check here."
    />
  );
}

export default PickupAssignments;

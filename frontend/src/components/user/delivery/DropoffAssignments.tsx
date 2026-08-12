import DeliveryAssignmentList from "./DeliveryAssignmentList";

function DropoffAssignments() {
  return (
    <DeliveryAssignmentList
      mode="dropoff"
      title="Drop-off Assignments"
      emptyMessage="No drop-off assignments yet. Confirm the manager's delivery assignment notification, then check here."
    />
  );
}

export default DropoffAssignments;

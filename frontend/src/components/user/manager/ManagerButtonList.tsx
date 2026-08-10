import CouriersCurrentPosition from "./CouriersCurrentPosition";
import CreateOfficialAccounts from "./CreateOfficialAccounts";
import ResolveComplaints from "./ResolveComplaints";
import SendInvoices from "./SendInvoices";
import DeliveryRequestAssignments from "./DeliveryRequestAssignments";

import {
  getPickedUpPackages,
  getPickUpRequests,
  getAssignedCouriers,
  getManagers,
  AssignPackage,
} from "../../../utils/ClientRequests/ManagerApiCalls";

export const getManagerButtonList = (setActiveView: any) => [
  {
    label: "Track couriers",
    onClick: () => setActiveView(() => CouriersCurrentPosition),
  },

  {
    label: "Assign packages",
    onClick: () =>
      setActiveView(() => () => (
        <DeliveryRequestAssignments
          getPackageList={getPickedUpPackages}
          getRecipientList={getAssignedCouriers}
          assignFunction={AssignPackage}
          recipientLabel="👤 Courier"
          type="📦 Package #"
        />
      )),
  },

  {
    label: "Pick-up Requests",
    onClick: () =>
      setActiveView(() => () => (
        <DeliveryRequestAssignments
          getPackageList={getPickUpRequests}
          getRecipientList={getAssignedCouriers}
          assignFunction={AssignPackage}
          recipientLabel="👤 Courier"
          type="📍 Pick-up #"
        />
      )),
  },

  {
    label: "Transfer Package to another station",
    onClick: () =>
      setActiveView(() => () => (
        <DeliveryRequestAssignments
          getPackageList={getPickedUpPackages}
          getRecipientList={getManagers}
          assignFunction={AssignPackage}
          recipientLabel="🏢 Manager"
          type="📦 Package #"
        />
      )),
  },

  {
    label: "Resolve Complaints",
    onClick: () => setActiveView(() => ResolveComplaints),
  },

  {
    label: "Send invoices",
    onClick: () => setActiveView(() => SendInvoices),
  },

  {
    label: "Add official account",
    onClick: () => setActiveView(() => CreateOfficialAccounts),
  },
];
import AssignPackages from "./AssignPackages";
import CouriersCurrentPosition from "./CouriersCurrentPosition";
import CreateOfficialAccounts from "./CreateOfficialAccounts";
import PickupRequests from "./PickupRequests";
import ResolveComplaints from "./ResolveComplaints";
import SendInvoices from "./SendInvoices";

export const getManagerButtonList = (setActiveView) => [
  {
    label: "Track couriers",
    onClick: () => setActiveView(() => CouriersCurrentPosition),
  },
  {
    label: "Assign packages",
    onClick: () => setActiveView(() => AssignPackages),
  },
  {
    label: "Pick-up Requests",
    onClick: () => setActiveView(() => PickupRequests),
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
    label: "Add courier account",
    onClick: () => setActiveView(() => CreateOfficialAccounts),
  },
];

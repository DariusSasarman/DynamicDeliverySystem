import CouriersCurrentPosition from "./CouriersCurrentPosition";
import CreateOfficialAccounts from "./CreateOfficialAccounts";
import ResolveComplaints from "./ResolveComplaints";
import SendInvoices from "./SendInvoices";
import DeliveryRequestAssignments from "./DeliveryRequestAssignments";
import { getPickedUpPackages, getPickUpRequests } from "../../../utils/ClientRequests/ManagerApiCalls";
export const getManagerButtonList = (setActiveView) => [
  {
    label: "Track couriers",
    onClick: () => setActiveView(() => CouriersCurrentPosition),
  },
  {
  label: "Assign packages",
  onClick: () =>
    setActiveView(() => () => (
      <DeliveryRequestAssignments getPackageList={getPickedUpPackages} type="📦 Package #" />
    )),
},
{
  label: "Pick-up Requests",
  onClick: () =>
    setActiveView(() => () => (
      <DeliveryRequestAssignments getPackageList={getPickUpRequests} type="📍 Pick-up #" />
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
    label: "Add courier account",
    onClick: () => setActiveView(() => CreateOfficialAccounts),
  },
];

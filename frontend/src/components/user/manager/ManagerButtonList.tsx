import AssignPackages from "./AssignPackages";
import CouriersCurrentPosition from "./CouriersCurrentPosition";

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
    onClick: () => setActiveView(() => () => <div></div>),
  },
  {
    label: "Review Complaints",
    onClick: () => setActiveView(() => () => <div></div>),
  },
  {
    label: "Send invoices",
    onClick: () => setActiveView(() => () => <div></div>),
  },
  {
    label: "Add courier account",
    onClick: () => setActiveView(() => () => <div></div>),
  },
];

import PackagesStatus from "./PackagesStatus";
import ConfirmDelivery from "./ConfirmDelivery";
import PlaceDelivery from "./PlaceDelivery";
import Schedule from "./Schedule";

export const getBasicButtonList = (setActiveView) => [
    {
        label: "Packages Status",
        onClick: () => setActiveView(() => PackagesStatus)
    },
    {
        label: "Confirm Delivery",
        onClick: () => setActiveView(() => ConfirmDelivery)
    },
    {
        label: "Place an order",
        onClick: () => setActiveView(() => PlaceDelivery)
    },
    {
        label: "My account (schedule)",
        onClick: () => setActiveView(() =>  Schedule)
    },
    {
        label: "File a complaint",
        onClick: () => setActiveView(() => ()=><div>
            "Package damaged"
            "Not ariving"
            "Extra details pls"
        </div>)
    }
];

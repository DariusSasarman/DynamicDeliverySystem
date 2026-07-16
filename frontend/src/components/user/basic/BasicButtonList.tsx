import PackagesStatus from "./PackagesStatus";

export const getBasicButtonList = (setActiveView) => [
    {
        label: "Packages Status",
        onClick: () => setActiveView(() => PackagesStatus)
    },
    {
        label: "Place an order",
        onClick: () => setActiveView(() => ()=> <div>
            Pick-up point is inferred from schedule.
            Delivery point is inferred from recipient email.
        </div>)
    },
    {
        label: "My account (schedule)",
        onClick: () => setActiveView(() => ()=> <div>
            There should be a fast "single address" option.
            Though, it should be secondary, 
        </div>)
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

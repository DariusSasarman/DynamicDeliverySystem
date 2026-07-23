import CouriersCurrentPosition from "./CouriersCurrentPosition";

export const getManagerButtonList = (setActiveView) =>[
    {
        label: "Track couriers",
        onClick: () => setActiveView(() => CouriersCurrentPosition)
    },
    {
        label: "Assign packages",
        onClick: () => setActiveView(() => ()=> <div> </div>)
    },
    {
        label: "Pick-up Requests",
        onClick: () => setActiveView(() => ()=> 
        <div>
            Can be "delivery" or "pick-up".
            "Pick-up"s must be routed 
            either to a different warehouse manager,
            either to a client.
        </div>)
    },
    {
        label: "Review Complaints",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Send invoices",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Add courier account",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
];

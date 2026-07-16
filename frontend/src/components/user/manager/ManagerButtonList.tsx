
export const getManagerButtonList = (setActiveView) =>[
    {
        label: "Resolve Requests",
        onClick: () => setActiveView(() => ()=> 
        <div>
            Can be "delivery" or "pick-up".
            "Pick-up"s must be routed 
            either to a different warehouse manager,
            either to a client.
        </div>)
    },
    {
        label: "Track carriers",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Resolve Complaints",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Send invoices",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
];

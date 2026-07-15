
export const getDeliveryButtonList = (setActiveView ) =>[
    {
        label: "View nearest destination",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Confirm assignments",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Finish delivery",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Review Assignemnts",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    
];

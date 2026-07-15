
export const getManagerButtonList = (setActiveView) =>[
    {
        label: "Resolve Requests",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Check status of requests",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Resolve Complaints",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "View nearest assignment",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Send invoices",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
];

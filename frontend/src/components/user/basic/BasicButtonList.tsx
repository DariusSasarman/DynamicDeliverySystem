export const getBasicButtonList = (setActiveView) => [
    {
        label: "Status",
        onClick: () => setActiveView(() => () => <div>Delivery Status</div>)
    },
    {
        label: "Confirm a delivery",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Place an order",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "File a complaint",
        onclick: () => setActiveView(() => ()=><div></div>)
    },
    {
        label: "My account (schedule)",
        onClick: () => setActiveView(() => ()=> <div></div>)
    }
];

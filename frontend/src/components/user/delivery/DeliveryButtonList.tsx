
export const getDeliveryButtonList = (setActiveView ) =>[
    {
        label: "Next destination",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Finish delivery",
        onClick: () => setActiveView(() => ()=> 
            <div> 
                Generates a qr code that opens a link on client's phone. 
                If credentials match, then it's delivered.
            </div>)
    },
    {
        label: "Confirm assignments",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    {
        label: "Review Current Assignments",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    
];

import ViewNearestDelivery from "./ViewNearestDelivery";

export const getDeliveryButtonList = (setActiveView ) =>[
    {
        label: "Next destination",
        onClick: () => setActiveView(() => ViewNearestDelivery)
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
        label: "Review Current Assignments",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    
];

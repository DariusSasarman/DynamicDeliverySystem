import FinishDelivery from "./FinishDelivery";
import ViewNearestDelivery from "./ViewNearestDelivery";

export const getDeliveryButtonList = (setActiveView ) =>[
    {
        label: "Next destination",
        onClick: () => setActiveView(() => ViewNearestDelivery)
    },
    {
        label: "Finish delivery",
        onClick: () => setActiveView(() => FinishDelivery)
    },
    {
        label: "Review Current Assignments",
        onClick: () => setActiveView(() => ()=> <div></div>)
    },
    
];

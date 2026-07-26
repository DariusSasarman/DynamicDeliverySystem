import { useEffect, useState } from "react";
import { AccountTypes } from "../../utils/InternalUtils";
import "../../App.css"
import MyHeader from "./MyHeader"
import Sidebar from "./SideBarMenu";
import { getBasicButtonList } from "../user/basic/BasicButtonList";
import { getManagerButtonList } from "../user/manager/ManagerButtonList";
import { getDeliveryButtonList } from "../user/delivery/DeliveryButtonList";
import NoneView from "../user/none/NoneView";
import WelcomeView from "./WelcomeView";
import InvoiceView from "./InvoiceView";
import { getInvoiceCount } from "../../utils/ClientRequests/HeaderApiCalls";
import { getStoredEmail } from "../../utils/InternalUtils";

function GeneralView({accountState})
{
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [shownSidebar, setShowSidebar] = useState(false);
    
    useEffect(() => {
        const fetchInvoiceCount = async () => {
            try {
                const count = await getInvoiceCount(getStoredEmail());
                setInvoiceCount(count);
            } catch (error) {
                console.error("Failed to fetch invoice count", error);
            }
        };
        if (accountState !== AccountTypes.NONE) {
            fetchInvoiceCount();
        }
    }, [accountState]); 

    const [ActiveComponent, setActiveComponent] = useState(() => WelcomeView);
    
    const goToHome = () => {
        setActiveComponent(() => WelcomeView)
        setShowSidebar(false);
    };

    const showSidemenu = () => {
        setShowSidebar(true);
    };

    const BUTTONS_MAP: Record<AccountTypes, any> = {
        [AccountTypes.BASIC]: getBasicButtonList(setActiveComponent),
        [AccountTypes.DELIVERY]: getDeliveryButtonList(setActiveComponent),
        [AccountTypes.MANAGER]: getManagerButtonList(setActiveComponent),
        [AccountTypes.NONE]: [],
    };

    const buttons = BUTTONS_MAP[accountState] || [];
    const topThreeButtons = buttons.slice(0, 3);
    
    if(accountState == AccountTypes.NONE)
    {
        return(
            <NoneView></NoneView>
        );
    }

    return (
        <>
        <MyHeader
            goToHome={goToHome}
            showSidemenu={() => showSidemenu()}
            invoiceCount={invoiceCount}
            invoiceMenu={()=> setActiveComponent(() => InvoiceView)}
        ></MyHeader>
        <div className="main-content">
            <ActiveComponent />
        
        {ActiveComponent === WelcomeView && (
        topThreeButtons.map((btn, index) => (
        <button
        key={index}
        onClick={btn.onClick}
        >
        {btn.label}
        </button>
        ))
        )}
        </div>
        <Sidebar
            buttons = {buttons}
            isOpen = {shownSidebar}
            onClose= {() => setShowSidebar(false)}
        ></Sidebar>
        </>
    );
}

export default GeneralView;
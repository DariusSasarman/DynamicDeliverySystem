import { useState } from "react";
import { AccountTypes } from "../../utils/InternalUtils";
import "../../App.css"
import MyHeader from "./MyHeader"
import Sidebar from "./SideBarMenu";
import { getBasicButtonList } from "../user/basic/BasicButtonList";
import { getManagerButtonList } from "../user/manager/ManagerButtonList";
import { getDeliveryButtonList } from "../user/delivery/DeliveryButtonList";
import NoneView from "../user/none/NoneView";
function GeneralView({accountState})
{
    const HOME_MAP : Record<AccountTypes, any> = {
        [AccountTypes.BASIC]: () => () => <div> Welcome Basic User!</div>,
        [AccountTypes.DELIVERY]: () => () => <div> Welcome Delivery User!</div>,
        [AccountTypes.MANAGER]: () => () => <div>Welcome Manager User!</div>,
        [AccountTypes.NONE]: () => () => <div> You shouldn't see this...</div>,
    };

    const [shownSidebar, setShowSidebar] = useState(false);
    
    const [ActiveComponent, setActiveComponent] = useState(HOME_MAP[accountState]);
    
    const goToHome = () => {
        setActiveComponent(HOME_MAP[accountState])
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

    const buttons = BUTTONS_MAP[accountState] || null;
    
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
        ></MyHeader>
        <div className="main-content">
            <ActiveComponent/>
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
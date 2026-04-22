import "./App.css";
import { AccountTypes } from "./utils/InternalUtils";
import { getTargetState } from "./utils/ApiCalls";
import UserView from "./components/user/basic/UserView";
import DeliveryView from "./components/user/delivery/DeliveryView";
import ManagerView from "./components/user/manager/ManagerView";
import NoneView from "./components/user/none/NoneView";
import { useEffect, useState } from "react";

const VIEW_MAP: Record<AccountTypes, React.ComponentType> = {
  [AccountTypes.BASIC]: UserView,
  [AccountTypes.DELIVERY]: DeliveryView,
  [AccountTypes.MANAGER]: ManagerView,
  [AccountTypes.NONE]: NoneView,
};
function App() {
  const [accountState, setAccountState] = useState<AccountTypes | null>(null);

  useEffect(() => {
    const initSite = async () => {
      const state = await getTargetState();
      setAccountState(state);
    };
    initSite();
  }, []);

  if (accountState === null) {
    return <div className="app-container">Loading...</div>;
  }

  const ComponentToRender = VIEW_MAP[accountState] || NoneView;

  return (
    <div className="app-container">
      <ComponentToRender />
    </div>
  );
}

export default App;
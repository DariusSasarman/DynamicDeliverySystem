import "./App.css";
import { AccountTypes, getTargetState } from "./utils/utils";
import UserView from "./components/user/basic/UserView"
import DeliveryView from "./components/user/delivery/DeliveryView"
import ManagerView from "./components/user/manager/ManagerView";
import NoneView from "./components/user/none/NoneView";

const VIEW_MAP: Record<AccountTypes, React.ComponentType> = {
  [AccountTypes.BASIC]: UserView,
  [AccountTypes.DELIVERY]: DeliveryView,
  [AccountTypes.MANAGER]: ManagerView,
  [AccountTypes.NONE]: NoneView,
};

function App() {
  const accountState = getTargetState();

  const CurrentView = VIEW_MAP[accountState] || NoneView;

  return <CurrentView />;
}

export default App;

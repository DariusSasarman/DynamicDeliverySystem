import "./App.css";
import { AccountTypes } from "./utils/InternalUtils";
import { getTargetState } from "./utils/ApiCalls";
import { useEffect, useState } from "react";
import GeneralView from "./components/general/GeneralView"; // Your new orchestrator component

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

  return (
    <div className="app-container">
      <GeneralView accountState={accountState} />
    </div>
  );
}

export default App;
import "./App.css";
import MyHeader from "./components/MyHeader";
import { AccountTypes, getTargetState } from "./utils/utils";

function App() {
  /**
   * Header Config session
   * I'll use later when I have to
   */

  const goToHome = () => {};
  const showSidemenu = () => {};
  const accountState = getTargetState();

  const buttonConfigs = {
    [AccountTypes.BASIC]: {
      labels: [
        "Check packets status",
        "Request a delivery",
        "Share Available schedule",
      ],
      actions: [() => alert("Upgrade!"), () => {}, () => {}],
    },
    [AccountTypes.DELIVERY]: {
      labels: ["View nearest package", "Deliver Package", "Report Issue"],
      actions: [() => {}, () => {}, () => {}],
    },
    [AccountTypes.MANAGER]: {
      labels: [
        "Assign package to courier",
        "Check Package Status",
        "Review Issues",
      ],
      actions: [() => {}, () => {}, () => {}],
    },
    [AccountTypes.NONE]: {
      labels: ["Sign In", "Sign Up", "Request Assistance"],
      actions: [() => {}, () => {}, () => {}],
    },
  };

  if (accountState === AccountTypes.NONE) {
    return <>Sign up!</>;
  }
  
  return (
    <>
      <MyHeader
        button1={
          <button onClick={buttonConfigs[getTargetState()].actions[0]}>
            {buttonConfigs[getTargetState()].labels[0]}
          </button>
        }
        button2={
          <button onClick={buttonConfigs[getTargetState()].actions[1]}>
            {buttonConfigs[getTargetState()].labels[1]}
          </button>
        }
        button3={
          <button onClick={buttonConfigs[getTargetState()].actions[2]}>
            {buttonConfigs[getTargetState()].labels[2]}
          </button>
        }
        goToHome={goToHome}
        showSidemenu={showSidemenu}
      ></MyHeader>
    </>
  );
}

export default App;

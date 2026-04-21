import "../../../App.css";
import MyHeader from "../../general/MyHeader";

function DeliveryView() {

  const goToHome = () => {};
  const showSidemenu = () => {};

  const buttonConfigs =  {
      labels: ["View nearest package", "Deliver Package", "Report Issue"],
        actions: [() => {}, () => {}, () => {}],
  };
  
  return (
    <>
      <MyHeader
        button1={
          <button onClick={buttonConfigs.actions[0]}>
            {buttonConfigs.labels[0]}
          </button>
        }
        button2={
          <button onClick={buttonConfigs.actions[1]}>
            {buttonConfigs.labels[1]}
          </button>
        }
        button3={
          <button onClick={buttonConfigs.actions[2]}>
            {buttonConfigs.labels[2]}
          </button>
        }
        goToHome={goToHome}
        showSidemenu={showSidemenu}
      ></MyHeader>
    </>
  );
}

export default DeliveryView;

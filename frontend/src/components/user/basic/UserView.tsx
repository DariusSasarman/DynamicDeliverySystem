import "../../../App.css";
import MyHeader from "../../general/MyHeader";

function UserView() {

  const goToHome = () => {};
  const showSidemenu = () => {};

  const buttonConfigs =  {
      labels: [
        "Check packets status",
        "Request a delivery",
        "Share Available schedule",
      ],
      actions: [() => alert("Upgrade!"), () => {}, () => {}],
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

export default UserView;

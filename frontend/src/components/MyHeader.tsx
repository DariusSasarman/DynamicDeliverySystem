import "./MyHeader.css"

function MyHeader({ button1, button2, button3, goToHome, showSidemenu }) {
  return (
    <>
      <div className="header">
        <img
          style={{ height: "90%", marginLeft: "10px" }}
          src="/src/assets/logo.png"
          onClick={goToHome}
        ></img>
        <button onClick={button1.onClick}> {button1.props.children} </button>
        <button onClick={button2.onClick}> {button2.props.children} </button>
        <button onClick={button3.onClick}> {button3.props.children}</button>
        <img
          className="menuButton"
          src="/src/assets/menu.png"
          onClick={showSidemenu}
        ></img>
      </div>
    </>
  );
}

export default MyHeader;
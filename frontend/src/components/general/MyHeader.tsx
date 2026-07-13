import "./MyHeader.css"
import "../../App.css"
function MyHeader({ goToHome, showSidemenu }) {


  return (
    <>
      <div className="header">
        <img
          style={{ height: "90%", marginLeft: "10px" }}
          src="/src/assets/logo.png"
          onClick={goToHome}
        ></img>
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
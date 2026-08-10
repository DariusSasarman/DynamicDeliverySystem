import "./MyHeader.css";
import "../../App.css";
import logo from "/src/assets/logo.png";
import menu from "/src/assets/menu.png";
function MyHeader({ goToHome, showSidemenu, invoiceCount, invoiceMenu }) {
  return (
    <>
      <div className="header">
        <img
          style={{ height: "90%", marginLeft: "10px" }}
          src={logo}
          onClick={goToHome}
        ></img>
        {invoiceCount > 0 && (
          <div className="invoice-badge" onClick={invoiceMenu}>
            {invoiceCount}
          </div>
        )}
        <img
          className="menuButton"
          src={menu}
          onClick={showSidemenu}
        ></img>
      </div>
    </>
  );
}

export default MyHeader;

import "./MyHeader.css";
import "../../App.css";
function MyHeader({ goToHome, showSidemenu, invoiceCount, invoiceMenu }) {
  /// invoices
  return (
    <>
      <div className="header">
        <img
          style={{ height: "90%", marginLeft: "10px" }}
          src="/src/assets/logo.png"
          onClick={goToHome}
        ></img>
        {invoiceCount > 0 && (
          <div className="invoice-badge" onClick={invoiceMenu}>
            {invoiceCount}
          </div>
        )}
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

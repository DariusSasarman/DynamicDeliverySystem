import { useState } from "react";
import "../../../App.css";
import "./NoneView.css";
import { submitLogin, submitRegistration } from "../../../utils/LoginApiCalls";

function NoneView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [shouldRegister, setShouldRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const checkLoginEmail = (password) => {
    setEmail(password);
  };

  const checkLoginPassword = (password) => {
    setPassword(password);
  };

  const loginOnClick = async () => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email!");
    } else if (!passwordRegex.test(password)) {
      setErrorMessage("Invalid password!");
    } else {
      try{
      setErrorMessage("");
      const result = await submitLogin(email,password);
      if(!result.ok)
      {
        setErrorMessage("Couldn't process request");
      }
      else
      {
        setErrorMessage("Request processed successfully");
        window.location.reload();
      }
    } catch(error){
      setErrorMessage("A network error occurred. Please try again.");
    }
    }
  };

  const switchToRegister = () => {
    setErrorMessage("");
    setShouldRegister(!shouldRegister);
  };

  const checkConfirmationPassword = (password) => {
    setPassword2(password);
  };

  const registerAccountOnclick = async () => {
    if (password !== password2) {
      setErrorMessage("Passwords don't match!");
    } else if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email!");
    } else if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password should : \n 1. Have at least 8 characters. \n 2. Contain at least an uppercase and lowercase character \n 3. At least one digit \n 4. At least one special character @$!%*?&\n",
      );
    } else {
      try{
      setErrorMessage("");
      const result = await submitRegistration(email,password);
      if(!result.ok)
      {
        setErrorMessage("Couldn't process request");
      }
      else
      {
        setErrorMessage("Request processed successfully");
        window.location.reload();
      }
    } catch(error){
      setErrorMessage("A network error occurred. Please try again.");
    }
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  return (
    <>
      {errorMessage && (
          <div
            style={{
              color: "white",
              fontSize: "12px",
              margin: "5px",
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: "20px",
              backgroundColor: "#222f68",
              whiteSpace: "pre-line",
              zIndex: 1000,
            }}
          >
          <div style={{ margin: "10px", flexDirection: "row" }}>
            {" "}
            {errorMessage}{" "}
            <button
              style={{ width: "10px", color: "black" }}
              onClick={clearErrorMessage}
            >x
            </button>
          </div>
        </div>
      )}
      {shouldRegister ? (
        <div className="loginForm">
          <img
            src="/src/assets/logo.png"
            style={{
              alignSelf: "center",
              minHeight: "200px",
              minWidth: "200px",
              height: "25vh",
              width: "25vh",
            }}
          ></img>

          <div style={{ color: "#222f68" }}>
            Please enter your desired credentials
          </div>
          <input
            type="email"
            onChange={(e) => checkLoginEmail(e.target.value)}
            placeholder="Enter your email"
          ></input>
          <input
            type="password"
            onChange={(e) => checkLoginPassword(e.target.value)}
            placeholder="Enter password"
          ></input>
          <input
            type="password"
            onChange={(e) => checkConfirmationPassword(e.target.value)}
            placeholder="Confirm Password"
          ></input>
          <button onClick={registerAccountOnclick}>Create account</button>
          <button onClick={switchToRegister}>Go back</button>
        </div>
      ) : (
        <div className="loginForm">
          <img
            src="/src/assets/logo.png"
            style={{
              alignSelf: "center",
              minHeight: "200px",
              minWidth: "200px",
              height: "25vh",
              width: "25vh",
            }}
          ></img>
          <div style={{ color: "#222f68" }}>Please enter your credentials</div>
          <input
            type="email"
            onChange={(e) => checkLoginEmail(e.target.value)}
            placeholder="Enter email"
          ></input>
          <input
            type="password"
            onChange={(e) => checkLoginPassword(e.target.value)}
            placeholder="Enter password"
          ></input>
          <button onClick={loginOnClick}>Login</button>
          <button onClick={switchToRegister}>Register</button>
        </div>
      )}
    </>
  );
}

export default NoneView;

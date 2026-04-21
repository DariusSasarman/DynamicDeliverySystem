import { useState } from "react";
import "../../../App.css";
import "./NoneView.css"
function NoneView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [shouldRegister, setShouldRegister] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  const checkLoginEmail = (password) => {
    password.preventDefault();
    setEmail(password);
    if (emailRegex.test(password)) {
      console.log("Valid email!");
    }
  };
  
  const checkLoginPassword = (password) => {
    password.preventDefault();
    setPassword(password);
  }

  const loginOnClick = () => {
    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      
    }
    else
    {
      
    }
  }

  const switchRegister = () => {
    setShouldRegister(!shouldRegister);
  }

  const checkConfirmationPassword = (password) => {
    password.preventDefault();
    setPassword2(password);
  }

  const registerAccountOnclick = () => {
    if (!emailRegex.test(email) || !passwordRegex.test(password) || !passwordRegex.test(password2)) {
      
    }
    else
    {

    }
  }

  return (
    <>
      {
      shouldRegister? 
      
      <div className="loginForm">
        <img src="/src/assets/logo.png" 
        style={{
          alignSelf:"center",
          minHeight:"200px",
          minWidth:"200px",
          height:"25vh",
          width:"25vh",
        }}></img>

        <div style={{color:"#222f68"}}>Please enter your desired credentials</div>
        <input 
          type="text" 
          onChange={(e) => checkLoginEmail(e.target.value)} 
          placeholder="Enter your email">
        </input>
        <input
          type="password"
          onChange={(e) => checkLoginPassword(e.target.value)}
          placeholder="Enter password"
        >
        </input>
        <input
          type="password"
          onChange={(e) => checkConfirmationPassword(e.target.value)}
          placeholder="Enter password again"
        >
        </input>
        <button onClick={registerAccountOnclick}>Create account</button>
        <button onClick={switchRegister}>Go back</button>
      </div>
          
      :
      <div className="loginForm">
        <img src="/src/assets/logo.png" 
        style={{
          alignSelf:"center",
          minHeight:"200px",
          minWidth:"200px",
          height:"25vh",
          width:"25vh",
        }}></img>
        <div style={{color:"#222f68"}}>Please enter your credentials</div>
        <input 
          type="text" 
          onChange={(e) => checkLoginEmail(e.target.value)} 
          placeholder="Enter email">
        </input>
        <input
          type="password"
          onChange={(e) => checkLoginPassword(e.target.value)}
          placeholder="Enter password"
        >
        </input>
        <button onClick={loginOnClick}>Login</button>
        <button onClick={switchRegister}>Register</button>
      </div>
      }
    </>
  );
}

export default NoneView;

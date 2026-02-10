import { useState } from "react";
import { login } from "../api/auth.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    await login(email,password);
    onLogin();
  };

  return(
    <form onSubmit={handleSubmit}>
      <h2>
        Admin Login
      </h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  )

}

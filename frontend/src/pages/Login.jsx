import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response = await API.post("/login", {
        email,
        password
      });

      alert(response.data.message);

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);
      alert(error.response?.data?.message || error.message);

    }

  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px gray"
        }}
      >
        <h2 style={{ textAlign: "center" }}>💰 SpendWise</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;
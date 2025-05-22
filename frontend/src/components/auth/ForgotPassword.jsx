import { useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext, AuthProvider } from "../../contexts/AuthContext";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await api.put("/auth/forgetPassword", { email });
      setMsg(res.data.message || "Check your email for reset instructions.");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
    }
  };

  function handleLogout(setUser) {
    api.post("/auth/logOut").finally(() => {
      setUser(null);
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      <button onClick={() => handleLogout(setUser)}>Logout</button>
    </>
  );
}

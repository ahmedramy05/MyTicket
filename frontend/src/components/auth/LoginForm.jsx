import { useState, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../contexts/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Login</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}
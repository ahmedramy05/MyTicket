import { useState } from "react";
import api from "../../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post("/auth/register", form);
      setSuccess("Registration successful! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Register</button>
      {error && <div style={{color:"red"}}>{error}</div>}
      {success && <div style={{color:"green"}}>{success}</div>}
    </form>
  );
}

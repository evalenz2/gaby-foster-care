// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase"; // Fixed path: go up 3 levels to the root
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Login
      </button>
    </form>
  );
}
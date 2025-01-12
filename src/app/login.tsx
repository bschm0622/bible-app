// /app/login.tsx
"use client"; // Ensure that this file is run on the client side

import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import the custom AuthContext hook

const LoginPage = () => {
  const { signIn } = useAuth(); // Destructure signIn from the context
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password
  const [error, setError] = useState(""); // State to store any error message
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      await signIn(email, password); // Call the signIn function from AuthContext
    } catch (error: any) {
      setError(error.message); // Set the error message if signIn fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => se

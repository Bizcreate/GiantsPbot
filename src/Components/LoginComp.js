import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import signIn from "../firebase/auth/signin";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const LoginComp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { result, error } = await signIn(email, password);

      if (error) {
        throw new Error(error);
      }

      // Check admin role from admin collection
      const db = getFirestore();
      const adminRef = doc(db, "admin", result.user.uid);
      const adminDoc = await getDoc(adminRef);

      if (adminDoc.exists()) {
        toast.success("Login successful!");
        navigate("/dashboardAdx/stats");
      } else {
        toast.error("Access denied: Admins only");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cards">
      <div className="bg-cards3 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-primary text-2xl font-Cerebri mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-secondary mb-2 font-Cerebri"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cards2 text-primary p-3 rounded-lg border border-borders2 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-secondary mb-2 font-Cerebri"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cards2 text-primary p-3 rounded-lg border border-borders2 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-Cerebri py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-secondary mt-4">
            Don't have an admin account?{" "}
            <Link
              to="/dashboardAdx/signup"
              className="text-accent hover:text-accent/90"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginComp;

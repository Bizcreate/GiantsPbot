import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create admin document in Firestore
      await setDoc(doc(db, "admin", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      toast.success("Admin account created successfully!");
      navigate("/dashboardAdx");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cards">
      <div className="bg-cards3 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-primary text-2xl font-Cerebri mb-6 text-center">
          Admin Sign Up
        </h2>

        {error && (
          <div className="bg-accent/20 text-accent p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-accent hover:bg-accent/90 text-white font-Cerebri py-3 px-4 rounded-lg transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-center text-secondary mt-4">
            Already have an admin account?{" "}
            <Link
              to="/dashboardlogin"
              className="text-accent hover:text-accent/90"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminSignUp;

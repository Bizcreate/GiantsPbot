import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { getRank } from "../../constants/ranks";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get referral ID from URL query params
  const [referralId, setReferralId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralId(ref);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Sign up with referral data
      await signUp(email, password, {
        fullName,
        role: "user",
        lastLoginAt: new Date().toISOString(),
        balance: referralId ? 5000 : 1000, // Give 5000 coins if referred
        refBy: referralId || null, // Store referral information
        rank: referralId ? getRank(5000) : getRank(1000),
      });

      // Show success message with referral bonus if applicable
      if (referralId) {
        toast.success(
          "Welcome! You've received 5000 coins as a referral bonus! 🎉"
        );
      } else {
        toast.success("Account created successfully!");
      }

      navigate("/app");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 bg-cards"
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-cards3 rounded-xl shadow-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center text-primary mb-2">
            Create Account
          </h2>
          <p className="text-secondary text-center mb-8">
            Sign up to get started
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-primary block text-sm font-medium mb-2">
              Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-borders2 rounded-lg bg-cards focus:outline-none focus:border-accent transition-colors text-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="text-primary block text-sm font-medium mb-2">
              Email Address
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-borders2 rounded-lg bg-cards focus:outline-none focus:border-accent transition-colors text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="text-primary block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-borders2 rounded-lg bg-cards focus:outline-none focus:border-accent transition-colors text-white    "
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium 
              ${loading ? "bg-accent/50" : "bg-accent hover:bg-accent/90"} 
              transition-all duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignUp;

import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser, signInWithGoogle } from "../services/firebaseService";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";

const SignUp = () => {
    const [form, setForm] = useState({
        displayName: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerUser(form.displayName, form.email, form.password);
            navigate("/signin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            await signInWithGoogle();
            navigate("/");
        } catch (error) {
            dispatch(setError(error.message));
            setError(error.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen fixed left-0 right-0 top-0 z-[100] flex items-center bg-gray-100 justify-center p-4">
            <motion.div
                className="w-full relative max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Link to="/" className="absolute right-3 top-3 flex items-center justify-center mb-4">
                    <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700 duration-500" />
                </Link>

                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-center mb-6 text-gray-700"
                >
                    Create Your Account
                </motion.h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ y: 40 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                    >
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4"
                    >
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6"
                    >
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-sm text-blue-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </motion.button>
                </motion.form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {googleLoading ? (
                        <div className="w-5 h-5 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
                    ) : (
                        <FcGoogle className="w-5 h-5" />
                    )}
                    {googleLoading ? "Signing up..." : "Continue with Google"}
                </button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-center"
                >
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default SignUp;

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            await sendPasswordResetEmail(firebaseAuth, email);
            setSuccessMessage("Check your inbox for the password reset link.");
            setEmail(""); // Reset the email field
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
                initial={{ y: -40 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Forgot Password?</h2>
                <p className="text-center text-sm text-gray-500">
                    Enter your email to receive a password reset link
                </p>

                {error && (
                    <motion.div
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {error}
                    </motion.div>
                )}

                {successMessage && (
                    <motion.div
                        className="bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {successMessage}
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </motion.button>
                </motion.form>

                <p className="text-center text-sm text-gray-500">
                    Remembered your password?{" "}
                    <Link to="/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ForgotPassword;

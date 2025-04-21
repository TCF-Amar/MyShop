import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser, signInWithGoogle } from "../services/firebaseService";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../redux/features/userSlice";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            navigate("/");

        } catch (error) {
            dispatch(setError(error.message));
        }
        finally {
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
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <div className="min-h-screen fixed left-0 right-0 top-0 z-[100] flex items-center justify-center bg-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full relative max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
            >
                <Link to="/" className=" absolute right-3 top-3  flex items-center justify-center mb-4">
                    <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700 duration-500" />
                </Link>
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-center text-gray-800"
                >
                    Welcome Back
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-sm text-gray-500"
                >
                    Login to your shopping account
                </motion.p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-sm text-blue-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password.message}</p>
                        )}
                    </motion.div>

                    <motion.button
                        type="button"
                        className="text-sm text-blue-500 hover:underline"
                        onClick={() => navigate("/forgot-password")}
                        whileTap={{ scale: 0.95 }}
                    >
                        Forgot Password?
                    </motion.button>

                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all duration-300"
                    >
                        {loading ? "Signing up..." : "Sign In"}
                    </motion.button>
                </form>
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
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                </button>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-gray-500"
                >
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default SignIn;

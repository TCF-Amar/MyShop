import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';

export default function MobileMenu({ isOpen, setIsOpen, handleSignout }) {
    const user = useSelector((state) => state.user.user);

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[102] md:hidden">
            <DialogBackdrop
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30"
            />

            <div className="fixed inset-0 overflow-hidden">
                <DialogPanel
                    as={motion.div}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-full max-w-[280px] bg-white shadow-xl"
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Info */}
                        {user ? (
                            <div className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <User className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
                                    )}
                                    <div>
                                        <p className="font-medium">{user.displayName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border-b">
                                <Link
                                    to="/signin"
                                    className="block w-full py-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            <NavLink
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/search"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                Products
                            </NavLink>
                            {user?.role === 'admin' && (
                                <NavLink
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    Admin
                                </NavLink>
                            )}
                        </nav>

                        {/* User Actions */}
                        {user && (
                            <div className="border-t p-4 space-y-2">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    Orders
                                </Link>
                                <button
                                    onClick={() => {
                                        handleSignout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
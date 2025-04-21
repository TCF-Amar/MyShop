import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEdit, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UpdateProfile from '../components/UpdateProfile';
import AddAddress from '../components/AddAddress';
import { removeUserAddress } from '../services/firebaseService';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import { setUser, removeAddress } from '../redux/features/userSlice';
import toast from 'react-hot-toast';

function Profile() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Listen for real-time updates to user data
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = onSnapshot(
            doc(firestore, "users", user.uid),
            (doc) => {
                if (doc.exists()) {
                    dispatch(setUser({ ...doc.data(), uid: doc.id }));
                }
            },
            (error) => {
                console.error("Error listening to user updates:", error);
                toast.error("Failed to get latest user data");
            }
        );

        return () => unsubscribe();
    }, [user?.uid, dispatch]);

    const handleDeleteAddress = async (addressId) => {
        try {
            // Optimistically update UI
            dispatch(removeAddress(addressId));

            // Then update in Firebase
            await removeUserAddress(addressId, user.addresses);
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
            // Revert the optimistic update by refetching the user data
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                dispatch(setUser({ ...userDoc.data(), uid: userDoc.id }));
            }
        }
    };

    if (!user) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="min-h-[60vh] flex items-center justify-center text-gray-600"
            >
                Please <Link to="/signin" className="text-blue-500 underline ml-1">Sign In</Link> to view your profile.
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div 
            className="mx-auto pt-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence>
                {showUpdateProfile && <UpdateProfile setShowUpdateProfile={setShowUpdateProfile} />}
                {showAddAddress && (
                    <AddAddress
                        onClose={() => setShowAddAddress(false)}
                        onAddressAdded={() => setShowAddAddress(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div 
                variants={itemVariants}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={user.photoURL || "https://i.pravatar.cc/150?img=3"}
                        alt="User"
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                    <div className="flex-1 flex flex-col gap-2">
                        <div className='flex gap-4'>
                            <h2 className="text-xl font-bold">{user.displayName}</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-500 hover:text-blue-600"
                                onClick={() => setShowUpdateProfile(true)}
                            >
                                <FaEdit size={20} />
                            </motion.button>
                        </div>
                        <p className="text-gray-600 hidden md:block">{user.email}</p>
                    </div>
                    <p className="text-gray-600 md:hidden">{user.email}</p>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                    variants={itemVariants}
                    className="bg-white shadow-md rounded-lg p-6"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">My Addresses</h3>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddAddress(true)}
                            className="bg-[#1fd4a7] text-white px-4 py-2 rounded hover:bg-[#16b891] transition-colors"
                        >
                            Add New Address
                        </motion.button>
                    </div>

                    {user.addresses?.length > 0 ? (
                        <motion.div 
                            className="space-y-4"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        >
                            <AnimatePresence>
                                {user.addresses.map((address) => (
                                    <motion.div
                                        key={address.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="border rounded-lg p-4 relative hover:border-[#1fd4a7] transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-[#1fd4a7] mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{address.label}</h4>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                                                        {address.type}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-1">{address.fullAddress}</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                    className="text-red-500 text-sm mt-2 hover:underline"
                                                >
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6 text-gray-500"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FaMapMarkerAlt className="mx-auto text-gray-400 text-3xl mb-2" />
                            </motion.div>
                            <p>No addresses added yet</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddAddress(true)}
                                className="text-[#1fd4a7] hover:underline mt-2"
                            >
                                Add your first address
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="bg-white shadow-md rounded-lg p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-gray-500"
                    >
                        <p>No orders yet</p>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/search"
                                className="text-[#1fd4a7] hover:underline mt-2 inline-block"
                            >
                                Start shopping
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Profile;

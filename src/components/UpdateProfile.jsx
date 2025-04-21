import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateUserProfile } from '../redux/features/userSlice';
import { FaTimes } from 'react-icons/fa';

function UpdateProfile({ setShowUpdateProfile }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        phone: user?.phone || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(updateUserProfile(formData)).unwrap();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
            setShowUpdateProfile(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000000d] bg-opacity-10 z-[100]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-[90%] md:w-1/2 max-w-lg relative shadow-md rounded-lg p-6"
            >
                <FaTimes
                    className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                    size={20}
                    onClick={() => setShowUpdateProfile(false)}
                />
                <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full mt-1 px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full bg-[#1fd4a7] text-white px-4 py-2 rounded hover:bg-[#16b891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default UpdateProfile;

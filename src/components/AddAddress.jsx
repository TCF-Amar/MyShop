import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addUserAddress } from '../services/firebaseService';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addAddress } from '../redux/features/userSlice';

function AddAddress({ onClose, onAddressAdded }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pincode: '',
        state: '',
        city: '',
        street: '',
        landmark: '',
        type: 'home',
        label: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.pincode) newErrors.pincode = 'PIN code is required';
        if (!formData.street) newErrors.street = 'Street address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.type) newErrors.type = 'Address type is required';
        if (!formData.label) newErrors.label = 'Address label is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePinCodeChange = async (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, pincode: value }));

        if (value.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await response.json();
                if (data[0].Status === "Success") {
                    setFormData(prev => ({
                        ...prev,
                        state: data[0].PostOffice[0].State,
                        city: data[0].PostOffice[0].District
                    }));
                    setErrors(prev => ({ ...prev, pincode: '' }));
                } else {
                    setErrors(prev => ({ ...prev, pincode: 'Invalid PIN code' }));
                }
            } catch (error) {
                setErrors(prev => ({ ...prev, pincode: 'Error fetching address details' }));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const fullAddress = `${formData.street}${formData.landmark ? `, ${formData.landmark}` : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
            
            const newAddress = await addUserAddress({
                ...formData,
                fullAddress
            });
            
            // Optimistically update the UI
            dispatch(addAddress(newAddress));
            
            toast.success('Address added successfully');
            onAddressAdded?.();
            onClose();
        } catch (error) {
            toast.error('Error adding address: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes />
                </button>

                <h2 className="text-xl font-semibold mb-6">Add New Address</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code*
                        </label>
                        <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handlePinCodeChange}
                            maxLength={6}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                errors.pincode ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter 6-digit PIN code"
                        />
                        {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address*
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                errors.street ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="House/Flat No., Street, Area"
                        />
                        {errors.street && (
                            <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                        </label>
                        <input
                            type="text"
                            id="landmark"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                            placeholder="Nearby landmark (optional)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="City"
                                readOnly
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State*
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                    errors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="State"
                                readOnly
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Address Type*
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                    errors.type ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="home">Home</option>
                                <option value="office">Office</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                                Address Label*
                            </label>
                            <input
                                type="text"
                                id="label"
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7] ${
                                    errors.label ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="E.g., Home, Office, Mom's house"
                            />
                            {errors.label && (
                                <p className="text-red-500 text-sm mt-1">{errors.label}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#1fd4a7] text-white rounded-md hover:bg-[#16b891] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default AddAddress;
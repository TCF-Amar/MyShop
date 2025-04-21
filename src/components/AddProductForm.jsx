import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { uploadImageToCloudinary } from "../utils/imageUpload"; //uploadImageToCloudinary(file)
import { addProduct, } from "../services/firebaseService";
import { useSelector } from "react-redux";

// Utility function to convert FormData to object
const objectFromFormData = (formData) => {
    const object = {};
    formData.forEach((value, key) => {
        // Parse JSON strings back to objects/arrays
        try {
            object[key] = JSON.parse(value);
        } catch {
            object[key] = value;
        }
    });
    return object;
};

function AddProductForm() {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [discountedPercentage, setDiscountedPercentage] = useState("");
    const [bestseller, setIsBestseller] = useState(false);
    const [loading, setLoading] = useState(false);

    // New state variables for additional details
    const [brand, setBrand] = useState("");
    const [colors, setColors] = useState([]);
    const [material, setMaterial] = useState("");
    const [gender, setGender] = useState("");

    // Add useEffect for calculations
    const [isManualDiscountPrice, setIsManualDiscountPrice] = useState(true);

    // Calculate discounted price when percentage changes
    useEffect(() => {
        if (!isManualDiscountPrice && price && discountedPercentage) {
            const discount = (Number(price) * Number(discountedPercentage)) / 100;
            setDiscountedPrice(Math.floor(Number(price) - discount));
        }
    }, [price, discountedPercentage, isManualDiscountPrice]);

    // Calculate percentage when discounted price changes
    useEffect(() => {
        if (isManualDiscountPrice && price && discountedPrice) {
            const percentage =  ((Number(price) - Number(discountedPrice)) / Number(price)) * 100;
            setDiscountedPercentage( Math.floor(percentage));
        }
    }, [price, discountedPrice, isManualDiscountPrice]);

    // Handle price input changes
    const handlePriceChange = (e) => {
        setPrice(e.target.value);
        // Reset calculations
        if (!e.target.value) {
            setDiscountedPrice("");
            setDiscountedPercentage("");
        }
    };

    // Handle discounted price input changes
    const handleDiscountedPriceChange = (e) => {
        setIsManualDiscountPrice(true);
        setDiscountedPrice(e.target.value);
    };

    // Handle discount percentage input changes
    const handleDiscountPercentageChange = (e) => {
        setIsManualDiscountPrice(false);
        setDiscountedPercentage(e.target.value);
    };

    // Handle image file uploads individually
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (index === 0) {
            setImage1(file);
        } else if (index === 1) {
            setImage2(file);
        } else if (index === 2) {
            setImage3(file);
        } else if (index === 3) {
            setImage4(file);
        }
    };

    // Handle tags changes (comma separated)
    const handleTagsChange = (e) => {
        setTags(e.target.value.split(",").map((item) => item.trim()));
    };

    // Handle size changes (comma separated)
    const handleSizeChange = (e) => {
        setSizes(e.target.value.split(",").map((item) => item.trim()));
    };

    // Handle color changes (comma separated)
    const handleColorChange = (e) => {
        setColors(e.target.value.split(",").map((item) => item.trim()));
    };

    // Handle subcategories changes (comma separated)
    const handleSubcategoriesChange = (e) => {
        setSubcategories(e.target.value.split(",").map((item) => item.trim()));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image1 && !image2 && !image3 && !image4) {
            toast.error("At least one image is required");
            return;
        }

        try {
            setLoading(true);

            // Check if product already exists
         
            // Upload images in parallel
            const uploadPromises = [image1, image2, image3, image4].map((img) =>
                img ? uploadImageToCloudinary(img) : null
            );

            const imageUrls = (await Promise.all(uploadPromises)).filter(
                (url) => url !== null
            );

            if (imageUrls.length === 0) {
                throw new Error("No images were uploaded successfully");
            }

            // Create product data
            const productData = {
                name: productName,
                description,
                price: Number(price),
                discountedPrice: Number(discountedPrice) || null,
                discountedPercentage: Number(discountedPercentage) || null,
                quantity: Number(quantity),
                category,
                subcategories,
                tags,
                sizes,
                bestseller,
                imageUrls,
                brand,
                colors,
                material,
                gender,
            };

            // Add product to Firestore
            await addProduct(productData);
            
            toast.success("Product added successfully!");

            // Reset form
            setProductName("");
            setDescription("");
            setPrice("");
            setDiscountedPrice("");
            setDiscountedPercentage("");
            setQuantity("");
            setCategory("");
            setSubcategories([]);
            setTags([]);
            setSizes([]);
            setIsBestseller(false);
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
            setBrand("");
            setColors([]);
            setMaterial("");
            setGender("");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="w-full py-4 flex flex-col items-start gap-4 overflow-hidden overflow-y-auto pl-1 scrollHide"
            onSubmit={handleSubmit}
        >
            {/* Image Upload Section */}
            <div>
                <p className="mb-2">Upload Images</p>
                <div className="flex gap-2">
                    {/* Image 1 */}
                    <label htmlFor="image1">
                        <div className="w-[50px] my-2 h-[70px] flex justify-center items-center bg-gray-200 border cursor-pointer">
                            {image1 ? (
                                <img
                                    src={URL.createObjectURL(image1)}
                                    alt="Upload image1"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUpload className="text-xl text-gray-600" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image1"
                            hidden
                            onChange={(e) => handleImageChange(e, 0)}
                        />
                    </label>

                    {/* Image 2 */}
                    <label htmlFor="image2">
                        <div className="w-[50px] my-2 h-[70px] flex justify-center items-center bg-gray-200 border cursor-pointer">
                            {image2 ? (
                                <img
                                    src={URL.createObjectURL(image2)}
                                    alt="Upload image1"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUpload className="text-xl text-gray-600" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image2"
                            hidden
                            onChange={(e) => handleImageChange(e, 1)}
                        />
                    </label>

                    {/* Image 3 */}
                    <label htmlFor="image3">
                        <div className="w-[50px] my-2 h-[70px] flex justify-center items-center bg-gray-200 border cursor-pointer">
                            {image3 ? (
                                <img
                                    src={URL.createObjectURL(image3)}
                                    alt="Upload image1"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUpload className="text-xl text-gray-600" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image3"
                            hidden
                            onChange={(e) => handleImageChange(e, 2)}
                        />
                    </label>

                    {/* Image 4 */}
                    <label htmlFor="image4">
                        <div className="w-[50px] my-2 h-[70px] flex justify-center items-center bg-gray-200 border cursor-pointer">
                            {image4 ? (
                                <img
                                    src={URL.createObjectURL(image4)}
                                    alt="Upload image1"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUpload className="text-xl text-gray-600" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image4"
                            hidden
                            onChange={(e) => handleImageChange(e, 3)}
                        />
                    </label>
                </div>
            </div>
            {/* Product Name */}
            <div className="w-full">
                <p className="mb-2">Product Name</p>
                <input
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Brand Name */}
            <div className="w-full">
                <p className="mb-2">Brand Name</p>
                <input
                    type="text"
                    placeholder="Enter brand name"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Product Description */}
            <div className="w-full">
                <p className="mb-2">Product Description</p>
                <textarea
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Price */}
            <div className="w-full">
                <p className="mb-2">Original Price</p>
                <input
                    type="number"
                    placeholder="Enter product price"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Discounted price */}
            <div className="w-full">
                <p className="mb-2">Discounted Price</p>
                <input
                    type="number"
                    placeholder="Enter product discounted price"
                    value={discountedPrice}
                    onChange={handleDiscountedPriceChange}
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
                <p className="text-sm text-gray-500 mt-1">
                    {discountedPrice && price 
                        ? `You're offering a ${discountedPercentage}% discount`
                        : "Enter price and discounted price to see the discount percentage"}
                </p>
            </div>

            {/* discounted percentages  */}
            <div className="w-full">
                <p className="mb-2">Discount Percentage</p>
                <input
                    type="number"
                    placeholder="Enter discount percentage"
                    value={discountedPercentage}
                    onChange={handleDiscountPercentageChange}
                    max="100"
                    min="0"
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
                <p className="text-sm text-gray-500 mt-1">
                    {discountedPercentage && price 
                        ? `Final price will be ${discountedPrice}`
                        : "Enter price and percentage to see the final price"}
                </p>
            </div>

            {/* Quantity */}
            <div className="w-full">
                <p className="mb-2">Quantity/Stock</p>
                <input
                    type="number"
                    placeholder="Enter product Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Colors */}
            <div className="w-full">
                <p className="mb-2">Colors</p>
                <input
                    type="text"
                    placeholder="Enter colors (comma separated)"
                    value={colors.join(",")}
                    onChange={handleColorChange}
                    
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Material */}
            <div className="w-full">
                <p className="mb-2">Material/Fabric</p>
                <input
                    type="text"
                    placeholder="Enter material or fabric type"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Gender */}
            <div className="w-full">
                <p className="mb-2">Gender</p>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                >
                    <option value="">Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                </select>
            </div>

            {/* Category */}
            <div className="w-full">
                <p className="mb-2">Category</p>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Electronics">Electronics</option>
                </select>
            </div>

            {/* Subcategories */}
            <div className="w-full">
                <p className="mb-2">Subcategories</p>
                <input
                    type="text"
                    placeholder="Enter subcategories (comma separated) e.g. T-shirts, Jeans, Formal"
                    value={subcategories.join(",")}
                    onChange={handleSubcategoriesChange}
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
                <p className="text-sm text-gray-500 mt-1">Add multiple subcategories separated by commas</p>
            </div>

            {/* Tag Input */}
            <div className="w-full">
                <p className="mb-2">Tags</p>
                <input
                    type="text"
                    placeholder="Enter Tags (comma separated) "
                    value={tags.join(",")}
                    required
                    onChange={handleTagsChange}
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Sizes (Optional) */}
            <div className="w-full">
                <p className="mb-2">Sizes</p>
                <input
                    type="text"
                    placeholder="Enter sizes (comma separated)"
                    value={sizes.join(",").toUpperCase()}
                    onChange={handleSizeChange}
                    required
                    className="w-full max-w-[500px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fd4a7]"
                />
            </div>

            {/* Bestseller */}
            <div className="w-full">
                <label htmlFor="bestseller" className="inline-flex items-center">
                    <input
                        type="checkbox"
                        id="bestseller"
                        checked={bestseller}
                        onChange={() => setIsBestseller(!bestseller)}
                        className="mr-2"
                    />
                    Bestseller
                </label>
            </div>

            {/* Submit Button */}
            <div>
                {loading ? (
                    <button
                        type="button"
                        className="w-full max-w-[200px] bg-[#1fd4a7] text-white py-2 px-4 rounded-md font-medium transition-all mt-4 cursor-not-allowed hover:bg-[#219175]"
                    >
                        Adding Product...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="w-full max-w-[200px] bg-[#1fd4a7] text-white py-2 px-4 rounded-md font-medium transition-all mt-4 hover:bg-[#219175]"
                    >
                        Add Product
                    </button>
                )}
            </div>
        </form>
    );
}

export default AddProductForm;
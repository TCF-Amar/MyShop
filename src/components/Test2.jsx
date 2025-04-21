import { useForm } from "react-hook-form";

export default function AddProductForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        const productData = {
            ...data,
            price: Number(data.price),
            discountPrice: Number(data.discountPrice),
            quantity: Number(data.quantity),
            tags: data.tags.split(',').map(tag => tag.trim()),
            sizes: data.sizes.split(',').map(size => size.trim()),
            colors: data.colors.split(',').map(color => color.trim()),
            images: data.images.split(',').map(url => url.trim()),
            inStock: data.quantity > 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        console.log("Product Data:", productData);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-4 p-4 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold">Add New Product</h2>

            <input {...register("title", { required: true })} placeholder="Product Title" className="w-full p-2 border rounded" />
            <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />

            <div className="grid grid-cols-2 gap-4">
                <input {...register("price", { required: true })} type="number" placeholder="Price (₹)" className="p-2 border rounded" />
                <input {...register("discountPrice")} type="number" placeholder="Discount Price (₹)" className="p-2 border rounded" />
                <input {...register("quantity", { required: true })} type="number" placeholder="Quantity" className="p-2 border rounded" />
                <input {...register("currency")} placeholder="Currency (e.g. INR)" className="p-2 border rounded" />
            </div>

            <select {...register("gender")} className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
            </select>

            <input {...register("category")} placeholder="Category (e.g. Clothing > T-Shirts)" className="w-full p-2 border rounded" />

            <input {...register("brand")} placeholder="Brand Name" className="w-full p-2 border rounded" />
            <input {...register("material")} placeholder="Material (e.g. Cotton)" className="w-full p-2 border rounded" />

            <input {...register("tags")} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
            <input {...register("sizes")} placeholder="Sizes (e.g. S, M, L)" className="w-full p-2 border rounded" />
            <input {...register("colors")} placeholder="Colors (e.g. Black, White)" className="w-full p-2 border rounded" />
            <input {...register("images")} placeholder="Image URLs (comma separated)" className="w-full p-2 border rounded" />

            <select {...register("returnable")} className="w-full p-2 border rounded">
                <option value="">Returnable?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>

            <input {...register("deliveryTime")} placeholder="Delivery Time (e.g. 3-5 Days)" className="w-full p-2 border rounded" />

            <div className="flex items-center space-x-4">
                <label className="flex items-center">
                    <input type="checkbox" {...register("isFeatured")} className="mr-2" />
                    Featured
                </label>
                <label className="flex items-center">
                    <input type="checkbox" {...register("isNewArrival")} className="mr-2" />
                    New Arrival
                </label>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Product
            </button>
        </form>
    );
}

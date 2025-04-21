import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import { faker } from '@faker-js/faker';

// Clothing categories and gender options
const clothingTypes = ['T-Shirts', 'Hoodies', 'Jackets', 'Dresses', 'Pants'];
const genders = ['Men', 'Women', 'Unisex'];

// Helper to pick multiple random items from an array
const getRandomArray = (arr, count = 3) => {
    return Array.from({ length: count }, () => arr[Math.floor(Math.random() * arr.length)]);
};

// Function to create one fake product object
const createFakeProduct = () => {
    const category = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const title = `${gender}'s ${category} - ${faker.color.human()}`;

    return {
        title,
        description: faker.commerce.productDescription(),
        price: 999,
        discountPrice: 499,
        currency: 'INR',
        inStock: true,
        quantity: faker.number.int({ min: 10, max: 100 }),
        gender,
        category: getRandomArray(["topware", "bottomware", "footware", "winterware", "summerware"]),
        tags: getRandomArray(['Casual', 'Trending', 'Summer', 'Winter', 'Best Seller','shirts', 'hoodies', 'jackets', 'dresses', 'pants','t-shirts']),
        images: [
            faker.image.urlLoremFlickr({ category: 'fashion' }),
            faker.image.urlLoremFlickr({ category: 'fashion' })
        ],
        sizes: getRandomArray(['S', 'M', 'L', 'XL']),
        colors: getRandomArray(['Black', 'White', 'Navy', 'Grey']),
        ratings: {
            average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
            count: faker.number.int({ min: 20, max: 500 })
        },
        brand: faker.company.name(),
        material: faker.commerce.productMaterial(),
        returnable: faker.datatype.boolean(),
        deliveryTime: '3-5 Business Days',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFeatured: faker.datatype.boolean(),
        isNewArrival: faker.datatype.boolean(),
        bestSeller: faker.datatype.boolean()
    };
};

// Function to insert 50 fake products to Firestore
const addFakeClothingProducts = async (count = 50) => {
    const productsRef = collection(firestore, 'products');
    for (let i = 0; i < count; i++) {
        const fakeProduct = createFakeProduct();
        await addDoc(productsRef, fakeProduct);
        console.log(`✅ Inserted product ${i + 1}`);
    }
    alert('50 Fake Clothing Products Added Successfully!');
};

function AddFakeClothingData() {
    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Add Fake Clothing Products</h2>
            <button
                onClick={() => addFakeClothingProducts(50)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
                Insert 50 Fake Products
            </button>
        </div>
    );
}

export default AddFakeClothingData;

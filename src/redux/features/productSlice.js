import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

// Async thunk for fetching all products
export const getProducts = createAsyncThunk("product/getProducts", async () => {
  try {
    const productsRef = collection(firestore, "products");
    const productsSnapshot = await getDocs(productsRef);

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message || "Failed to fetch products");
  }
});

// Initial state
const initialState = {
  products: [],
  loading: true,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;

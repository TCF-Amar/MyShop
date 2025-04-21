import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseAuth, firestore } from "../../utils/firebase";
import {doc, setDoc, getDoc} from "firebase/firestore"


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState }) => {
    const { uid } = getState().user;
    const cartRef = doc(firestore, "users", uid, "cart", product.id);
    await setDoc(cartRef, product);
  }


)




const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default cartSlice.reducer;
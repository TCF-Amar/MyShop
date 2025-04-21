import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  doc,
  getDoc, 
  updateDoc,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "../../utils/firebase";
import { signOut, updateProfile } from "firebase/auth";



export const fetchUser = createAsyncThunk("user/fetchUser", async (uid) => {
  try {
    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : null;
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error.message || "Failed to fetch user");
  }
});


export const signOutUser = createAsyncThunk("user/signOutUser", async () => {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    throw new Error(error.message);
  }
})

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error("No user is signed in");

      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName,
        });
      }

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      });

      // Fetch updated user data manually instead of calling thunk
      const updatedDoc = await getDoc(userRef);
      if (!updatedDoc.exists()) throw new Error("Updated user not found");
      return updatedDoc.data();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  loading: true,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addAddress: (state, action) => {
      if (!state.user.addresses) {
        state.user.addresses = [];
      }
      state.user.addresses.push(action.payload);
    },
    removeAddress: (state, action) => {
      state.user.addresses = state.user.addresses.filter(
        (address) => address.id !== action.payload
      );
    },
    updateAddresses: (state, action) => {
      state.user.addresses = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    // signOut user
    .addCase(signOutUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    })
    .addCase(signOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    .addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
  }
});

export const { 
  setUser, 
  clearUser, 
  setLoading, 
  setError, 
  addAddress,
  removeAddress,
  updateAddresses
} = userSlice.actions;

export default userSlice.reducer;

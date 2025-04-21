import { firebaseAuth, firestore } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import toast from "react-hot-toast";

const googleProvider = new GoogleAuthProvider();

export const registerUser = async (displayName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = userCredential.user;
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      displayName,
      email,
      uid: user.uid,
      createdAt: new Date(),
      photoURL: null,
      role: "user",
    });
    toast.success("Registered successfully");
    return user;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = userCredential.user;
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(
      userRef,
      {
        lastLogin: new Date(),
      },
      { merge: true }
    );
    toast.success("Logged in successfully");
    return user;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const user = result.user;
    const userRef = doc(firestore, "users", user.uid);

    // Check if user exists
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        photoURL: user.photoURL,
        role: "user",
      });
    }

    // Update last login
    await setDoc(
      userRef,
      {
        lastLogin: new Date(),
      },
      { merge: true }
    );
    toast.success("Logged in successfully");
    return user;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

// Product related functions
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(firestore, "products");
    
    // Add timestamps and default values
    const productWithMetadata = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDeleted: false,
      status: 'active'
    };

    const docRef = await addDoc(productsRef, productWithMetadata);
    return { id: docRef.id, ...productWithMetadata };
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error(error.message || "Failed to add product");
  }
};



export const addUserAddress = async (address) => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No user is signed in");

    const userRef = doc(firestore, "users", user.uid);
    
    // Generate unique ID for the address
    const newAddress = {
      ...address,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    // Add new address to array
    await updateDoc(userRef, {
      addresses: arrayUnion(newAddress)
    });

    return newAddress;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const removeUserAddress = async (addressId, currentAddresses) => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No user is signed in");

    const userRef = doc(firestore, "users", user.uid);
    const addressToRemove = currentAddresses.find(addr => addr.id === addressId);
    
    if (!addressToRemove) throw new Error("Address not found");

    await updateDoc(userRef, {
      addresses: arrayRemove(addressToRemove)
    });

    toast.success("Address removed successfully");
    return addressId;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};


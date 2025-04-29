import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";

// Save a new user or update existing one
export const saveUser = async (userId, phoneNumber) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    phoneNumber,
    turdCoins: 50,
    isUnlimited: false,
    createdAt: serverTimestamp()
  }, { merge: true });
};

// Update user's TurdCoin balance
export const updateUserBalance = async (userId, newBalance) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { turdCoins: newBalance });
};

// Get user data based on phone number
export const getUserData = async (phoneNumber) => {
  const userId = "user_" + phoneNumber;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Send a turd via WhatsApp (deduct TurdCoins properly)
export const sendTurd = async (senderPhone, recipientPhone, gifUrl, message) => {
  const senderId = "user_" + senderPhone;
  const senderRef = doc(db, "users", senderId);
  const senderSnap = await getDoc(senderRef);

  if (!senderSnap.exists()) {
    return { success: false, message: "Sender not found." };
  }

  const senderData = senderSnap.data();
  const extraWords = Math.max(0, message.trim().split(/\s+/).length - 5);

  let turdCost = 0;
  if (gifUrl.includes("Unicorn_Turd") || gifUrl.includes("Exploding_Turd")) {
    turdCost = 20;
  } else if (gifUrl.includes("Golden_Turd")) {
    turdCost = 25;
  }

  const totalCost = turdCost + extraWords;

  if (!senderData.isUnlimited && senderData.turdCoins < totalCost) {
    return { success: false, message: "Not enough TurdCoins." };
  }

  if (!senderData.isUnlimited) {
    await updateDoc(senderRef, { turdCoins: senderData.turdCoins - totalCost });
  }

  return { success: true };
};

// 🔥 Send a turd In-App (secured via backend)
export const sendTurdInApp = async (senderPhone, recipientPhone, gifUrl, message) => {
  try {
    const response = await fetch('https://turd-backend.onrender.com/inapp-send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderPhone,    // backend expects this
        to: recipientPhone,  // backend expects this
        gif: gifUrl,         // backend expects this
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to send turd.');
    }

    return { success: true };
  } catch (error) {
    console.error('sendTurdInApp error:', error);
    return { success: false, message: error.message };
  }
};

// Retrieve the latest turd sent to a phone number and delete it after fetching
export const getReceivedTurd = async (phoneNumber) => {
  const q = query(collection(db, "turdMessages"), where("to", "==", phoneNumber));
  const querySnapshot = await getDocs(q);

  let found = null;
  for (const docSnap of querySnapshot.docs) {
    found = { id: docSnap.id, ...docSnap.data() };
    break;
  }

  if (found?.id) {
    const docRef = doc(db, "turdMessages", found.id);
    await deleteDoc(docRef);
  }

  return found;
};

// Save the device's push notification token
export const savePushToken = async (userId, token) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { pushToken: token });
};

// Format phone numbers safely
export const formatPhoneNumber = (number) => number.replace(/[^0-9+]/g, '');

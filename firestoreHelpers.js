// firestoreHelpers.js

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

// 🟡 Save a new user or update existing one
export const saveUser = async (userId, phoneNumber) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    phoneNumber,
    turdCoins: 50,
    isUnlimited: false,
    createdAt: serverTimestamp(),
  }, { merge: true });
};

// 🟡 Update user's TurdCoin balance
export const updateUserBalance = async (userId, newBalance) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { turdCoins: newBalance });
};

// 🟡 Get user data based on phone number
export const getUserData = async (phoneNumber) => {
  const userId = "user_" + phoneNumber;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// 🟡 Send Turd via WhatsApp
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

// 🟡 Send Turd In-App
export const sendTurdInApp = async (senderPhone, recipientPhone, gifUrl, message) => {
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

  await addDoc(collection(db, "turdMessages"), {
    to: recipientPhone,
    gif: gifUrl,
    message,
    sentAt: serverTimestamp(),
  });

  if (!senderData.isUnlimited) {
    await updateDoc(senderRef, { turdCoins: senderData.turdCoins - totalCost });
  }

  return { success: true };
};

// 🟡 Retrieve the latest received turd
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

// 🟡 Save push notification token
export const savePushToken = async (userId, token) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { pushToken: token });
};

// 🟡 Phone number formatter
export const formatPhoneNumber = (number) => number.replace(/[^0-9+]/g, "");

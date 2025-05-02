import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./firebaseHelpers";
import * as Notifications from "expo-notifications";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [turdBalance, setTurdBalance] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const init = async () => {
      const phone = await AsyncStorage.getItem("userPhone");
      if (phone) {
        const uid = "user_" + phone;
        setUserId(uid);

        const userDoc = await getUserData(phone);
        if (userDoc) {
          if (userDoc.turdCoins !== undefined) setTurdBalance(userDoc.turdCoins);
          if (userDoc.isUnlimited) setIsUnlimited(true);
        }

        const { status } = await Notifications.getPermissionsAsync();
        if (status === "granted") {
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          await fetch("https://turd-backend.onrender.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uid, token }),
          });
        }
      }
    };

    init();
  }, []);

  const updateBalance = (newBalance) => setTurdBalance(newBalance);

  const activateSecretMode = async () => {
    setIsUnlimited(true);
    const phone = await AsyncStorage.getItem("userPhone");
    if (phone) {
      const uid = "user_" + phone;
      await fetch(`https://turd-backend.onrender.com/activate-unlimited`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        turdBalance,
        updateBalance,
        isUnlimited,
        activateSecretMode,
        userId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

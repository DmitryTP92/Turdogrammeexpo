import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import { getUserData } from "../firebaseHelpers";
import i18n from "../i18n";

const GiftScreen = ({ navigation }) => {
  const { updateBalance, turdBalance } = useContext(UserContext);
  const [recipientNumber, setRecipientNumber] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(true);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    return phoneRegex.test(number);
  };

  const sendGift = async () => {
    const amount = parseInt(giftAmount);
    if (!recipientNumber || isNaN(amount) || amount <= 0) {
      alert(i18n.t("gift.invalid_input", { defaultValue: "Invalid input." }));
      return;
    }

    if (!validatePhoneNumber(recipientNumber)) {
      alert(i18n.t("gift.error_invalid_number", { defaultValue: "Invalid phone number." }));
      return;
    }

    try {
      const senderPhone = await AsyncStorage.getItem("userPhone");

      const response = await fetch("https://turd-backend.onrender.com/gift-turds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderPhone, recipientPhone: recipientNumber, amount }),
      });

      const result = await response.json();

      if (result.success) {
        const userDoc = await getUserData(senderPhone);
        if (userDoc && userDoc.turdCoins !== undefined) {
          updateBalance(userDoc.turdCoins);
        }
        alert(i18n.t("gift.success", { amount, defaultValue: `Successfully gifted ${amount} TC!` }));
        navigation.goBack();
      } else {
        alert(i18n.t("gift.failed", { defaultValue: result.message || "Gift failed. Please try again." }));
      }
    } catch (error) {
      console.error("Gift error:", error);
      alert(i18n.t("common.error_generic", { defaultValue: "An error occurred. Please try again." }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("gift.title", { defaultValue: "Gift TurdCoins" })}</Text>
      <Text style={styles.subHeader}>
        💰 {i18n.t("gift.current_balance", { defaultValue: "Current Balance:" })} {turdBalance} TC
      </Text>
      <TextInput
        style={[styles.input, !isValidNumber && { borderColor: "red" }]}
        placeholder={i18n.t("gift.placeholder_number", { defaultValue: "Recipient Phone Number" })}
        keyboardType="phone-pad"
        value={recipientNumber}
        onChangeText={(text) => {
          setRecipientNumber(text);
          setIsValidNumber(validatePhoneNumber(text));
        }}
      />
      {!isValidNumber && (
        <Text style={{ color: "red", marginBottom: 5 }}>
          {i18n.t("gift.invalid_format", { defaultValue: "Number must be in international format (e.g. +441234567890)" })}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder={i18n.t("gift.placeholder_amount", { defaultValue: "Amount to Gift" })}
        keyboardType="number-pad"
        value={giftAmount}
        onChangeText={setGiftAmount}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendGift}>
        <Text style={styles.sendButtonText}>{i18n.t("gift.send_button", { defaultValue: "Send Gift" })}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>
          {i18n.t("gift.back", { defaultValue: "Back" })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GiftScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
  subHeader: { fontSize: 18, marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 },
  sendButton: { backgroundColor: "#FFD700", padding: 15, borderRadius: 10, marginTop: 10 },
  sendButtonText: { fontSize: 18 },
  backButton: { marginTop: 20 },
  backButtonText: { fontSize: 16, color: "blue" },
});

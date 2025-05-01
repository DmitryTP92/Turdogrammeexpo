import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserContext } from "../UserContext";
import { sendTurd, sendTurdInApp } from "../firestoreHelpers";
import { TURD_GIF_MAP } from "../constants";
import i18n from "../i18n";
import styles from "../styles";

const SendScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("inApp");

  const navigation = useNavigation();
  const route = useRoute();

  const { userId, turdBalance, updateBalance, isUnlimited } = useContext(UserContext);

  const selectedGifUri = route.params?.selectedGif || null;
  const gifFilename = selectedGifUri?.split("/")?.pop() || "Happy_Turd.gif";
  const gifToSend = TURD_GIF_MAP[gifFilename] || TURD_GIF_MAP["Happy_Turd.gif"];

  const isValidPhoneNumber = (number) => {
    const intlPattern = /^\+[1-9]\d{6,14}$/;
    return intlPattern.test(number);
  };

  const handleSendTurd = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      alert(i18n.t("send.invalid_number"));
      return;
    }

    const extraWords = Math.max(0, message.trim().split(/\s+/).length - 5);

    const turdCost = gifFilename.includes("Golden") ? 25 :
      gifFilename.includes("Unicorn") || gifFilename.includes("Exploding") ? 20 : 0;

    const totalCost = turdCost + extraWords;

    if (!isUnlimited && turdBalance < totalCost) {
      alert(i18n.t("send.not_enough"));
      return;
    }

    try {
      const senderPhone = await AsyncStorage.getItem("userPhone");
      const formattedRecipient = phoneNumber.replace(/[^0-9+]/g, '');

      if (deliveryMethod === "inApp") {
        const result = await sendTurdInApp(senderPhone, formattedRecipient, gifToSend, message);
        if (!result.success) throw new Error(result.message || "Failed to send turd.");
        if (!isUnlimited) updateBalance(turdBalance - totalCost);
        alert(i18n.t("send.success_inapp"));
      } else {
        const result = await sendTurd(senderPhone, formattedRecipient, gifToSend, message);
        if (!result.success) throw new Error(result.message || "Failed to send turd.");
        if (!isUnlimited) updateBalance(turdBalance - totalCost);

        const encodedMessage = encodeURIComponent(`${message}\n\n💩 ${gifToSend}`);
        const waUrl = `https://wa.me/${formattedRecipient.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;

        const supported = await Linking.canOpenURL(waUrl);
        if (supported) {
          await Linking.openURL(waUrl);
        } else {
          alert(i18n.t("send.no_whatsapp"));
        }
      }

      navigation.navigate("SentScreen", { gifToSend, message });

    } catch (error) {
      console.error("Send error:", error);
      alert(i18n.t("send.fail"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("send.title")}</Text>

      {selectedGifUri && (
        <Image
          source={{ uri: selectedGifUri }}
          style={{ width: 120, height: 120, marginBottom: 10 }}
          resizeMode="contain"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder={i18n.t("send.placeholder_number")}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder={i18n.t("send.placeholder_message")}
        value={message}
        onChangeText={setMessage}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, deliveryMethod === "inApp" && styles.selectedButton]}
          onPress={() => setDeliveryMethod("inApp")}
        >
          <Text>{i18n.t("send.method_inapp")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, deliveryMethod === "whatsapp" && styles.selectedButton]}
          onPress={() => setDeliveryMethod("whatsapp")}
        >
          <Text>{i18n.t("send.method_whatsapp")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSendTurd}>
        <Text style={styles.sendButtonText}>{i18n.t("send.send_button")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendScreen;

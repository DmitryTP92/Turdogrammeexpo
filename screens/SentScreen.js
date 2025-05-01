import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import i18n from "../i18n";
import styles from "../styles";

const SentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { gifToSend, message } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t("sent.title", { defaultValue: "Turd Sent!" })}</Text>

      {gifToSend && (
        <Image
          source={{ uri: gifToSend }}
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />
      )}

      {message && (
        <Text style={styles.subHeader}>
          {i18n.t("sent.your_message", { defaultValue: "Your message:" })} {message}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.sendButton, { marginTop: 30 }]}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Text style={styles.sendButtonText}>
          {i18n.t("sent.back_home", { defaultValue: "Back to Home" })}
        </Text>
      </TouchableOpacity>
    </View> 
  );
};

export default SentScreen;

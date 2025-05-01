import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { UserContext } from "../UserContext";
import i18n from "../i18n";
import styles from "../styles";
import { createCheckoutSession } from "../firebaseHelpers";

const BuyCoinsScreen = ({ navigation }) => {
  const { userId } = useContext(UserContext);

  const handleBuyCoins = async (priceId) => {
    try {
      const sessionUrl = await createCheckoutSession(userId, priceId);
      if (sessionUrl) {
        Linking.openURL(sessionUrl);
      } else {
        alert(i18n.t("buy.failed", { defaultValue: "Failed to start purchase." }));
      }
    } catch (error) {
      console.error("BuyCoinsScreen error:", error);
      alert(
        i18n.t("common.error_generic", {
          defaultValue: "An error occurred. Please try again.",
        })
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/TurdCoins_purchase.gif")}
        style={{ width: 250, height: 250, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.header}>
        {i18n.t("buy.title", { defaultValue: "Buy TurdCoins" })}
      </Text>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleBuyCoins("price_1R75QnEtcXkw7neRjAKNLrzW")}
      >
        <Text style={styles.sendButtonText}>
          {i18n.t("buy.coins_50", { defaultValue: "💩 Buy 50 TC – £1" })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleBuyCoins("price_1R75SfEtcXkw7neRENizMESu")}
      >
        <Text style={styles.sendButtonText}>
          {i18n.t("buy.coins_150", { defaultValue: "💩 Buy 150 TC – £1.50" })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleBuyCoins("price_1R75T3EtcXkw7neRMIdaAyiG")}
      >
        <Text style={styles.sendButtonText}>
          {i18n.t("buy.coins_300", { defaultValue: "💩 Buy 300 TC – £2" })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: "#FF69B4", marginTop: 20 }]}
        onPress={() => navigation.navigate("GiftScreen")}
      >
        <Text style={styles.sendButtonText}>
          {i18n.t("buy.gift_button", { defaultValue: "🎁 Gift TurdCoins" })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>
          {i18n.t("buy.back", { defaultValue: "Back" })}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BuyCoinsScreen;

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import i18n from "../i18n";
import { TURD_GIF_LIST } from "../constants";

const TurdSelectionScreen = () => {
  const navigation = useNavigation();

  const handleSelect = (gif, cost) => {
    navigation.navigate("SendScreen", { selectedGif: gif, cost });
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      <Text style={styles.header}>{i18n.t("turd_selection.title", { defaultValue: "💩 Choose Your Turd 💩" })}</Text>

      {TURD_GIF_LIST.map(({ gif, label, cost }) => (
        <TouchableOpacity key={gif} style={{ marginBottom: 20 }} onPress={() => handleSelect(gif, cost)}>
          <Image source={{ uri: gif }} style={{ width: 200, height: 200 }} resizeMode="contain" />
          <Text style={styles.subHeader}>{label} ({cost} TC)</Text>
        </TouchableOpacity>
      ))}

      <Image
        source={require("../assets/TurdCoins_purchase.gif")}
        style={{ width: 200, height: 200, marginTop: 20 }}
        resizeMode="contain"
      />
    </ScrollView>
  );
};

export default TurdSelectionScreen;

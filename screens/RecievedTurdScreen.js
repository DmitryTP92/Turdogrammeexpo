import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { getReceivedTurd } from "../firebaseHelpers";
import { UserContext } from "../UserContext";
import i18n from "../i18n";

const ReceivedTurdScreen = () => {
  const [turd, setTurd] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    const fetchTurd = async () => {
      try {
        const phone = userId.replace("user_", "");
        const result = await getReceivedTurd(phone);

        if (result) {
          setTurd(result);
          await playSound();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Speech.speak(result.message || i18n.t("receive.default_tts"), {
            language: i18n.locale,
          });
        }
      } catch (error) {
        console.error("Error fetching turd:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurd();
  }, []);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/ringtone.mp3"),
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.text}>{i18n.t("receive.loading", { defaultValue: "Loading your turd..." })}</Text>
      </View>
    );
  }

  if (!turd) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{i18n.t("receive.none", { defaultValue: "No turd found." })}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{i18n.t("receive.message", { defaultValue: "You've received a Turd!" })}</Text>
      <Image source={{ uri: turd.gif }} style={styles.gif} resizeMode="contain" />
      <Text style={styles.text}>{turd.message}</Text>
    </View>
  );
};

export default ReceivedTurdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  gif: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
});

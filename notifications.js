import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Audio } from "expo-av";
import * as Vibration from "expo-vibration";

let ringtoneSound;

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    console.warn("Must use physical device for Push Notifications");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "ringtone.mp3", // 🔥 Custom ringtone set here
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

// Setup listener for background ringtone and vibration
export function setupNotificationListeners() {
  Notifications.addNotificationReceivedListener(async (notification) => {
    const screen = notification.request.content.data?.screen;

    if (screen === "ReceivedTurd") {
      try {
        console.log("🔔 Playing Turd Alert ringtone!");

        // Play ringtone
        ringtoneSound = new Audio.Sound();
        await ringtoneSound.loadAsync(require("./assets/ringtone.mp3")); // 🔥 Path inside your project
        await ringtoneSound.playAsync();

        // Vibrate
        Vibration.vibrate();
      } catch (error) {
        console.error("🔴 Error playing ringtone:", error);
      }
    }
  });
}

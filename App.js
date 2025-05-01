import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./UserContext";
import { navigationRef } from "./navigationRef";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "./i18n"; // 🌍 Language
import { registerForPushNotificationsAsync } from "./notifications";
import { savePushToken } from "./firebaseHelpers";
import WelcomeScreen from "./screens/WelcomeScreen";
import TurdSelectionScreen from "./screens/TurdSelectionScreen";
import SendScreen from "./screens/SendScreen";
import SentScreen from "./screens/SentScreen";
import ReceivedTurdScreen from "./screens/ReceivedTurdScreen";
import GiftScreen from "./screens/GiftScreen";
import BuyCoinsScreen from "./screens/BuyCoinsScreen";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({});
        const token = await registerForPushNotificationsAsync();

        if (token && Device.isDevice) {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            await savePushToken(storedUserId, token);
          }
        }

        // 🟡 Load language preference
        const storedLang = await AsyncStorage.getItem("lang");
        if (storedLang) i18n.locale = storedLang;

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        Notifications.addNotificationResponseReceivedListener((response) => {
          const screen = response?.notification?.request?.content?.data?.screen;
          if (screen) {
            navigationRef.current?.navigate(screen);
          }
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) return null;

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TurdSelection" component={TurdSelectionScreen} options={{ title: i18n.t("nav.pick") }} />
          <Stack.Screen name="SendScreen" component={SendScreen} options={{ title: i18n.t("nav.send") }} />
          <Stack.Screen name="SentScreen" component={SentScreen} options={{ title: i18n.t("nav.sent") }} />
          <Stack.Screen name="ReceivedTurd" component={ReceivedTurdScreen} options={{ title: i18n.t("nav.received") }} />
          <Stack.Screen name="GiftScreen" component={GiftScreen} options={{ title: i18n.t("nav.gift") }} />
          <Stack.Screen name="BuyCoinsScreen" component={BuyCoinsScreen} options={{ title: i18n.t("nav.buy") }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

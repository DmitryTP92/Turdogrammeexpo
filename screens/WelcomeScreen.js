import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import i18n from "../i18n";
import { UserContext } from "../UserContext";
import { saveUser } from "../firebaseHelpers";
import styles from "../styles";
import { SECRET_CODE } from "../constants"; // Assume this holds the hidden code

const languages = {
  en: "🇬🇧",
  ja: "🇯🇵",
  ko: "🇰🇷",
  es: "🇪🇸",
  fr: "🇫🇷",
};

const WelcomeScreen = ({ navigation }) => {
  const { turdBalance, activateSecretMode, updateBalance, isUnlimited } = useContext(UserContext);
  const [selectedLang, setSelectedLang] = useState(i18n.locale);
  const [codeInput, setCodeInput] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const checkIfRegistered = async () => {
      const stored = await AsyncStorage.getItem("userPhone");
      if (stored) setIsRegistered(true);

      const saved = await AsyncStorage.getItem("soundOn");
      if (saved !== null) setSoundOn(saved === "true");
    };
    checkIfRegistered();
  }, []);

  const toggleSound = async () => {
    const newValue = !soundOn;
    setSoundOn(newValue);
    await AsyncStorage.setItem("soundOn", newValue.toString());
  };

  const checkSecretCode = async () => {
    if (codeInput.trim() === SECRET_CODE) {
      await activateSecretMode();
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
      alert(i18n.t("welcome.unlimited_activated"));
    } else {
      alert(i18n.t("welcome.invalid_code"));
    }
    setCodeInput("");
  };

  const handleTap = () => {
    setTapCount((prevCount) => {
      const newCount = prevCount + 1;
      if (!showSecret && newCount >= 11) {
        setShowSecret(true);
        return 0;
      } else if (showSecret && newCount >= 7) {
        setShowSecret(false);
        return 0;
      }
      return newCount;
    });
  };

  const handleRegistration = async () => {
    if (!phoneNumber) {
      alert(i18n.t("welcome.enter_phone"));
      return;
    }

    if (!phoneNumber.startsWith("+")) {
      alert(i18n.t("welcome.enter_phone_international"));
      return;
    }

    const userId = "user_" + phoneNumber;

    await saveUser(userId, phoneNumber);
    await AsyncStorage.setItem("userPhone", phoneNumber);

    setIsRegistered(true);
    navigation.navigate("TurdSelection");
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* 🔊 Sound Toggle */}
        <View style={{ position: "absolute", top: 40, left: 20, zIndex: 100 }}>
          <TouchableOpacity onPress={toggleSound}>
            <Text style={{ fontSize: 24, color: "#FFD700" }}>
              {soundOn ? "🔊" : "🔇"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🌍 Language Picker */}
        <View style={styles.languagePickerContainer}>
          <Picker
            selectedValue={selectedLang}
            style={styles.languagePicker}
            onValueChange={(lang) => {
              i18n.locale = lang;
              setSelectedLang(lang);
            }}
            dropdownIconColor="#FFD700"
          >
            {Object.entries(languages).map(([key, label]) => (
              <Picker.Item key={key} label={label} value={key} />
            ))}
          </Picker>
        </View>

        {/* 🖼️ Unicorn Turd Image */}
        <Image
          source={require("../assets/Turdogramme_screen.png")}
          style={{ width: 320, height: 320, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text style={styles.subHeader}>{i18n.t("welcome.subtitle")}</Text>
        {isUnlimited && (
          <Text style={[styles.subHeader, { color: "#00FF00", fontWeight: "bold" }]}>
            ∞ UNLIMITED TURDS ACTIVATED
          </Text>
        )}

        {showSecret && (
          <>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("welcome.placeholder_secret")}
              value={codeInput}
              onChangeText={setCodeInput}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.sendButton} onPress={checkSecretCode}>
              <Text style={styles.sendButtonText}>{i18n.t("welcome.activate_secret")}</Text>
            </TouchableOpacity>
          </>
        )}

        {!isRegistered ? (
          <View style={{ alignItems: "center" }}>
            <TextInput
              placeholder={i18n.t("welcome.placeholder_phone")}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                width: 250,
                marginBottom: 10,
                color: "#000",
                backgroundColor: "#fff",
              }}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.startButton} onPress={handleRegistration}>
              <Text style={styles.startButtonText}>{i18n.t("welcome.register")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.startButton, { marginTop: 10 }]}
            onPress={() => navigation.navigate("TurdSelection")}
          >
            <Text style={styles.startButtonText}>{i18n.t("welcome.button")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WelcomeScreen;

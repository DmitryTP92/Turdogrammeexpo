import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: 250,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  sendButtonText: {
    fontSize: 16,
    color: "#000",
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    color: "blue",
    fontSize: 16,
  },
  languagePickerContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
    width: 150,
  },
  languagePicker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  costBreakdown: {
    fontSize: 14,
    marginBottom: 10,
    color: "#444",
  },
});

export default styles;

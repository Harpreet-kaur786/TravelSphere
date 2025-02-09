import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
    input: { width: 280, height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 5, paddingLeft: 10 },
    button: { backgroundColor: "#007BFF", padding: 12, borderRadius: 5, marginTop: 10 },
    buttonText: { color: "#FFF", fontSize: 16 },
    errorText: { color: "red", fontSize: 12, textAlign: "left", width: 280 },
    verificationText: { color: "green", fontSize: 14, marginBottom: 10, textAlign: "center", width: 280 },
    suggestionContainer: { marginBottom: 10, width: 280 },
    suggestionTitle: { color: "#007BFF", fontSize: 12, marginBottom: 3 },
    suggestionText: { color: "#007BFF", fontSize: 12, marginBottom: 2 }, 
  });

  export default styles;
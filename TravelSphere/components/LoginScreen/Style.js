import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: "bold",
    },
    input: {
      width: 280,
      height: 45,
      borderBottomWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 12,
      borderRadius: 5,
      marginBottom: 15,
    },
    buttonText: {
      color: "#FFF",
      fontSize: 16,
    },
    linkText: {
      color: "#007BFF",
      fontWeight: "bold",
      marginTop: 5,
    },
    backButton: {
      position: "absolute",
      top: 40,
      left: 20,
    },
    backText: {
      fontSize: 18,
      color: "#007BFF",
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
  });
  
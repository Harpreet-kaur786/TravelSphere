import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  image: { 
    height: "40%", 
    width: "100%", 
  },
  welcomeContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f0f8ff", 
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#007BFF", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 18, 
    color: "#333", 
    marginBottom: 30 
  },
  button: { 
    backgroundColor: "#007BFF", 
    padding: 15, 
    borderRadius: 8, 
    width: "100%",
    alignItems: "center"
  },
  buttonText: { 
    color: "white", 
    fontSize: 18 
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center"
  },
  linkText: { 
    color: "#007BFF", 
    fontSize: 16
  },
});

export default styles;

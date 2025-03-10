import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start", // Make sure content is aligned to the top
  },
  imageContainer: {
    width: "100%",
    height: "40%", // Keep top image size
    position: "absolute",
    top: 60,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start", // Align the image at the top
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "stretch",
  },
  formContainer: {
    marginTop: "83%", // Adjust the form container to be centered between top and bottom images
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007BFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    flexDirection: "row",
    marginTop: 10,
  },
  signupLink: {
    color: "#007BFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  imageContainerBottom: {
    width: "100%",
    height: "24%", // Adjust bottom image height
    position: "absolute",
    bottom: -5,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-end", // Align the image at the bottom
  },
  imageBottom: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default styles;

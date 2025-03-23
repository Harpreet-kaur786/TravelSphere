// import { StyleSheet } from "react-native";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f4f8",
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: "#fff",
//     height: 50,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "#d9534f",
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   verificationText: {
//     color: "#5bc0de",
//     fontSize: 16,
//     textAlign: "center",
//     marginTop: 10,
//   },
//   backButton: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   backText: {
//     color: "#007bff",
//     fontSize: 16,
//   },
// });

// export default styles;


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // Center the form container vertically
    alignItems: "center",      // Center the form container horizontally
    resizeMode: "contain",       // Ensure the image covers the screen
  },
  formContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
   marginTop: "20%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007BFF",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  verificationText: {
    color: "green",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
  },
  backText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default styles;

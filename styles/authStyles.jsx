// import { Platform, StyleSheet } from "react-native";

// export const authStyles = StyleSheet.create({
//   // --- Layout ---
//   gradientBg: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   innerContainer: {
//     width: "100%",
//     maxWidth: 420,
//   },

//   // --- Titles ---
//   title: {
//     fontSize: 34,
//     fontWeight: "800",
//     textAlign: "center",
//     marginBottom: 40,
//     letterSpacing: 0.3,
//   },

//   // --- Inputs ---
//   inputWrapper: {
//     marginBottom: 40,
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 6,
//     marginLeft: 4,
//   },
//   input: {
//     borderRadius: 16,
//     paddingHorizontal: 18,
//     paddingVertical: Platform.OS === "ios" ? 15 : 13,
//     fontSize: 16,
//     borderWidth: 1.2,
//     marginBottom: 8,
//   },

//   // --- Buttons ---
//   button: {
//     borderRadius: 18,
//     overflow: "hidden",
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   buttonGradient: {
//     paddingVertical: 17,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     letterSpacing: 0.4,
//   },

//   // --- Footer Links ---
//   footerText: {
//     textAlign: "center",
//     marginTop: 24,
//     fontSize: 15,
//   },
//   footerLink: {
//     fontWeight: "700",
//   },
// });

import { Platform, StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  // --- Layout ---
  gradientBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 420,
  },

  // --- Title ---
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 48,
    letterSpacing: 0.4,
  },

  // --- Input Fields ---
  inputWrapper: {
    marginBottom: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.85,
  },
  input: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  // --- Button ---
  button: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // --- Footer Links ---
  footerText: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 15,
    opacity: 0.8,
  },
  footerLink: {
    fontWeight: "700",
  },

  // --- Helper Text / Error States ---
  errorText: {
    color: "#FF4D4F",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 6,
  },

  // --- Animations / Transitions (for smooth feedback) ---
  animatedContainer: {
    transform: [{ translateY: 0 }],
    transition: "all 0.25s ease-in-out",
  },
});

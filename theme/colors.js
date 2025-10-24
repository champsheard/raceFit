// // theme/colors.js
// export const theme = {
//   light: {
//     backgroundGradient: ["#E8EEFF", "#F9FAFF"],
//     text: "#0A0A0A",
//     textSecondary: "#333",
//     inputBackground: "#FFFFFF",
//     inputBorder: "#E3E6F0",
//     placeholder: "#A0A0A0",
//     error: "#FF4C4C",
//     buttonGradient: ["#007AFF", "#0051FF"],
//     shadow: "#007AFF",
//   },
//   dark: {
//     backgroundGradient: ["#0A0A0A", "#121212"],
//     text: "#FFFFFF",
//     textSecondary: "#DDDDDD",
//     inputBackground: "#1E1E1E",
//     inputBorder: "#2E2E2E",
//     placeholder: "#777",
//     error: "#FF4C4C",
//     buttonGradient: ["#4C8CFF", "#0051FF"],
//     shadow: "#4C8CFF",
//   },
// };

export const theme = {
  light: {
    backgroundGradient: ["#ECF2FF", "#E0EAFC"], // cooler, higher-contrast blue gradient
    buttonGradient: ["#2563EB", "#1D4ED8"], // stronger blue (tailwind indigo-600 to 700)
    text: "#0A0A0A",
    textSecondary: "#3A4A5A",
    inputBorder: "#9CA3AF",
    inputBackground: "#FFFFFF",
    placeholder: "#6B7280",
    error: "#DC2626", // slightly darker red
    shadow: "#1E293B",
  },
  dark: {
    backgroundGradient: ["#0F172A", "#1E293B"], // deep navy gradient with rich contrast
    buttonGradient: ["#3B82F6", "#2563EB"], // brighter blues pop on dark mode
    text: "#F9FAFB",
    textSecondary: "#CBD5E1",
    inputBorder: "#475569",
    inputBackground: "#1E293B",
    placeholder: "#94A3B8",
    error: "#F87171",
    shadow: "#000000",
  },
};

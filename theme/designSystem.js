import { Platform } from "react-native";

export const designSystem = {
  // ===== SPACING =====
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
  },

  // ===== TYPOGRAPHY =====
  typography: {
    // Headings
    headingXL: {
      fontSize: 40,
      fontWeight: "900",
      letterSpacing: -0.5,
    },
    headingLG: {
      fontSize: 36,
      fontWeight: "800",
      letterSpacing: 0.4,
    },
    headingMD: {
      fontSize: 32,
      fontWeight: "800",
    },
    headingSM: {
      fontSize: 28,
      fontWeight: "700",
    },
    
    // Titles & Sections
    titleLG: {
      fontSize: 24,
      fontWeight: "700",
    },
    titleMD: {
      fontSize: 20,
      fontWeight: "700",
    },
    titleSM: {
      fontSize: 18,
      fontWeight: "700",
    },

    // Body Text
    bodyLG: {
      fontSize: 18,
      fontWeight: "600",
    },
    bodyMD: {
      fontSize: 16,
      fontWeight: "500",
    },
    bodySM: {
      fontSize: 14,
      fontWeight: "500",
    },
    bodyXS: {
      fontSize: 13,
      fontWeight: "500",
    },

    // Labels & Small Text
    labelLG: {
      fontSize: 16,
      fontWeight: "600",
    },
    labelMD: {
      fontSize: 14,
      fontWeight: "600",
    },
    labelSM: {
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },
    labelXS: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },

    // Button Text
    buttonLG: {
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    buttonMD: {
      fontSize: 16,
      fontWeight: "700",
    },
    buttonSM: {
      fontSize: 14,
      fontWeight: "700",
    },

    // Caption
    caption: {
      fontSize: 12,
      fontWeight: "500",
    },
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    round: 50,
  },

  // ===== SHADOWS =====
  shadows: {
    // Light shadows for subtle elevation
    sm: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 1,
    },
    // Medium shadows for cards
    md: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3,
    },
    // Strong shadows for elevated elements
    lg: {
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 6,
    },
    // Premium shadows for buttons & key elements
    premium: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 8,
    },
    // Extra strong for modals
    xl: {
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 10,
    },
  },

  // ===== LAYOUT =====
  layout: {
    containerPadding: 24,
    contentGap: 12,
    sectionGap: 16,
    pageBottomPadding: 50,
  },

  // ===== INPUT & FORM =====
  input: {
    height: 56,
    minHeight: 56,
  },

  // ===== BUTTON =====
  button: {
    height: 56,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
  },

  // ===== CARD =====
  card: {
    borderRadius: 20,
    padding: 20,
  },
};

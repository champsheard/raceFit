
import { StyleSheet } from "react-native";
import { designSystem } from "../theme/designSystem";

export const authStyles = StyleSheet.create({
  // --- Layout ---
  gradientBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: designSystem.layout.containerPadding,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 420,
  },

  // --- Title ---
  title: {
    ...designSystem.typography.headingLG,
    textAlign: "center",
    marginBottom: designSystem.spacing.xxxxl,
  },

  // --- Input Fields ---
  inputWrapper: {
    marginBottom: designSystem.spacing.xxxxl,
  },
  label: {
    ...designSystem.typography.labelLG,
    marginBottom: designSystem.spacing.md,
    marginLeft: designSystem.spacing.xs,
    opacity: 0.85,
  },
  input: {
    borderRadius: designSystem.borderRadius.lg,
    paddingHorizontal: designSystem.spacing.xl,
    paddingVertical: designSystem.button.paddingVertical,
    ...designSystem.typography.bodyMD,
    borderWidth: 1,
    marginBottom: designSystem.spacing.md,
    ...designSystem.shadows.sm,
  },

  // --- Button ---
  button: {
    borderRadius: designSystem.borderRadius.xl,
    overflow: "hidden",
    ...designSystem.shadows.premium,
  },
  buttonGradient: {
    paddingVertical: designSystem.spacing.lg,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    ...designSystem.typography.buttonLG,
  },

  // --- Footer Links ---
  footerText: {
    textAlign: "center",
    marginTop: designSystem.spacing.xxxl,
    ...designSystem.typography.bodySM,
    opacity: 0.8,
  },
  footerLink: {
    fontWeight: "700",
  },

  // --- Helper Text / Error States ---
  errorText: {
    color: "#FF4D4F",
    ...designSystem.typography.bodyXS,
    marginTop: designSystem.spacing.xs,
    marginLeft: designSystem.spacing.sm,
  },

  // --- Animations / Transitions (for smooth feedback) ---
  animatedContainer: {
    transform: [{ translateY: 0 }],
    transition: "all 0.25s ease-in-out",
  },
});

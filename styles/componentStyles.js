import { StyleSheet } from "react-native";
import { designSystem } from "./../theme/designSystem";

export const createComponentStyles = (colors) => {
  return StyleSheet.create({
    // ===== CARD STYLES =====
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: designSystem.card.borderRadius,
      padding: designSystem.card.padding,
      ...designSystem.shadows.md,
    },
    cardLarge: {
      backgroundColor: colors.cardBackground,
      borderRadius: designSystem.card.borderRadius,
      padding: designSystem.card.padding,
      ...designSystem.shadows.lg,
    },
    
    // ===== INPUT STYLES =====
    input: {
      height: designSystem.input.height,
      borderRadius: designSystem.borderRadius.md,
      paddingHorizontal: designSystem.spacing.lg,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      color: colors.text,
      ...designSystem.typography.bodyMD,
    },
    inputWithError: {
      borderColor: colors.error,
    },
    inputFocused: {
      borderColor: colors.buttonGradient[0],
    },

    // ===== LABEL STYLES =====
    label: {
      ...designSystem.typography.labelMD,
      color: colors.text,
      marginBottom: designSystem.spacing.md,
    },
    labelSmall: {
      ...designSystem.typography.labelSM,
      color: colors.textSecondary,
      marginBottom: designSystem.spacing.sm,
    },

    // ===== BUTTON STYLES =====
    buttonPrimary: {
      height: designSystem.button.height,
      borderRadius: designSystem.button.borderRadius,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      ...designSystem.shadows.premium,
    },
    buttonSecondary: {
      height: designSystem.button.height,
      borderRadius: designSystem.button.borderRadius,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.buttonGradient[0],
    },
    buttonText: {
      ...designSystem.typography.buttonMD,
      color: "#fff",
    },
    buttonTextSecondary: {
      ...designSystem.typography.buttonMD,
      color: colors.buttonGradient[0],
    },

    // ===== TEXT STYLES =====
    headingXL: {
      ...designSystem.typography.headingXL,
      color: colors.text,
    },
    headingLG: {
      ...designSystem.typography.headingLG,
      color: colors.text,
    },
    headingMD: {
      ...designSystem.typography.headingMD,
      color: colors.text,
    },
    titleLG: {
      ...designSystem.typography.titleLG,
      color: colors.text,
    },
    titleMD: {
      ...designSystem.typography.titleMD,
      color: colors.text,
    },
    bodyText: {
      ...designSystem.typography.bodyMD,
      color: colors.text,
    },
    bodyTextSecondary: {
      ...designSystem.typography.bodyMD,
      color: colors.textSecondary,
    },
    caption: {
      ...designSystem.typography.caption,
      color: colors.textSecondary,
    },

    // ===== CONTAINER STYLES =====
    container: {
      flex: 1,
      paddingHorizontal: designSystem.layout.containerPadding,
    },
    screenSafeArea: {
      flex: 1,
      paddingHorizontal: designSystem.layout.containerPadding,
      paddingBottom: designSystem.layout.pageBottomPadding,
    },

    // ===== DIVIDER & SEPARATOR =====
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: designSystem.spacing.md,
    },
    hairlineDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
    },

    // ===== EMPTY STATE =====
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: designSystem.spacing.xl,
      paddingVertical: designSystem.spacing.xxxl,
    },
    emptyIconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: designSystem.spacing.xxxl,
      backgroundColor: colors.buttonGradient[0] + "10",
    },
    emptyTitle: {
      ...designSystem.typography.headingMD,
      color: colors.text,
      marginBottom: designSystem.spacing.md,
      textAlign: "center",
    },
    emptySubtitle: {
      ...designSystem.typography.bodyMD,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: designSystem.spacing.xxxxl,
      lineHeight: 24,
    },

    // ===== SPACING UTILITIES =====
    gap_xs: { gap: designSystem.spacing.xs },
    gap_sm: { gap: designSystem.spacing.sm },
    gap_md: { gap: designSystem.spacing.md },
    gap_lg: { gap: designSystem.spacing.lg },
    gap_xl: { gap: designSystem.spacing.xl },

    mt_xs: { marginTop: designSystem.spacing.xs },
    mt_sm: { marginTop: designSystem.spacing.sm },
    mt_md: { marginTop: designSystem.spacing.md },
    mt_lg: { marginTop: designSystem.spacing.lg },
    mt_xl: { marginTop: designSystem.spacing.xl },

    mb_xs: { marginBottom: designSystem.spacing.xs },
    mb_sm: { marginBottom: designSystem.spacing.sm },
    mb_md: { marginBottom: designSystem.spacing.md },
    mb_lg: { marginBottom: designSystem.spacing.lg },
    mb_xl: { marginBottom: designSystem.spacing.xl },

    // ===== STATUS & STATE STYLES =====
    errorText: {
      ...designSystem.typography.bodyXS,
      color: colors.error,
      marginTop: designSystem.spacing.xs,
      marginLeft: designSystem.spacing.sm,
    },
    successText: {
      ...designSystem.typography.bodyXS,
      color: colors.success,
      marginTop: designSystem.spacing.xs,
    },
    disabledOpacity: {
      opacity: 0.6,
    },
  });
};

export const theme = {
  light: {
    background: "#F8F9FA",
    card: "#FFFFFF",
    text: "#1C1C1E",
    textSecondary: "#666666",
    primary: "#007AFF",
    success: "#34C759",
    warning: "#FF9500",
    danger: "#FF3B30",
    border: "#E5E5EA",
  },
  dark: {
    background: "#121212",
    card: "#1C1C1E",
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    primary: "#0A84FF",
    success: "#30D158",
    warning: "#FF9F0A",
    danger: "#FF453A",
    border: "#38383A",
  },
  priority: {
    High: "#FF3B30",
    Medium: "#FF9500",
    Low: "#34C759",
  },
};

export type Theme = typeof theme.light;

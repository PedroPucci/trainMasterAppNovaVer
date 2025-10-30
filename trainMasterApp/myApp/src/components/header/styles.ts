import { StyleSheet } from "react-native";

const BG = "#50C2C9";
const CIRCLE = "rgba(255,255,255,0.35)";
const TEXT_ON_BG = "#ffffff";
const TEXT_DARK = "#0F1E25";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },
  circleLg: {
    position: "absolute",
    top: -70,
    left: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: CIRCLE,
  },
  circleSm: {
    position: "absolute",
    top: -26,
    left: 120,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clock: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: "800",
  },
  
  logout: {
    color: TEXT_ON_BG,
    fontSize: 18,
    fontWeight: "700",
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 4,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: TEXT_ON_BG,
  },
  avatarPlaceholder: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: TEXT_ON_BG,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  greeting: {
    marginTop: 8,
  },
  greetingLight: {
    color: TEXT_ON_BG,
    fontSize: 22,
    fontWeight: "700",
  },
  greetingBold: {
    color: TEXT_ON_BG,
    fontSize: 26,
    fontWeight: "800",
  },
});
import { StyleSheet }
from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 1,
    right: 1,
    bottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#50C2C9",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 6,
  },
  icon: {
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    opacity: 0.7,
  },
  labelActive: {
    fontWeight: "600",
    opacity: 1,
  },
});
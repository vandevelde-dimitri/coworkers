import { StyleSheet, Text, View } from "react-native";

export function CustomToast({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={toastStyles.container}>
      <View style={toastStyles.content}>
        <Text style={toastStyles.title}>{title}</Text>
        <Text style={toastStyles.message}>{message}</Text>
      </View>
    </View>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  message: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
});

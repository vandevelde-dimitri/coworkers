import { Text, View } from "react-native";

export function Section({ title, children }) {
    return (
        <View style={{ marginTop: 24 }}>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "700",
                    marginBottom: 8,
                    color: "#374151",
                }}
            >
                {title}
            </Text>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                {children}
            </View>
        </View>
    );
}

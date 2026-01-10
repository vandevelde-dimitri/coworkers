import { Text, View } from "react-native";

export function InfoRow({
    label,
    value,
    isLast,
}: {
    label: string;
    value?: string;
    isLast?: boolean;
}) {
    return (
        <View
            style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: "#e5e7eb",
            }}
        >
            <Text style={{ fontSize: 13, color: "#6b7280" }}>{label}</Text>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 2,
                    color: "#111827",
                }}
            >
                {value || "-"}
            </Text>
        </View>
    );
}

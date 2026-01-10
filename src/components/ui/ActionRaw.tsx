import FeatherIcon from "@expo/vector-icons/Feather";
import { Text, TouchableOpacity } from "react-native";

export function ActionRow({
    label,
    onPress,
    icon = "chevron-right",
    isLast,
}: {
    label: string;
    onPress: () => void;
    icon?: string;
    isLast?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: "#e5e7eb",
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#111827",
                }}
            >
                {label}
            </Text>
            <FeatherIcon name={icon} size={18} color="#9ca3af" />
        </TouchableOpacity>
    );
}

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export function MenuItem({
    icon,
    label,
    onPress,
}: {
    icon: IoniconName;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={[
                    "rgba(255, 255, 255, 0.08)",
                    "rgba(255, 255, 255, 0.03)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.menuItem}
            >
                <View style={styles.menuIconBg}>
                    <Ionicons name={icon} size={16} color="#fff" />
                </View>
                <Text style={styles.menuItemText}>{label}</Text>
                <Ionicons name="chevron-forward" size={14} color="#333" />
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    menuIconBg: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    menuItemText: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "500" },
});

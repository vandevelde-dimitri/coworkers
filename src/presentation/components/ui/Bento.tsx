import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export function Bento({
    icon,
    label,
    value,
}: {
    icon: IoniconName;
    label: string;
    value: string;
}) {
    return (
        <View>
            <LinearGradient
                colors={[
                    "rgba(255, 255, 255, 0.08)",
                    "rgba(255, 255, 255, 0.03)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bentoBox}
            >
                {icon && <Ionicons name={icon} size={16} color="#3B82F6" />}
                <Text style={styles.bentoLabel}>{label}</Text>
                <Text style={styles.bentoValue} numberOfLines={1}>
                    {value}
                </Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    bentoBox: {
        flex: 1,
        padding: 15,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        width: 150,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    bentoLabel: { color: "#666", fontSize: 12, marginTop: 10 },
    bentoValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 2,
    },
});

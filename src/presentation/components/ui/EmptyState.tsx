import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

interface EmptyStateProps {
    iconName: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    description: string;
    buttonText?: string;
    onPress?: () => void;
}

export const EmptyState = ({
    iconName,
    title,
    description,
    buttonText,
    onPress,
}: EmptyStateProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name={iconName} size={80} color="#141E30" />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {buttonText && onPress && (
                <AppButton title={buttonText} onPress={onPress} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        marginTop: 50,
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "#F1F3F5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: "#6C757D",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },
});

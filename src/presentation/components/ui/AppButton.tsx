import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { ComponentProps } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    icon?: IoniconName;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const AppButton = ({
    title,
    onPress,
    variant = "primary",
    icon,
    isLoading = false,
    disabled = false,
    style,
}: AppButtonProps) => {
    const getGradientColors = (): readonly [string, string, ...string[]] => {
        if (disabled) return ["#D1D5DB", "#9CA3AF"];

        switch (variant) {
            case "primary":
                return ["#243B55", "#141E30"];
            case "secondary":
                return ["#4B5563", "#1F2937"];
            case "danger":
                return ["#991B1B", "#7F1D1D"];
            case "outline":
                return ["transparent", "transparent"];
            default:
                return ["#243B55", "#141E30"];
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[styles.wrapper, style]}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.button,
                    variant === "outline" && styles.buttonOutline,
                    disabled && styles.disabledOpacity,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={variant === "outline" ? "#243B55" : "#FFF"}
                    />
                ) : (
                    <View style={styles.content}>
                        <Text
                            style={[
                                styles.text,
                                variant === "outline" && styles.textOutline,
                            ]}
                        >
                            {title}
                        </Text>
                        {icon && (
                            <Ionicons
                                name={icon}
                                size={16}
                                color={
                                    variant === "outline" ? "#243B55" : "#FFF"
                                }
                            />
                        )}
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 14,
        overflow: "hidden",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        minHeight: 52,
    },
    buttonOutline: {
        borderWidth: 1.5,
        borderColor: "#243B55",
        backgroundColor: "transparent",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    text: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    textOutline: {
        color: "#243B55",
    },
    disabledOpacity: {
        opacity: 0.6,
    },
});

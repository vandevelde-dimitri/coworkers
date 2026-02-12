import { LinearGradient } from "expo-linear-gradient";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

// Types des variantes pour la cohérence du design
type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    icon?: SymbolViewProps["name"];
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
    // Configuration des gradients selon ton thème Slate & Sky
    const getGradientColors = (): readonly [string, string, ...string[]] => {
        if (disabled) return ["#D1D5DB", "#9CA3AF"]; // État désactivé (Gris)

        switch (variant) {
            case "primary":
                return ["#243B55", "#141E30"]; // Slate & Sky
            case "secondary":
                return ["#4B5563", "#1F2937"]; // Ardoise moyen
            case "danger":
                return ["#991B1B", "#7F1D1D"]; // Rouge profond (Pro)
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
                            <SymbolView
                                name={icon}
                                size={16}
                                tintColor={
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
        overflow: "hidden", // Important pour que le gradient suive le radius
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        minHeight: 52, // Taille standard "Pro" pour le tactile
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

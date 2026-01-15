import { Text, TouchableOpacity, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "disabled";

type ButtonProps = {
    label: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    style?: ViewStyle;
    disabled?: boolean;
};

export default function Button({
    label,
    onPress,
    variant = "primary",
    style,
    disabled,
}: ButtonProps) {
    const isDisabled = variant === "disabled" || disabled;

    const containerStyle = {
        primary: {
            backgroundColor: "#2563eb",
        },
        secondary: {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "#2563eb",
        },
        danger: {
            backgroundColor: "#dc2626",
        },
        disabled: {
            backgroundColor: "#e5e7eb",
        },
    }[variant];

    const textStyle = {
        primary: { color: "#ffffff" },
        secondary: { color: "#2563eb" },
        danger: { color: "#ffffff" },
        disabled: { color: "#9ca3af" },
    }[variant];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                {
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    marginBottom: 10,
                    alignItems: "center",
                },
                containerStyle,
                style,
            ]}
        >
            <Text
                style={[
                    {
                        fontWeight: "600",
                        textAlign: "center",
                    },
                    textStyle,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

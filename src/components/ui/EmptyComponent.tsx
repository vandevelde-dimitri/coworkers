import React from "react";
import { Text, View } from "react-native";
import Button from "./Button";

type EmptyStateProps = {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
};

export default function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <View
            style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 24,
            }}
        >
            {/* Titre */}
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#111827",
                    textAlign: "center",
                    marginBottom: 8,
                }}
            >
                {title}
            </Text>

            {/* Description */}
            <Text
                style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    marginBottom: actionLabel ? 24 : 0,
                }}
            >
                {description}
            </Text>

            {/* Action */}
            {actionLabel && onAction && (
                // <TouchableOpacity
                //     onPress={onAction}
                //     style={{
                //         backgroundColor: "#2563EB",
                //         paddingHorizontal: 20,
                //         paddingVertical: 12,
                //         borderRadius: 12,
                //     }}
                // >
                //     <Text
                //         style={{
                //             color: "#ca1616",
                //             fontWeight: "600",
                //             fontSize: 15,
                //         }}
                //     >
                //         {actionLabel}
                //     </Text>
                // </TouchableOpacity>
                <Button label={actionLabel} onPress={onAction} />
            )}
        </View>
    );
}

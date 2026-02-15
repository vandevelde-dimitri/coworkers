import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface StackHeaderProps {
    title?: string;
    showBackButton?: boolean;
    rightElement?: React.ReactNode;
    backgroundColor?: string;
}

export const StackHeader = ({
    title,
    showBackButton = true,
    rightElement,
    backgroundColor = "#141E30",
}: StackHeaderProps) => {
    const router = useRouter();

    const isDark =
        backgroundColor === "#141E30" || backgroundColor === "transparent";
    const contentColor = isDark ? "#FFFFFF" : "#1A1A1A";
    const buttonBg = isDark ? "rgba(255, 255, 255, 0.1)" : "#F8F9FA";

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.content}>
                <View style={styles.sideContainer}>
                    {showBackButton && (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[
                                styles.backButton,
                                { backgroundColor: buttonBg },
                            ]}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={22}
                                color={contentColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.centerContainer}>
                    {title && (
                        <Text
                            numberOfLines={1}
                            style={[styles.title, { color: contentColor }]}
                        >
                            {title}
                        </Text>
                    )}
                </View>

                <View
                    style={[styles.sideContainer, { alignItems: "flex-end" }]}
                >
                    {rightElement ? (
                        rightElement
                    ) : (
                        <View style={{ width: 40 }} />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" ? 50 : 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
    },
    sideContainer: {
        flex: 1,
        justifyContent: "center",
    },
    centerContainer: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: -0.3,
    },
});

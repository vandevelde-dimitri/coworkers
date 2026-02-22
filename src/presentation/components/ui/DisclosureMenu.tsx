import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function MenuDisclosureSection({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.menuSection}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleOpen}
                style={styles.header}
            >
                <Text style={styles.menuTitle}>{title}</Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                />
            </TouchableOpacity>

            {isOpen && <View style={styles.content}>{children}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    menuSection: {
        marginBottom: 20,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    menuTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    content: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
});

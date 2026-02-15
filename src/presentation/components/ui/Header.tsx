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
    backgroundColor = "#FFF",
}: StackHeaderProps) => {
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.content}>
                {/* Section Gauche */}
                <View style={styles.sideContainer}>
                    {showBackButton && (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#141E30"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Section Centre */}
                <View style={styles.centerContainer}>
                    {title && (
                        <Text numberOfLines={1} style={styles.title}>
                            {title}
                        </Text>
                    )}
                </View>

                {/* Section Droite */}
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
        paddingTop: Platform.OS === "ios" ? 50 : 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
    },
    sideContainer: {
        flex: 1,
        justifyContent: "center",
    },
    centerContainer: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1A1A1A",
    },
});

import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

interface UserHeaderProps {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    contract?: string;
    dateLabel?: string;
    style?: ViewStyle;
}

export const UserHeader = ({
    firstName,
    lastName,
    avatarUrl,
    contract,
    dateLabel,
    style,
}: UserHeaderProps) => {
    return (
        <View style={[styles.wrapper, style]}>
            <View style={styles.container}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{
                            uri: avatarUrl || "https://via.placeholder.com/150",
                        }}
                        style={styles.avatar}
                    />
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.fullName}>
                        {firstName} {lastName}
                    </Text>

                    <View style={styles.badgeRow}>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {contract || "Employé"}
                            </Text>
                        </View>
                        <Text style={styles.sinceText}>{dateLabel}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingVertical: 20,
        alignItems: "center",
        overflow: "hidden",
    },
    gradientBg: {
        position: "absolute",
        top: -50,
        width: "120%",
        height: 200,
        borderRadius: 100,
        opacity: 0.5,
    },
    container: {
        alignItems: "center",
        zIndex: 1,
    },
    avatarWrapper: {
        position: "relative",
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: "#111",
    },
    infoSection: {
        alignItems: "center",
        marginTop: 15,
    },
    fullName: {
        fontSize: 26,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: -0.5,
    },
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        gap: 10,
    },
    roleBadge: {
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(59, 130, 246, 0.3)",
    },
    roleText: {
        color: "#3B82F6",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    sinceText: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.5)",
        fontWeight: "500",
    },
});

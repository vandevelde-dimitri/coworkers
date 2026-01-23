import { StyleSheet, Text, View } from "react-native";
import SmartImage from "./ui/SmartImage";

export function ProfileCardUser({ user }) {
    return (
        <View style={styles.profileCard}>
            <SmartImage userData={user} />
            <Text style={styles.name}>
                {user?.firstname} {user?.lastname}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
});

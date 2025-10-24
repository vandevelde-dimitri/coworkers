import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/authContext";
import { useCurrentUser } from "../hooks/user/useUsers";

export function ProfileCard() {
    const { data: user } = useCurrentUser();
    const { session } = useAuth();

    return (
        <View style={styles.profileCard}>
            <Image
                style={styles.avatar}
                source={{
                    uri: "https://randomuser.me/api/portraits/men/32.jpg",
                }}
            />
            <Text style={styles.name}>
                {user?.firstname} {user?.lastname}
            </Text>
            <Text style={styles.email}>{session?.user.email}</Text>
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 9999,
        marginBottom: 12,
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

import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/authContext";
import { useCurrentUser } from "../hooks/user/useUsers";
import SmartImage from "./ui/SmartImage";

export function ProfileCard() {
    const { data: user, isLoading } = useCurrentUser();
    const { session } = useAuth();
    if (isLoading) return <Text>Loading...</Text>;
    console.log("user => ", user);

    return (
        <View style={styles.profileCard}>
            <SmartImage
                userData={user}
                // style={{
                //     width: 80,
                //     height: 80,
                //     borderRadius: 9999,
                //     marginBottom: 12,
                // }}
                // source={{
                //     uri:
                //         getAvatarUrl(
                //             user?.image_profile,
                //             user?.avatar_updated_at
                //         ) || "https://randomuser.me/api/portraits/men/32.jpg",
                // }}
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

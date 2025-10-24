import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../../utils/formatedDate";
import { AnnouncementWithUser } from "../types/announcement.interface";
import { Contract } from "../types/enum/contract.enum";

type AnnouncementCardListProps = {
    data: AnnouncementWithUser;
    index: number;
};

export default function AnnouncementCardList({
    data,
    index,
}: AnnouncementCardListProps) {
    const date_start_formated = formatDate(data.date_start);
    const date_end_formated = formatDate(data.date_end);
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            key={data.id}
            style={[styles.card, index === 0 && { marginTop: 12 }]}
            onPress={() => {
                // router.push(`/(tabs)/(home)/announcement/${data.id}`);
                navigation.navigate("AnnouncementDetail", { id: data.id });
            }}
        >
            <Image
                source={{
                    uri:
                        data.image_profile ||
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={[
                    styles.avatar,
                    data.contract === Contract.CDI
                        ? { borderColor: "#1D4ED8" }
                        : { borderColor: "#10B981" },
                ]}
            />

            <View style={styles.cardBody}>
                <Text style={styles.name}>{data.user_name}</Text>

                <Text style={styles.date}>{data.city}</Text>
                <Text style={styles.date}>
                    {`${
                        data.date_end
                            ? `Du ${date_start_formated} au ${date_end_formated}`
                            : `A partir du ${date_start_formated}`
                    }`}
                </Text>
                <Text
                    style={[
                        styles.places,
                        data.number_of_places === 0 && {
                            color: "#ff0000",
                        },
                    ]}
                >
                    {data.number_of_places} place
                    {data.number_of_places > 1 ? "s" : ""} dispo
                </Text>
            </View>

            <Feather name="chevron-right" size={22} color="#bcbcbc" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        marginRight: 12,
    },
    cardBody: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: "#666",
    },
    places: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "600",
        color: "#10B981",
    },
});

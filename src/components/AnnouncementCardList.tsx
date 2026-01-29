import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../../utils/formatedDate";
import { AnnouncementWithUser } from "../types/announcement.interface";
import { Card } from "./ui/Card";
import SmartImage from "./ui/SmartImage";

type AnnouncementCardListProps = {
    data: AnnouncementWithUser;
};

export default function AnnouncementCardList({
    data,
}: AnnouncementCardListProps) {
    const date_start_formated = formatDate(data.date_start);
    const date_end_formated = formatDate(data.date_end);
    const navigation = useNavigation();

    return (
        <Card>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                }}
            >
                <SmartImage
                    size={44}
                    userData={{
                        image_profile:
                            data.image_profile || data.users?.image_profile,
                        avatar_updated_at:
                            data.avatar_updated_at ||
                            data.users?.avatar_updated_at,
                        contract: data.contract || data.users?.contract,
                        user_id: data.user_id || data.users?.user_id || "",
                    }}
                />

                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontWeight: "600" }}>{data.user_name}</Text>
                    {/* ✅ LE BADGE VÉHICULE */}
                    <View
                        style={{
                            backgroundColor: "#DBEAFE",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 6,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <FeatherIcon name="truck" size={10} color="#1E40AF" />
                        <Text
                            style={{
                                color: "#1E40AF",
                                fontSize: 10,
                                fontWeight: "700",
                            }}
                        >
                            {data.to_convey ? "Véhiculer" : "non véhiculer"}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        {new Date(data.date_start).toLocaleString()}
                    </Text>
                </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: "700" }}>
                {data.title}
            </Text>

            <Text style={{ marginTop: 4, color: "#374151" }}>
                {data.content}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 12,
                }}
            >
                <Text>Places: {data.number_of_places}</Text>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("HomeStack", {
                            screen: "AnnouncementDetail",
                            params: { id: data.id },
                        })
                    }
                >
                    <Text
                        style={{
                            color: "#2563eb",
                            fontWeight: "600",
                        }}
                    >
                        Voir détails
                    </Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
}

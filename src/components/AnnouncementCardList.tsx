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

    console.log("data", data);

    return (
        <Card>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                }}
            >
                <SmartImage size={44} userData={data} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontWeight: "600" }}>{data.user_name}</Text>
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

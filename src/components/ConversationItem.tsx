import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../../utils/formatedDate";
import { ConversationPreview } from "../api/user/getUserConversations";
import { Card } from "./ui/Card";
import SmartImage from "./ui/SmartImage";

export default function ConversationItem({
    item,
    unread,
    onPress,
}: {
    item: ConversationPreview;
    unread: boolean;
    onPress: () => void;
}) {
    console.log("Conversation ✔ item", item);

    const date_formatted = formatDate(item.last_message_time);

    return (
        <TouchableOpacity key={item.conversation_id} onPress={onPress}>
            <Card>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <SmartImage size={44} userData={item} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>
                            {item.annonce_title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ color: "#6b7280", fontSize: 13 }}
                        >
                            {item.last_message || "Aucun message"}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: "flex-end",
                            flexDirection: "row",
                            gap: 8,
                        }}
                    >
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            {date_formatted}
                        </Text>
                        {unread && (
                            <View
                                style={{
                                    backgroundColor: "#2563eb",
                                    width: 10,
                                    height: 10,
                                    borderRadius: 8,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 6,
                                }}
                            />
                        )}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

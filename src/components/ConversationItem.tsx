import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ConversationPreview } from "../api/user/getUserConversations";
import { Avatar } from "./ui/Avatar";
import { Card } from "./ui/Card";

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

    return (
        <TouchableOpacity key={item.conversation_id} onPress={onPress}>
            <Card>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Avatar uri={item.image_profile} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>
                            {item.annonce_title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ color: "#6b7280", fontSize: 13 }}
                        >
                            {item.last_message}
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            {item.last_message_time}
                        </Text>
                        {unread && (
                            <View
                                style={{
                                    backgroundColor: "#2563eb",
                                    borderRadius: 5,
                                    minWidth: 10,
                                    minHeight: 10,
                                    paddingHorizontal: 6,
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

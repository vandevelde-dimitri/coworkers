import React from "react";
import { Text, View } from "react-native";
import { Avatar } from "./ui/Avatar";

type Message = {
    content: string;
    created_at: string;
    isMine: boolean;
    avatar?: string | null;
};

type Props = {
    message: Message;
};

export default function MessageBubble({ message }: Props) {
    const { isMine, content, created_at, avatar } = message;
    const avatarUri =
        avatar ??
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    return (
        <View
            style={{
                flexDirection: isMine ? "row-reverse" : "row",
                alignItems: "flex-end",
                marginBottom: 12,
            }}
        >
            {!isMine && <Avatar uri={avatarUri} />}

            <View
                style={{
                    backgroundColor: isMine ? "#2563eb" : "#e5e7eb",
                    borderRadius: 16,
                    padding: 12,
                    marginHorizontal: 8,
                    maxWidth: "75%",
                }}
            >
                <Text style={{ color: isMine ? "#fff" : "#000" }}>
                    {content}
                </Text>

                <Text
                    style={{
                        fontSize: 10,
                        color: isMine ? "#dbeafe" : "#6b7280",
                        marginTop: 4,
                        textAlign: "right",
                    }}
                >
                    {new Date(created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
        </View>
    );
}

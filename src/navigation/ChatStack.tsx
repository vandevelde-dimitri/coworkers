import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ConversationsListScreen from "../screens/chat/conversationListScreen";
import ChatScreen from "../screens/chat/messengingScreen";
import { useRequireAuth } from "../hooks/useRequireAuth";

const Stack = createNativeStackNavigator<any>();

export default function ChatStack() {
    useRequireAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="conversationsList"
                component={ConversationsListScreen}
                options={{ title: "" }}
            />
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{ title: "Détail de l'annonce" }}
            />
        </Stack.Navigator>
    );
}

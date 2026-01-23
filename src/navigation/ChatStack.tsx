import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ConversationsListScreen from "../screens/chat/conversationListScreen";
import ChatScreen from "../screens/chat/messengingScreen";
import UserScreen from "../screens/users/userProfileScreen";

export type ChatStackParamList = {
    conversationsList: undefined;
    ChatScreen: { conversationId: string };
    ProfileUserScreen: { id: string };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStack() {
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
            <Stack.Screen
                name="ProfileUserScreen"
                component={UserScreen}
                options={{ title: "Profil utilisateur" }}
            />
        </Stack.Navigator>
    );
}

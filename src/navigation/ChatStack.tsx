import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AnnouncementDetailScreen from "../screens/home/AnnouncementDetailScreen";
import HomeScreen from "../screens/home/HomeScreen";
import { HomeStackParamList } from "../types/navigation/homeStackType";
import ConversationsListScreen from "../screens/chat/conversationListScreen";
import ChatScreen from "../screens/chat/messengingScreen";

const Stack = createNativeStackNavigator<any>();

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
        </Stack.Navigator>
    );
}

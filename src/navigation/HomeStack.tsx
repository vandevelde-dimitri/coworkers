import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AnnouncementDetailScreen from "../screens/home/AnnouncementDetailScreen";
import HomeScreen from "../screens/home/HomeScreen";
import { HomeStackParamList } from "../types/navigation/homeStackType";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Accueil",
                }}
            />
            <Stack.Screen
                name="AnnouncementDetail"
                component={AnnouncementDetailScreen}
                options={{ title: "Détail de l'annonce" }}
            />
        </Stack.Navigator>
    );
}

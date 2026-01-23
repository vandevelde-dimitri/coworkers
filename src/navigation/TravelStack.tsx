import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TravelScreen from "../screens/travel/TravelScreen";
import UserScreen from "../screens/users/userProfileScreen";
import { TravelStackParamList } from "../types/navigation/travelStackType";

const Stack = createNativeStackNavigator<TravelStackParamList>();

export default function TravelStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="TravelHome"
                component={TravelScreen}
                options={{ title: "Mes trajets" }}
            />
            <Stack.Screen
                name="ProfileUserScreen"
                component={UserScreen}
                options={{ title: "Profil utilisateur" }}
            />
        </Stack.Navigator>
    );
}

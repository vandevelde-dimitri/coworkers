import FeatherIcon from "@expo/vector-icons/Feather";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileHome"
                component={ProfileScreen}
                options={({ navigation }) => ({
                    title: "Profil",
                    headerRight: () => (
                        <FeatherIcon
                            color="#1D2A32"
                            name="settings"
                            size={25}
                            style={{ marginRight: 16 }}
                            onPress={() =>
                                navigation.navigate("SettingsScreen")
                            }
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ title: "Détail de l'utilisateur" }}
            />
        </Stack.Navigator>
    );
}

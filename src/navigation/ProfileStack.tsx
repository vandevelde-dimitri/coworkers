import FeatherIcon from "@expo/vector-icons/Feather";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import NotificationsScreen from "../screens/notification/notificationScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import CandidateProfile from "../screens/profile/candidateProfile";
import FavoriteScreen from "../screens/profile/favoriteScreen";
import UpdateAvatarScreen from "../screens/profile/updateAvatarScreen";
import { ProfileStackParamList } from "../types/navigation/profileStackType";
import { useRequireAuth } from "../hooks/useRequireAuth";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
    useRequireAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
            <Stack.Screen
                name="EditProfileScreen"
                component={EditProfileScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
                options={{ title: "Mes favoris" }}
            />
            <Stack.Screen
                name="AvatarRegistrationScreen"
                component={UpdateAvatarScreen}
                options={{ title: "Mes favoris" }}
            />
            <Stack.Screen
                name="NotificationsScreen"
                component={NotificationsScreen}
                options={{ title: "Mes Notifications" }}
            />
            <Stack.Screen
                name="CandidateProfile"
                component={CandidateProfile}
                options={{ title: "Mes candidatures" }}
            />
        </Stack.Navigator>
    );
}

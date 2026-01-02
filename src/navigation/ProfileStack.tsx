import FeatherIcon from "@expo/vector-icons/Feather";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import NotificationsScreen from "../screens/notification/notificationScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import AvatarRegistrationScreen from "../screens/profile/avatarScreen";
import CandidateProfile from "../screens/profile/candidateProfile";
import ContractRegistrationScreen from "../screens/profile/contract";
import EmailRegistrationScreen from "../screens/profile/email";
import FavoriteScreen from "../screens/profile/favoriteScreen";
import FloorRegistrationScreen from "../screens/profile/floor";
import LocationRegistrationScreen from "../screens/profile/location";
import TeamRegistrationScreen from "../screens/profile/team";
import UsernameRegisterScreen from "../screens/profile/username";
import { ProfileStackParamList } from "../types/navigation/profileStackType";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
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
                name="ContractRegistrationScreen"
                component={ContractRegistrationScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="FloorRegistrationScreen"
                component={FloorRegistrationScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="LocationRegistrationScreen"
                component={LocationRegistrationScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="TeamRegistrationScreen"
                component={TeamRegistrationScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="UsernameRegisterScreen"
                component={UsernameRegisterScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="EmailRegistrationScreen"
                component={EmailRegistrationScreen}
                options={{ title: "Modification de l'utilisateur" }}
            />
            <Stack.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
                options={{ title: "Mes favoris" }}
            />
            <Stack.Screen
                name="AvatarRegistrationScreen"
                component={AvatarRegistrationScreen}
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

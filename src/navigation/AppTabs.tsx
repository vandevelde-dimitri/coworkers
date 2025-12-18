import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HapticTab } from "../components/HapticTab";
import { IconSymbol } from "../components/ui/IconSymbol";
import { useMessageStatus } from "../contexts/messageContext";
import TravelScreen from "../screens/travel/TravelScreen";
import ChatStack from "./ChatStack";
import FormStack from "./FormStack";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const { unreadCount } = useMessageStatus();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#10B981",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarButton: HapticTab,
                tabBarStyle: Platform.select({
                    ios: { position: "absolute" },
                    android: {},
                    default: {},
                }),
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        const state = navigation.getState();
                        const stack = state.routes.find(
                            (r) => r.name === "HomeStack"
                        );
                        if (stack && stack.state?.index! > 0) {
                            e.preventDefault();
                            navigation.navigate("HomeStack", {
                                screen: "Home",
                            });
                        }
                    },
                })}
            />

            <Tab.Screen
                name="Travel"
                component={TravelScreen}
                options={{
                    title: "Mes trajets",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="car.fill" color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="FormStack"
                component={FormStack}
                options={{
                    title: "",
                    tabBarIcon: () => (
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: "#10B981",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 20,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <IconSymbol
                                size={28}
                                name="plus.circle"
                                color={"#fff"}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color }) => (
                        <View style={{ position: "relative" }}>
                            <IconSymbol
                                size={28}
                                name="message.fill"
                                color={color}
                            />

                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    {unreadCount < 10 && (
                                        <Text style={styles.badgeText}>
                                            {unreadCount}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="person.crop.circle.fill"
                            color={color}
                        />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        const state = navigation.getState();
                        const stack = state.routes.find(
                            (r) => r.name === "ProfileStack"
                        );
                        if (stack && stack.state?.index! > 0) {
                            e.preventDefault();
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: "ProfileStack",
                                            state: {
                                                routes: [
                                                    { name: "ProfileHome" },
                                                ],
                                            },
                                        },
                                    ],
                                })
                            );
                        }
                    },
                })}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: "absolute",
        top: -4,
        right: -8,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
});

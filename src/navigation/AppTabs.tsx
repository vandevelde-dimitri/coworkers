import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import { Platform, View } from "react-native";
import { HapticTab } from "../components/HapticTab";
import { IconSymbol } from "../components/ui/IconSymbol";
import ChatScreen from "../screens/chat/messengingScreen";
import TravelScreen from "../screens/travel/TravelScreen";
import FormStack from "./FormStack";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
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
                component={ChatScreen}
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="message.fill"
                            color={color}
                        />
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

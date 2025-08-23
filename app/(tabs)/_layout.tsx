import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#10B981",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarButton: HapticTab,

                // tabBarBackground: BlurTabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                    },
                    android: {
                        // backgroundColor: "#000", // couleur noire
                        // borderTopWidth: 0,
                        // elevation: 0,
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Acceuil",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(travel)"
                options={{
                    title: "Mes trajets",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="car.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="test"
                options={{
                    title: "",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: "#10B981",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 20, // pour qu'il dépasse de la tabBar
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
            <Tabs.Screen
                name="(chat)"
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
            <Tabs.Screen
                name="account"
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
            />
        </Tabs>
    );
}

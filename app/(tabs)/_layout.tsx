import { CurvedBottomTabs } from "@/src/presentation/components/ui/base/curved-bottom-tabs";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { session } = useAuth();
    const router = useRouter();
    const isLoggedIn = !!session;
    const colorScheme = useColorScheme();
    const protectedAction = (e: any) => {
        if (!isLoggedIn) {
            e.preventDefault();
            router.push("/(auth)/welcome");
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                tabBar={(props) => <CurvedBottomTabs {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Acceuil",

                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="travel"
                    options={{
                        title: "Mes trajets",
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons
                                name={focused ? "car" : "car-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{ tabPress: (e) => protectedAction(e) }}
                />

                <Tabs.Screen
                    name="add"
                    options={{
                        title: "Ajouter",
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons
                                name={
                                    focused
                                        ? "add-circle"
                                        : "add-circle-outline"
                                }
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{ tabPress: (e) => protectedAction(e) }}
                />
                <Tabs.Screen
                    name="messaging"
                    options={{
                        title: "Messages",
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons
                                name={focused ? "chatbox" : "chatbox-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{ tabPress: (e) => protectedAction(e) }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profil",
                        tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons
                                name={
                                    focused
                                        ? "person-circle"
                                        : "person-circle-outline"
                                }
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{ tabPress: (e) => protectedAction(e) }}
                />
            </Tabs>
        </GestureHandlerRootView>
    );
}

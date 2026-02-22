import { CurvedBottomTabs } from "@/src/presentation/components/ui/base/curved-bottom-tabs";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
    ExternalPathString,
    RelativePathString,
    Tabs,
    useRouter,
} from "expo-router";
import React from "react";
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

    const handleTabPress = (e: any, target: string) => {
        if (!isLoggedIn && target !== "home") {
            e.preventDefault();
            router.push("/(auth)/welcome");
            return;
        }

        e.preventDefault();

        if (router.canDismiss()) {
            router.dismissAll();
        }

        router.push(
            `/(tabs)/${target}` as RelativePathString | ExternalPathString,
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                tabBar={(props) => <CurvedBottomTabs {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Accueil",
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => handleTabPress(e, "home"),
                    }}
                />

                <Tabs.Screen
                    name="travel"
                    options={{
                        title: "Mes trajets",
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "car" : "car-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => handleTabPress(e, "travel"),
                    }}
                />

                <Tabs.Screen
                    name="formAnnouncement"
                    options={{
                        title: "Ajouter",
                        tabBarIcon: ({ focused }) => (
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
                    listeners={{
                        tabPress: (e) => {
                            handleTabPress(e, "formAnnouncement");
                        },
                    }}
                />

                <Tabs.Screen
                    name="messaging"
                    options={{
                        title: "Messages",
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "chatbox" : "chatbox-outline"}
                                size={20}
                                color={focused ? "#FFFFFF" : "#B9B9B9"}
                            />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => handleTabPress(e, "messaging"),
                    }}
                />

                <Tabs.Screen
                    name="account"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ focused }) => (
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
                    listeners={{
                        tabPress: (e) => handleTabPress(e, "account"),
                    }}
                />
            </Tabs>
        </GestureHandlerRootView>
    );
}

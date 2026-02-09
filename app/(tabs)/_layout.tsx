import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuth } from "@/src/presentation/hooks/authContext";

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
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="travel"
                options={{
                    title: "Mes trajets",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="car" color={color} />
                    ),
                }}
                listeners={{ tabPress: protectedAction }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "add",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="plus-circle" color={color} />
                    ),
                }}
                listeners={{ tabPress: protectedAction }}
            />
            <Tabs.Screen
                name="messaging"
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="envelope" color={color} />
                    ),
                }}
                listeners={{ tabPress: protectedAction }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="user" color={color} />
                    ),
                }}
                listeners={{ tabPress: protectedAction }}
            />
        </Tabs>
    );
}

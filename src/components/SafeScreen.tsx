import FeatherIcon from "@expo/vector-icons/Feather";
import { router, useSegments } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { containerStyles } from "../styles/container.styles";

export default function SafeScreen({
    children,
    title,
    backBtn,
}: {
    children: React.ReactNode;
    title?: string;
    backBtn?: boolean;
}): React.JSX.Element {
    const insets = useSafeAreaInsets();
    const segments = useSegments();

    const isEditProfile =
        segments[0] === "(tabs)" &&
        segments[1] === "account" &&
        segments[2] === undefined;

    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingTop: insets.top,
                    paddingBottom: 0, // Pas de padding bottom ici pour permettre le scroll complet
                },
            ]}
        >
            <View style={containerStyles.header}>
                {backBtn && (
                    <View style={containerStyles.headerBack}>
                        <FeatherIcon
                            color="#1D2A32"
                            name="chevron-left"
                            size={30}
                            onPress={() => router.back()}
                        />
                    </View>
                )}
                <Text style={containerStyles.headerTitle}>{title}</Text>
                {isEditProfile && (
                    <View style={containerStyles.headerEdit}>
                        <FeatherIcon
                            color="#1D2A32"
                            name="settings"
                            size={25}
                            onPress={() =>
                                router.push("/(tabs)/account/settings")
                            }
                        />
                    </View>
                )}
            </View>
            <View style={containerStyles.container}>{children}</View>
        </SafeAreaView>
    );
}

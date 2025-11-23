import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
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
    const navigation = useNavigation<any>();
    console.log("navigation", navigation.getState().routes.length);

    const isEditProfile =
        navigation.getState().routes[0].name === "ProfileHome";
    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingTop: 0,
                    paddingBottom: -insets.bottom, // Pas de padding bottom ici pour permettre le scroll complet
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
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                )}
                <Text style={containerStyles.headerTitle}>{title}</Text>
                {isEditProfile && (
                    <View style={containerStyles.headerEdit}>
                        <View style={{ flexDirection: "row", gap: 16 }}>
                            <FeatherIcon
                                color="#1D2A32"
                                name="bell"
                                size={25}
                                onPress={() =>
                                    navigation.navigate("NotificationsScreen")
                                }
                            />
                            <FeatherIcon
                                color="#1D2A32"
                                name="settings"
                                size={25}
                                onPress={() =>
                                    navigation.navigate("SettingsScreen")
                                }
                            />
                        </View>
                    </View>
                )}
            </View>
            <View style={containerStyles.container}>{children}</View>
        </SafeAreaView>
    );
}

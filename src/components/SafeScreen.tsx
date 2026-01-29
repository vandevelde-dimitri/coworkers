import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCanPost } from "../hooks/user/useCanPost";
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
    const { isVacationMode } = useCanPost();
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
            {true && (
                <View style={styles.vacationBar}>
                    <FeatherIcon
                        name="sun"
                        size={16}
                        color="#92400E"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.vacationText}>Mode vacances actif</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SettingsScreen")}
                        style={styles.vacationLink}
                    >
                        <Text style={styles.vacationLinkText}>Modifier</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={containerStyles.container}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    vacationBar: {
        backgroundColor: "#FEF3C7",
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#FDE68A",
    },
    vacationText: {
        color: "#92400E",
        fontSize: 13,
        fontWeight: "600",
    },
    vacationLink: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: "rgba(146, 64, 14, 0.1)",
        borderRadius: 4,
    },
    vacationLinkText: {
        color: "#92400E",
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
    },
});

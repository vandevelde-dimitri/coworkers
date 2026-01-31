import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { ReactNode } from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCanPost } from "../../hooks/user/useCanPost";

type ScreenWrapperProps = {
    title?: string;
    back?: boolean;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    rightActions?: ReactNode;
};

export default function ScreenWrapper({
    title,
    back = false,
    children,
    style = {},
    rightActions,
}: ScreenWrapperProps) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { isVacationMode } = useCanPost();

    const hasHeader = title || back || rightActions;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingBottom: -insets.bottom,
            }}
        >
            {/* Header */}
            {hasHeader && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        minHeight: 56,
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        position: "relative",
                    }}
                >
                    {back && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                position: "absolute",
                                left: 16,
                                zIndex: 10,
                            }}
                        >
                            <FeatherIcon
                                color="#1D2A32"
                                name="chevron-left"
                                size={24}
                            />
                        </TouchableOpacity>
                    )}

                    {title ? (
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#111827",
                                textAlign: "center",
                                maxWidth: "70%",
                            }}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    ) : (
                        <View style={{ height: 24 }} />
                    )}

                    {rightActions && (
                        <View
                            style={{
                                position: "absolute",
                                right: 16,
                                flexDirection: "row",
                                gap: 16,
                                zIndex: 10,
                            }}
                        >
                            {rightActions}
                        </View>
                    )}
                </View>
            )}

            {isVacationMode && (
                <View style={styles.vacationBar}>
                    <FeatherIcon
                        name="sun"
                        size={16}
                        color="#92400E"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.vacationText}>Mode vacances actif</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("ProfileStack", {
                                screen: "SettingsScreen",
                            })
                        }
                        style={styles.vacationLink}
                    >
                        <Text style={styles.vacationLinkText}>Modifier</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Contenu de l’écran */}
            <View
                style={[
                    {
                        flex: 1,
                        paddingHorizontal: 16,
                    },
                    style,
                ]}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    vacationBar: {
        backgroundColor: "#FEF3C7",
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
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

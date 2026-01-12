import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import React, { ReactNode } from "react";
import {
    StyleProp,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

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

    return (
        <SafeAreaView
            style={{
                flex: 1,
                // backgroundColor: "#0977e6ff",
                backgroundColor: "#F9FAFB",
                paddingTop: 0,
                paddingBottom: -insets.bottom,
            }}
        >
            {/* Header */}
            {title && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        position: "relative", // pour positionner les boutons absolus
                    }}
                >
                    {/* Bouton Back */}
                    {back && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                position: "absolute",
                                left: 16,
                                top: "50%",
                            }}
                        >
                            <FeatherIcon
                                color="#1D2A32"
                                name="chevron-left"
                                size={24}
                            />
                        </TouchableOpacity>
                    )}

                    {/* Titre centré */}
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#111827",
                            textAlign: "center",
                        }}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    {/* Boutons à droite */}
                    {rightActions && (
                        <View
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                flexDirection: "row",
                                gap: 16,
                            }}
                        >
                            {rightActions}
                        </View>
                    )}
                </View>
            )}

            {/* Contenu de l’écran */}
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    ...style,
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}

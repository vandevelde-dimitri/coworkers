import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

type ScreenWrapperProps = {
    title?: string;
    back?: boolean;
    children: ReactNode;
    style?: object;
    rightButtons?: ReactNode; // boutons optionnels à droite
};

export default function ScreenWrapper({
    title,
    back = false,
    children,
    style = {},
    rightButtons,
}: ScreenWrapperProps) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={{
                flex: 1,
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
                    {rightButtons && (
                        <View
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {rightButtons}
                        </View>
                    )}
                </View>
            )}

            {/* Contenu de l’écran */}
            <View style={{ flex: 1, padding: 16, ...style }}>{children}</View>
        </SafeAreaView>
    );
}

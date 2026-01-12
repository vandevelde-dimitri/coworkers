import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { ReactNode } from "react";
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

    // On affiche le header si on a un titre, un bouton retour OU des actions
    const hasHeader = title || back || rightActions;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
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
                        minHeight: 56, // On ajoute une hauteur minimale
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        position: "relative",
                    }}
                >
                    {/* Bouton Back - Sorti de la condition title */}
                    {back && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                position: "absolute",
                                left: 16,
                                zIndex: 10, // S'assure qu'il est cliquable
                            }}
                        >
                            <FeatherIcon
                                color="#1D2A32"
                                name="chevron-left"
                                size={24}
                            />
                        </TouchableOpacity>
                    )}

                    {/* Titre centré - Toujours présent si fourni */}
                    {title ? (
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#111827",
                                textAlign: "center",
                                maxWidth: "70%", // Évite de chevaucher les boutons
                            }}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    ) : (
                        <View style={{ height: 24 }} /> // Espaceur si pas de titre
                    )}

                    {/* Boutons à droite - Sorti de la condition title */}
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

            {/* Contenu de l’écran */}
            <View
                style={[
                    {
                        flex: 1,
                        paddingHorizontal: 16,
                    },
                    style, // Utilisation propre du style array/object
                ]}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}

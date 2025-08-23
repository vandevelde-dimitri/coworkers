import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import FeatherIcon from "@expo/vector-icons/Feather";
import { router, useSegments } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

    const isAnnouncementList = segments[1] === "(home)";

    return (
        <SafeAreaView
            style={[
                formAuthStyles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    // paddingLeft: insets.left,
                    // paddingRight: insets.right,
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
                <View style={containerStyles.headerTitle}>
                    <Text>{title}</Text>
                </View>
            </View>
            <View style={containerStyles.container}>{children}</View>
        </SafeAreaView>
    );
}

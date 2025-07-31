import { router } from "expo-router";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}
        >
            <View style={styles.hero}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <Text style={styles.title}>Coworkers</Text>
                    <Text style={styles.text}>
                        Partage ta route, simplifie tes trajets.
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/signup");
                    }}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Commencer l'aventure
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        color: "#281b52",
        textAlign: "center",
        marginBottom: 12,
        lineHeight: 40,
    },
    text: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: "400",
        color: "#9992a7",
        textAlign: "center",
    },
    /** Hero */
    hero: {
        backgroundColor: "#d8dffe",
        margin: 12,
        borderRadius: 16,
        padding: 16,
    },
    heroImage: {
        width: "100%",
        height: 400,
    },
    /** Content */
    content: {
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    contentHeader: {
        paddingHorizontal: 24,
    },
    appName: {
        backgroundColor: "#fff2dd",
        transform: [
            {
                rotate: "-5deg",
            },
        ],
        paddingHorizontal: 6,
    },
    appNameText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#281b52",
    },
    /** Button */
    button: {
        backgroundColor: "#56409e",
        paddingVertical: 20,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#fff",
    },
});

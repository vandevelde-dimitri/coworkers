import { Text, View } from "react-native";
import { BaseToast, ToastConfig } from "react-native-toast-message";
export const toastConfig: ToastConfig = {
    /* 1. Personnaliser le toast 'success' par défaut */
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: "#00D1B2", // Vert Coworker
                height: 70,
                backgroundColor: "#FFF",
                borderRadius: 12,
                marginTop: 10,
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#2D3436",
            }}
            text2Style={{
                fontSize: 13,
                color: "#636E72",
            }}
        />
    ),
    coworkerAlert:
        /* 2. Créer un toast totalement sur mesure (ex: 'coworkerAlert') */
        ({ text1, text2, props }) => (
            <View
                style={{
                    height: 60,
                    width: "90%",
                    backgroundColor: "#2D3436", // Fond sombre élégant
                    borderRadius: 30, // Forme pilule
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                }}
            >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    {text1}
                </Text>
                <Text style={{ color: "#FFF", marginLeft: 10 }}>{text2}</Text>
            </View>
        ),
};

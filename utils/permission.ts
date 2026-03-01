import * as ImagePicker from "expo-image-picker";
import { Alert, Linking, Platform } from "react-native";

export type PermissionType = "camera" | "mediaLibrary";

export async function requestPermission(type: PermissionType) {
    let permissionResult;

    switch (type) {
        case "camera":
            permissionResult =
                await ImagePicker.requestCameraPermissionsAsync();
            break;
        case "mediaLibrary":
            permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            break;
        default:
            throw new Error(`Permission inconnue : ${type}`);
    }

    if (!permissionResult.granted) {
        Alert.alert(
            "Permission refusée",
            "Vous devez autoriser l'accès pour continuer. Voulez-vous ouvrir les paramètres ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Ouvrir paramètres",
                    onPress: () =>
                        Platform.OS === "ios"
                            ? Linking.openURL("app-settings:")
                            : Linking.openSettings(),
                },
            ],
        );
        return false;
    }

    return true;
}

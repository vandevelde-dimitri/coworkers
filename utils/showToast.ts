// utils/showToast.ts
import Toast from "react-native-toast-message";
import { haptic } from "./hapticToast";

export function showToast(
    type: "success" | "error" | "info",
    text1: string,
    text2?: string,
    duration?: number
) {
    Toast.show({
        type,
        text1,
        text2,
        visibilityTime: duration || 2000,
    });

    haptic[type]();
}

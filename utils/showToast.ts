// utils/showToast.ts
import Toast from "react-native-toast-message";
import { queryClient } from "../App";
import { haptic } from "./hapticToast";

export function showToast(
    type: "success" | "error" | "info" | "warning",
    text1: string,
    text2?: string,
    duration?: number,
) {
    Toast.show({
        type,
        text1,
        text2,
        visibilityTime: duration || 2000,
    });

    // 🔍 Cherche n'importe quelle entrée de cache qui commence par "settingsUser"
    const cache = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["settingsUser"] });
    const settings: any = cache[0]?.state?.data;

    // On ne fait vibrer que si vibrations est à true (on assume true par défaut)
    const canVibrate = settings?.vibrations !== false;

    if (canVibrate) {
        haptic[type]();
    }
}

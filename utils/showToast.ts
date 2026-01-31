import Toast from "react-native-toast-message";
import { haptic } from "./hapticToast";
import { queryClient } from "./react-query";

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

    const cache = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["settingsUser"] });
    const settings: any = cache[0]?.state?.data;

    const canVibrate = settings?.vibrations !== false;

    if (canVibrate) {
        haptic[type]();
    }
}

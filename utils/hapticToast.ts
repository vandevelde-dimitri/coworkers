import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

export const haptic = {
    success() {
        if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Vibration.vibrate(30);
        }
    },

    error() {
        if (Platform.OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
            Vibration.vibrate([0, 40, 40, 40]);
        }
    },

    info() {
        if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            Vibration.vibrate(20);
        }
    },
};

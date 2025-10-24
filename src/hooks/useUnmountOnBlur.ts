import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export function useUnmountOnBlur() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ unmountOnBlur: true });
    }, [navigation]);
}

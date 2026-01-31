import { useSettingsUser } from "./useUsers";

export function useCanPost() {
    const { data: settings, isLoading } = useSettingsUser();

    const isVacationMode = settings?.available === false;

    return {
        canPost: !isVacationMode,
        isLoading,
        isVacationMode,
    };
}

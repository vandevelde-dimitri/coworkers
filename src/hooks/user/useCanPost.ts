// src/hooks/user/useCanPost.ts
import { useSettingsUser } from "./useUsers";

export function useCanPost() {
    const { data: settings, isLoading } = useSettingsUser();

    // On ne bloque que si on est CERTAIN d'être en vacances (available === false)
    // Si c'est en cours de chargement ou que la donnée manque, on laisse passer par défaut
    const isVacationMode = settings?.available === false;

    return {
        canPost: !isVacationMode,
        isLoading,
        isVacationMode,
    };
}

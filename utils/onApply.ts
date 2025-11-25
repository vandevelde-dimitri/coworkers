import { Alert } from "react-native";
import { StatusNotification } from "../src/types/enum/statusNotification.enum";
import { supabase } from "./supabase";

// utils/onApply.ts
export const onApply = async (annonce_id: string) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        console.log("User not logged in");
        return;
    }
    const user_id = data.session.user.id;
    const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
            "Confirmer",
            "Voulez-vous postuler ?",
            [
                {
                    text: "Annuler",
                    onPress: () => resolve(false),
                    style: "cancel",
                },
                { text: "Oui", onPress: () => resolve(true) },
            ],
            { cancelable: true }
        );
    });
    if (!confirmed) return;

    const { data: notification, error } = await supabase
        .from("user_annonces")
        .upsert({
            user_id,
            annonce_id,
            status: StatusNotification.PENDING,
        })
        .select();

    if (error) console.error("Erreur candidature:", error);
    else console.log("Candidature envoyée ✅", notification);
};

import { supabase } from "../../../utils/supabase";
import { EditProfileFormValues } from "../../types/user.interface";

export async function updateUser(values: EditProfileFormValues) {
    try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data?.session) throw new Error("No active session found");
        const session = data.session;

        const { data: user, error } = await supabase
            .from("users")
            .update({
                firstname: values.firstname,
                lastname: values.lastname,
                city: values.city,
                fc_id: values.fc_id,
                team: values.team,
                contract: values.contract,
            })
            .eq("id", session.user.id);

        if (error) throw error;
    } catch (error) {
        if (__DEV__) console.error("updateUser error:", error);
        throw error;
    }
}

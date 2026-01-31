import { supabase } from "../../../utils/supabase";
import { EditProfileFormValues } from "../../types/user.interface";

export async function updateUser(
    user_id: string,
    values: EditProfileFormValues,
) {
    try {
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
            .eq("id", user_id);

        if (error) throw error;
    } catch (error) {
        if (__DEV__) console.error("updateUser error:", error);
        throw error;
    }
}

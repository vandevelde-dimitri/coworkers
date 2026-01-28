import { supabase } from "../../../utils/supabase";

export async function updateSettingUser(body: any, user_id: string) {
    console.log("body => ", body);

    const { data, error } = await supabase
        .from("settings")
        .update(body)
        .eq("user_id", user_id)
        .single();
    if (error) {
        if (__DEV__) console.error("Détail technique Supabase:", error);
        throw new Error();
    }
    return data;
}

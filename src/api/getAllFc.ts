import { supabase } from "../../utils/supabase";

export async function getAllFc() {
    try {
        const { data, error } = await supabase.from("fc").select("*");
        if (error) {
            if (__DEV__) console.error("Error fetching fc:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        if (__DEV__) console.error("Unexpected error fetching fc:", error);
        return [];
    }
}

import { supabase } from "@/utils/supabase";

export async function getAllFc() {
    const { data, error } = await supabase.from("fc").select("*");
    if (error) {
        console.error("Error fetching fc:", error);
        return [];
    }

    return data || [];
}

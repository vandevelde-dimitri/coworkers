import { supabase } from "@/utils/supabase";

async function getContractAll() {
    const { data, error } = await supabase.from("contracts").select("*");
    if (error) {
        console.error("Error fetching contracts:", error);
        return [];
    }
    console.log(" ✅  Fetched contracts:", data);

    return data || [];
}

export default getContractAll;

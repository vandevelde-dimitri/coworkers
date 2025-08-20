import { supabase } from "@/utils/supabase";

export async function getAllAnnouncementByFc() {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    //     const { data: annonces, error } = await supabase
    //         .from("annonces")
    //         .select(
    //             `
    //     id,
    //     title,
    //     content,
    //     number_of_places,
    //     users!inner(fc_id)
    //   `
    //         )
    //         .eq("users.fc_id", "b6ee1c86-c2b4-4385-806c-9bb262b60865");
    const { data: annonces, error } = await supabase.rpc(
        "get_annonces_for_user",
        {
            p_user_id: userId,
        }
    );
    console.log(" ✅  Fetched announcements:", annonces);

    return annonces || [];
}

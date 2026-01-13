import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../utils/supabase";
import { User } from "../../types/user.interface";

export async function getCurrentUser(session: Session): Promise<User> {
    if (!session) {
        throw new Error("User not authenticated");
    }

    const { data: user, error: errorUser } = await supabase
        .from("users")
        .select(
            `*,
            fc:fc_id ( 
            id,
        name
      )`
        )
        .eq("id", session.user.id)
        .single();

    if (errorUser) {
        console.error("Error fetching user:", errorUser);
        throw new Error("Failed to fetch user data");
    }

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

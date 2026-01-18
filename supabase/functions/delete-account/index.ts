import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        // 1️⃣ Récupérer l'utilisateur authentifié
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response("Unauthorized", { status: 401 });
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

        if (userError || !user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userId = user.id;

        // 2️⃣ Nettoyage des données métier (exemples)
        await supabase
            .from("participant_requests")
            .delete()
            .eq("user_id", userId);
        await supabase
            .from("conversation_participants")
            .delete()
            .eq("user_id", userId);
        await supabase.from("favorites").delete().eq("user_id", userId);
        await supabase.from("annonces").delete().eq("user_id", userId);
        await supabase.from("users").delete().eq("id", userId);

        // 3️⃣ Suppression du compte Auth
        const { error: deleteError } =
            await supabase.auth.admin.deleteUser(userId);

        if (deleteError) {
            throw deleteError;
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("DELETE ACCOUNT ERROR", e);
        return new Response("Internal Server Error", { status: 500 });
    }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        const authHeader = req.headers.get("Authorization");
        if (!authHeader) return new Response("Unauthorized", { status: 401 });

        const {
            data: { user },
            error: userError,
        } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));

        if (userError || !user)
            return new Response("Unauthorized", { status: 401 });

        const userId = user.id;

        const { error: dbError } = await supabaseAdmin.rpc(
            "delete_user_complete",
            {
                p_user_id: userId,
            },
        );

        if (dbError) {
            if (__DEV__) console.error("DB Cleanup Error:", dbError);
            throw new Error("Erreur lors du nettoyage des données");
        }

        const { error: authError } =
            await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) throw authError;

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

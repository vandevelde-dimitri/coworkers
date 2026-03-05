import { IApplicationRepository } from "@/src/domain/repositories/ApplicationRepository";
import { supabase } from "../supabase";

export class SupabaseApplicationRepository implements IApplicationRepository {
  async getRequest(annonceId: string, userId: string) {
    const { data, error } = await supabase
      .from("participant_requests")
      .select("*")
      .eq("annonce_id", annonceId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async apply(annonceId: string, userId: string) {
    const { error } = await supabase.from("participant_requests").insert({
      annonce_id: annonceId,
      user_id: userId,
      status: "pending",
    });
    if (error) throw error;
  }

  async cancel(annonceId: string, userId: string, status?: string) {
    await supabase
      .from("participant_requests")
      .delete()
      .match({ annonce_id: annonceId, user_id: userId });

    if (status === "accepted") {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("annonce_id", annonceId)
        .maybeSingle();

      if (conversation) {
        await supabase
          .from("conversation_participants")
          .delete()
          .match({ conversation_id: conversation.id, user_id: userId });
      }
    }
  }
}

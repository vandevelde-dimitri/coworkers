import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";
import { supabase } from "@/src/infrastructure/supabase";

export class SupabaseParticipantRepository implements IParticipantRepository {
  async acceptCandidate(candidateId: string, annonceId: string): Promise<void> {
    const { error } = await supabase.rpc("accept_candidate", {
      p_annonce_id: annonceId,
      p_candidate_id: candidateId,
    });

    if (error) {
      throw new Error(
        `Erreur lors de l'acceptation du candidat: ${error.message}`,
      );
    }
  }
  async rejectCandidate(candidateId: string, annonceId: string): Promise<void> {
    const { error } = await supabase
      .from("participant_requests")
      .update({ status: "refused" })
      .eq("annonce_id", annonceId)
      .eq("user_id", candidateId);

    if (error) {
      throw new Error(`Erreur lors du refus du candidat: ${error.message}`);
    }
  }
}

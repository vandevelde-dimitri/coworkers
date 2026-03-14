import { supabase } from "@/src/infrastructure/supabase";
import { UnauthorizedError } from "@/src/domain/errors/AppError";
import { IAnnouncementRepository } from "@/src/domain/repositories/AnnouncementRepository";
import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";

export class AcceptCandidateUseCase {
  constructor(
    private participantRepo: IParticipantRepository,
    private announcementRepo: IAnnouncementRepository,
  ) {}

  async execute(candidateId: string, announcementId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const announcement =
      await this.announcementRepo.getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Annonce non trouvée");

    if (announcement.owner.id !== user.id) {
      throw new UnauthorizedError(
        "Seul le propriétaire peut accepter les candidatures",
      );
    }

    await this.participantRepo.acceptCandidate(candidateId, announcementId);
  }
}

import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";

export class RejectCandidateUseCase {
  constructor(private repository: IParticipantRepository) {}

  async execute(candidateId: string, annonceId: string): Promise<void> {
    return await this.repository.rejectCandidate(candidateId, annonceId);
  }
}

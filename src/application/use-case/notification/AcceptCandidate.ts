import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";

export class AcceptCandidateUseCase {
  constructor(private repository: IParticipantRepository) {}

  async execute(candidateId: string, annonceId: string): Promise<void> {
    return await this.repository.acceptCandidate(candidateId, annonceId);
  }
}

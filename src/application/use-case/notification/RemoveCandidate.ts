import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";

export class RemoveParticipantUseCase {
  constructor(private repository: IParticipantRepository) {}

  async execute(
    annonceId: string,
    participantId: string,
    conversationId: string,
  ): Promise<void> {
    return await this.repository.removeParticipant(
      annonceId,
      participantId,
      conversationId,
    );
  }
}

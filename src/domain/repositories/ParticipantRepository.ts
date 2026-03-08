export interface IParticipantRepository {
  acceptCandidate(candidateId: string, annonceId: string): Promise<void>;
  rejectCandidate(candidateId: string, annonceId: string): Promise<void>;
  removeParticipant(
    annonceId: string,
    participantId: string,
    conversationId: string,
  ): Promise<void>;
}

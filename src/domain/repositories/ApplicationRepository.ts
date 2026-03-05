import { CandidateAnnouncement } from "../entities/announcement/Announcement";

export interface IApplicationRepository {
  getRequest(annonceId: string, userId: string): Promise<any>;
  apply(annonceId: string, userId: string): Promise<void>;
  cancel(annonceId: string, userId: string, status?: string): Promise<void>;
  getUserApplications(): Promise<CandidateAnnouncement[]>;
}

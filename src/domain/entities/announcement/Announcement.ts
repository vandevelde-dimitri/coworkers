import { User } from "../user/User";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  dateStart: Date;
  dateEnd?: Date | null;
  conversationId: string;
  places: number;
  owner: User;
  passenger: User[];
}

export type CreateAnnouncementPayload = Omit<
  Announcement,
  "id" | "createdAt" | "owner" | "passenger"
>;

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;

export interface CandidateAnnouncement {
  id: string;
  status: "pending" | "accepted" | "refused";
  created_at: Date;
  annonces: {
    id: string;
    title: string;
    number_of_places: number;
  };
  conversation_id: string | null;
}

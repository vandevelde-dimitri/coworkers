import { User } from "../user/User";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  dateStart: Date;
  dateEnd?: Date | null;
  places: number;
  owner: User;
  passenger: User[];
}

export type UpdateAnnouncementPayload = Partial<
  Omit<Announcement, "id" | "createdAt" | "owner" | "passenger">
>;
export type CreateAnnouncementPayload = Omit<
  Announcement,
  "id" | "createdAt" | "owner" | "passenger"
>;

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

import { User } from "../user/User";

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    dateStart: Date;
    dateEnd?: Date;
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

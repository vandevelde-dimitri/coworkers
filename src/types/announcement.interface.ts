import { Contract } from "./enum/contract.enum";
import { Team } from "./enum/team.enum";

export interface AnnouncementWithUser {
    id: string;
    title: string;
    content: string;
    number_of_places: number;
    date_start: string;
    date_end: string;
    userId: string;
    user_name: string;
    contract: Contract;
    team: Team;
    image_profile: string;
    city: string;
    to_convey: boolean;
}

export interface AnnouncementFormValues {
    title: string;
    content: string;
    number_of_places: number;
    date_start: string;
    date_end?: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    number_of_places: number;
    date_start: string;
    date_end?: string;
    user_id: string;
}

export interface User {
    id: string;
    firstname: string;
    image_profile: string | null;
    city: string;
}

export interface ParticipantRequest {
    id: string;
    user_id: string;
    status: "pending" | "accepted" | "refused";
    users: User; // les infos du participant
}

export interface AnnonceDetail {
    id: string;
    title: string;
    content?: string;
    number_of_places: number;
    created_at: string;
    updated_at: string;
    owner: User;
    conversation_id: string;
    participant_requests: ParticipantRequest[];
    myStatus: "pending" | "accepted" | "refused" | null; // status de l'utilisateur connecté
}

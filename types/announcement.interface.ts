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
}

export interface Announcement {
    content: string;
    date_end: string;
    date_start: string;
    id: string;
    number_of_places: number;
    title: string;
    userId: string;
}

export interface AnnouncementDetail extends Announcement {
    users: {
        firstname: string;
        image_profile: string;
        contract: Contract;
        team: Team;
        city: string;
        fc: {
            name: string;
        };
    };
}

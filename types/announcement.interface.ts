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

export interface AnnouncementDetail extends AnnouncementWithUser {
    users: {
        firstname: string;
    };
}

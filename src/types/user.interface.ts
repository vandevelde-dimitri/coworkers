import { Contract } from "./enum/contract.enum";
import { Team } from "./enum/team.enum";

export interface User {
    id: string;
    firstname?: string;
    lastname?: string;
    city?: string;
    contract?: Contract;
    team?: Team;
    floor?: string;
    image_profile?: string;
    to_convey?: boolean;
    fc: { name: string };
}

export interface authUserUpdate {
    email?: string;
    password?: string;
}

export interface EditProfileFormValues {
    firstname: string;
    lastname: string;
    city: string;
    contract: Contract;
    team: Team;
    fc_id: string;
}

import { Contract } from "./enum/contract.enum";
import { Team } from "./enum/team.enum";

export interface User {
    firstname?: string;
    lastname?: string;
    city?: string;
    contract?: Contract;
    team?: Team;
    floor?: string;
    image_profile?: string;
    fc: { name: string };
}

export interface authUserUpdate {
    email?: string;
    password?: string;
}

import { Contract } from "./enum/contract.enum";
import { Team } from "./enum/team.enum";

export interface User {
    firstname?: string;
    lastname?: string;
    city?: string;
    contract?: Contract;
    team?: Team;
}

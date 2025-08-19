import { Contract } from "./enum/contract.enum";

export interface User {
    firstname?: string;
    lastname?: string;
    city?: string;
    contract?: Contract;
}

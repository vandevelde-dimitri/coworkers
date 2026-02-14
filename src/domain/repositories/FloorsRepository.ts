import { Floor } from "../entities/floors/Floors";

export interface IFloorsRepository {
    getAllFloors(): Promise<Floor[]>;
}

import type { SeatType } from "../../interfaces/Hall.interface";

export interface HallConfig {
    hallId?: number;
    rowCount?: HTMLInputElement;
    placeCount?: HTMLInputElement;
    config?: SeatType[][];
}
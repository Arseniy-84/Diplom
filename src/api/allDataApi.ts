import axios from "axios";
import { PREFIX } from "../helpers/API";
import type { SeatType } from "../interfaces/Hall.interface";

export interface AllDataResponse {
    success: boolean;
    result: {
        halls: Array<{
            id: number;
            hall_name: string;
            hall_rows: number;
            hall_places: number;
            hall_config: SeatType[][];
            hall_price_standart: number;
            hall_price_vip: number;
            hall_open: 0 | 1;
        }>;
        films: Array<{
            id: number;
            film_name: string;
            film_description: string;
            film_duration: number;
            film_poster: string;
            film_origin: string;
        }>;
        seances: Array<{
            id: number;
            seance_filmid: number;
            seance_hallid: number;
            seance_time: string;
        }>;
    };
}

export const allDataApi = {
    getAllData: async (): Promise<AllDataResponse> => {
        const response = await axios.get(`${PREFIX}/alldata`);
        return response.data;
    }
}
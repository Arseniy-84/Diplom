import axios from "axios";
import { PREFIX } from "../helpers/API";

export interface CreateSeanceResponse {
    success: boolean;
    error: string;
    result:{
        id: number;
        seance_hallid: number;
        seance_filmid: number;
        seance_time: string;
        }
}
export type seanceParams = ({
        seanceHallid: number,
        seanceFilmid: number,
        seanceTime: string
    });

export const seanceApi = {
    addSeance: async(formData: seanceParams): Promise<CreateSeanceResponse> => {
        const response = await axios.post(`${PREFIX}/seance`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },
    deleteSeance: async (id: number) => {
        const response = await axios.delete(`${PREFIX}/seance/${id}`);
        return response.data;
    },
};
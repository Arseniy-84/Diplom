import axios from "axios";
import { PREFIX } from "../helpers/API";

export interface CreateFilmResponse {
    success: boolean;
    error: string;
    result:
        {film_description: string;
        film_duration: number;
        film_name: string;
        film_origin: string;
        film_poster: string;
        id: number
        }
}
export type filmParams = FormData;

export const filmApi = {
    addFilm: async(formData: filmParams): Promise<CreateFilmResponse> => {
        const response = await axios.post(`${PREFIX}/film`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },
    deleteFilm: async (id: number) => {
        const response = await axios.delete(`${PREFIX}/film/${id}`);
        return response.data;
    },
};
import axios from "axios";
import { PREFIX } from "../helpers/API";
import type { SeatType } from "../interfaces/Hall.interface";
import type { AllDataResponse } from "./allDataApi";

export interface CreateHallResponse {
    success: boolean;
    error: string;
    result: 
        {id: number;
        hall_name: string;
        hall_rows: number;
        hall_places: number;
        hall_config: SeatType[][];
        hall_price_standart: number;
        hall_price_vip: number;
        hall_open: 0 | 1;}
};

export interface HallConfigParams {
    hallId: number;
    formData: FormData;
}

export const hallApi = {
    deleteHall: async (id: number) => {
        const response = await axios.delete(`${PREFIX}/hall/${id}`);
        return response.data;
    },
    
    addHall: async (hallName: string): Promise<CreateHallResponse> => {
        const response = await axios.post(`${PREFIX}/hall`, {
            hallName: hallName
        });
        return response.data;
    },

    configHall: async (params: { hallId: number; formData: FormData }): Promise<CreateHallResponse> => {
        const response = await axios.post(
            `${PREFIX}/hall/${params.hallId}`,
            params.formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        return response.data;
    },

    configPrice: async(params: { hallId: number; formData: FormData}): Promise<CreateHallResponse> => {
        const response = await axios.post(
            `${PREFIX}/price/${params.hallId}`,
            params.formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    openHall: async(params: {hallId: number, formData: FormData}): Promise<AllDataResponse> => {
            const response = await axios.post(
                `${PREFIX}/open/${params.hallId}`,
                params.formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            )
        return response.data
    },

    getConfigHall: async(params: {seanceId: number, date: string}) => {
        const response = await axios.get(
            `${PREFIX}/hallconfig?seanceId=${params.seanceId}&date=${params.date}`
        )
        return response.data
    },
    buyTickets: async(params: {seanceId: number, ticketDate: string, tickets: Array<{
            row: number,
            place: number,
            coast: number,
        }>}) => {
            const response = await axios.post(`${PREFIX}/ticket`,
                {
        seanceId: params.seanceId,
        ticketDate: params.ticketDate,
        tickets: JSON.stringify(params.tickets)
    }   
            )
            return response
        }   
};
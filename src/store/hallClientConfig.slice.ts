import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { hallApi } from "../api/hallApi";
import type { SeatTypeClient } from "../interfaces/Hall.interface";

interface HallState {
    dataHall: {
        result: SeatTypeClient[][],
    };
    loadingHall: boolean;
    errorHall: string | null;
    success: boolean;
}

const initialState: HallState = {
    dataHall: {
        result: [],   
    },
    loadingHall: false,
    errorHall: null,
    success: false
};

export const fetchHallConfig = createAsyncThunk(
    'hall/hallCongigClient',
    async ({ seanceId, date }: { seanceId: number; date: string }) => {
        const response = await hallApi.getConfigHall({seanceId, date});
        return response;
    }
)

export const setTickets = createAsyncThunk(
    'hall/buyTickets',
    async (params: {
        seanceId: number;
        ticketDate: string;
        tickets: Array<{
            row: number;
            place: number;
            coast: number;
        }>;
    }) => {
            const response = await hallApi.buyTickets(params)
            return response.data
        }
)

const hallSlice = createSlice({
    name: 'hall',
    initialState,
    reducers: {
        clearHallConfig: (state) => {
        state.dataHall.result = [];
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchHallConfig.pending, (state) => {
            state.loadingHall = true;
            state.errorHall = null;
        })
        .addCase(fetchHallConfig.fulfilled, (state, action) => {
            state.loadingHall = false;
            state.dataHall = action.payload;
        })
        .addCase(fetchHallConfig.rejected, (state, action) => {
            state.loadingHall = false;
            state.errorHall = action.error.message || 'Ошибка загрузки конфигурации зала';
        })
        .addCase(setTickets.pending, (state) => {
                state.loadingHall = true;
                state.errorHall = null;
                state.success = false;
            })
            .addCase(setTickets.fulfilled, (state, action) => {
                state.loadingHall = false;
                state = action.payload.data || null;
            })
            .addCase(setTickets.rejected, (state, action) => {
                state.loadingHall = false;
                state.errorHall = action.error.message || 'Ошибка покупки билетов';
            });
    },
});

export  const hallClientConfig = hallSlice.reducer;
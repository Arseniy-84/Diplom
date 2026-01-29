import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { allDataApi, type AllDataResponse } from '../api/allDataApi';
import { configPrice, deleteHall, openHall } from './hallOperationsSlice.slice';
import { configHall } from './hallOperationsSlice.slice';
import type { CreateHallResponse } from '../api/hallApi';
import { deleteFilm } from './filmOperationsSlice.slice';
import { deleteSeance } from './seanceOperationsSlice.slice';

export const fetchAllData = createAsyncThunk(
    'allData/fetchAllData',
    async (): Promise<AllDataResponse> => {
        return await allDataApi.getAllData();
    }
);

interface AllDataState {
    data: AllDataResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: AllDataState = {
    data: null,
    loading: false,
    error: null
};

const allDataSlice = createSlice({
    name: 'allData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchAllData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка загрузки данных';
        })
        .addCase(deleteHall.fulfilled, (state, action) => {
            if (state.data && state.data.result && state.data.result.halls) {
                const hallId = action.payload;
                state.data.result.halls = state.data.result.halls.filter(hall => hall.id !== hallId);
            }    
        })
        .addCase(configHall.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(configHall.fulfilled, (state, action: PayloadAction<CreateHallResponse>) => {
            state.loading = false;
            if (state.data?.result?.halls) {
            const index = state.data.result.halls.findIndex(hall => hall.id === action.payload.result.id);
                if (index !== -1) {
                state.data.result.halls[index] = action.payload.result;
                }
            }             
        })
        .addCase(configHall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка загрузки данных';
        })
        .addCase(configPrice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(configPrice.fulfilled, (state, action: PayloadAction<CreateHallResponse>) => {
            state.loading = false;
            if (state.data?.result?.halls) {
            const index = state.data.result.halls.findIndex(hall => hall.id === action.payload.result.id);
                if (index !== -1) {
                state.data.result.halls[index] = action.payload.result;
                }
            }             
        })
        .addCase(configPrice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка загрузки данных';
        })
        .addCase(deleteFilm.fulfilled, (state, action) => {
            if (state.data && state.data.result && state.data.result.films) {
                const filmId = action.payload;
                state.data.result.films = state.data.result.films.filter(film => film.id !== filmId);
            }    
        })
        .addCase(deleteSeance.fulfilled, (state, action) => {
            if (state.data && state.data.result && state.data.result.seances) {
                const seanceId = action.payload;
                state.data.result.seances = state.data.result.seances.filter(seance => seance.id !== seanceId);
            }    
        })
        .addCase(openHall.pending, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(openHall.fulfilled, (state, action) => {
            
            if (action.payload.success && action.payload.result.halls) {
                const updatedHalls = action.payload.result.halls;
            
                if (state.data?.result?.halls) {
                    state.data.result.halls = updatedHalls;
                }
            }           
        })
        .addCase(openHall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка открытия зала'
        })
    }
});

export default allDataSlice.reducer;
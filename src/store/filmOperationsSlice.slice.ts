import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filmApi, type filmParams } from '../api/filmApi';

interface filmOperationsState {
    loading: boolean;
    error: string | null;
}

const initialState: filmOperationsState = {
    loading: false,
    error: null
};

export const addFilm = createAsyncThunk(
    'films/addFilm',
    async (params: filmParams) => {
        return await filmApi.addFilm(params);
    }
);

export const deleteFilm = createAsyncThunk(
    'films/deleteFilm', 
    async (id: number) => {
        await filmApi.deleteFilm(id);
    return id;
    }
);

const filmOperationSlice = createSlice({
    name: 'filmOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addFilm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFilm.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addFilm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка добавления фильма';
            })
    }
})

export const filmOperationsReducer = filmOperationSlice.reducer;
export const filmOperationsActions = filmOperationSlice.actions;

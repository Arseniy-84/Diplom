import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { seanceApi, type seanceParams } from '../api/seanceApi';

interface seanceOperationsState {
    loading: boolean;
    error: string | null;
}

const initialState: seanceOperationsState = {
    loading: false,
    error: null
};

export const addSeance = createAsyncThunk(
    'seance/addSeance',
    async (params: seanceParams) => {
        return await seanceApi.addSeance(params);
    }
);

export const deleteSeance = createAsyncThunk(
    'seance/deleteSeance', 
    async (id: number) => {
        const response = await seanceApi.deleteSeance(id);
    return response;
    }
);

const seanceOperationSlice = createSlice({
    name: 'seanceOperations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addSeance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSeance.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addSeance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка добавления сеанса';
            })
    }
})

export const seanceOperationsReducer = seanceOperationSlice.reducer;
export const seanceOperationsActions = seanceOperationSlice.actions;

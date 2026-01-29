import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hallApi } from '../api/hallApi';

export interface HallConfigParams {
    hallId: number;
    formData: FormData;
}

export interface HallOpenParams {
  hallId: number;
  formData: FormData;
}

interface HallOperationsState {
  loading: boolean;
  error: string | null;
}

export const addHall = createAsyncThunk(
  'halls/addHall',
  async (hallName: string) => {
    return await hallApi.addHall(hallName);
  }
);

export const deleteHall = createAsyncThunk(
  'halls/deleteHall', 
  async (id: number) => {
    await hallApi.deleteHall(id);
    return id;
  }
);

export const configHall = createAsyncThunk(
  'halls/configHall',
  async (params: HallConfigParams ) => {
    const response = await hallApi.configHall(params);
    return response;
  }
);

export const configPrice = createAsyncThunk(
  'halls/configPrice',
  async (params: HallConfigParams) => {
    const response = await hallApi.configPrice(params);
    return response;
  }
)

export const openHall = createAsyncThunk(
  'halls/openHall',
  async(params: HallOpenParams) => {
    const response = await hallApi.openHall(params);
    return response;
  }  
)

const initialState: HallOperationsState = {
  loading: false,
  error: null
};

const hallOperationsSlice = createSlice({
  name: 'hallOperations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHall.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка добавления зала';
      })
      
  }
});

export const { clearError } = hallOperationsSlice.actions;
export default hallOperationsSlice.reducer;
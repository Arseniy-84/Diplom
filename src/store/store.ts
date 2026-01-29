import { configureStore } from "@reduxjs/toolkit";
import hallOperationsSlice from './hallOperationsSlice.slice';
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import allDataSlice  from "./allDataSlice.slice";
import { filmOperationsReducer } from "./filmOperationsSlice.slice";
import { seanceOperationsReducer } from "./seanceOperationsSlice.slice";
import { hallClientConfig } from './hallClientConfig.slice'

export const store = configureStore({
    reducer: {
        hall: hallClientConfig,
        halls: hallOperationsSlice,
        allData: allDataSlice,
        filmOperations: filmOperationsReducer,
        seanceOperations: seanceOperationsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispath>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
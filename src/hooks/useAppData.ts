import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchAllData } from "../store/allDataSlice.slice";

export const useAppData = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.allData);

    const refreshData = async (): Promise<void> => {
        await dispatch(fetchAllData());
    };
    
    return {
        halls: data?.result.halls || [],
        films: data?.result.films || [],
        seances: data?.result.seances || [],
        loading,
        error,
        refreshData,
    };
};
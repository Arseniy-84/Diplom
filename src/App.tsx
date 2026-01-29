import { useEffect, useRef } from 'react';
import { fetchAllData } from './store/allDataSlice.slice';
import { useAppDispatch } from './store/store';


export function App({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchAllData());
        }
    }, [dispatch]);

    return <>{children}</>;
}
import { createContext } from 'react';
import type { SeatType } from '../interfaces/Hall.interface';

export interface NavigationData {
    film?: {
        id?: number;
        film_name?: string;
        film_duration?: number;
        film_description?: string;
        film_origin?: string;
        film_poster?: string;
    };          
    seance?: {
        id?: number;
        seance_hallid?: number;
        seance_filmid?: number;
        seance_time?: string;
    };      
    hall?: {
        id?: number;
        hall_name?: string;
        hall_rows?: number;
        hall_places?: number;
        hall_config?: SeatType[][];
        hall_price_standart?: number;
        hall_price_vip?: number;
        hall_open?: number;
    };
    date?: string;
    selectedSeats?: Array<{ id: number; row: number; place: number; type: SeatType }>;
    bookingStep?: 'select_seats' | 'confirm' | 'payment';
    timestamp?: string;
    
}

export interface NavigationContextType {
    navigationData: NavigationData;
    setNavigationData: (data: NavigationData | ((prev: NavigationData) => NavigationData)) => void;
    clearNavigationData: () => void;
}

const defaultContext: NavigationContextType = {
    navigationData: {},
    setNavigationData: () => {},
    clearNavigationData: () => {},
};

export  const NavigationContext = createContext<NavigationContextType>(defaultContext);
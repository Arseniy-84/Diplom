export interface Hall {
    id: number;
    hall_name: string;
    hall_rows: number;
    hall_places: number;
    hall_config: SeatType[][];
    hall_price_standart: number;
    hall_price_vip: number;
    hall_open: number;
}

export interface SeatPosition {
    rowIndex: number;
    seatIndex: number;
    seat?: SeatTypeClient;
}

export type SeatType = 'disabled' | 'standart' | 'vip';
export type SeatTypeClient = 'taken' | 'standart' | 'vip' | 'selected';
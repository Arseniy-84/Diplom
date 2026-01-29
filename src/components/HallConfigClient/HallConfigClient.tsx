import { useEffect, useRef, useState } from "react";
import { fetchHallConfig, setTickets } from "../../store/hallClientConfig.slice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import styles from './HallConfigClient.module.css'
import Button from "../Button/Button";
import cn from 'classnames'
import type { SeatPosition, SeatTypeClient } from "../../interfaces/Hall.interface";
import { useAppData } from "../../hooks/useAppData";


export function HallConfigClient () {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [configArray, setConfigArray] = useState<SeatTypeClient[][]>([]);
    const [selectedSeats, setSelectedSeats] = useState<SeatPosition[]>([])
    const { seances, films, halls, loading: hallsLoading, error: hallsError} = useAppData();
    const { dataHall } = useAppSelector(state => state.hall);
    const seanceId = searchParams.get('seanceId');
    const date = searchParams.get('date');
    const seance = seances.find(s => s.id === Number(seanceId));
    const film = films.find(f => f.id === seance?.seance_filmid);
    const hall = halls.find(h => h.id === seance?.seance_hallid);
    const hasFetchedConfig = useRef(false);


    useEffect(() => {
        if (dataHall?.result) {
            setConfigArray(dataHall.result);
        }
    }, [dataHall]);

    useEffect(() => {       
        if (seanceId && date && !hasFetchedConfig.current) {
            dispatch(fetchHallConfig({ 
                seanceId: Number(seanceId), 
                date: date 
            }));                      
        }
    }, [seanceId, date, dispatch]);


    const handleClickSeat = (rowIndex: number, seatIndex: number, seatType: string) => {
        if (seatType === 'taken' || seatType === 'disabled') return;

        const seatPosition = { rowIndex, seatIndex };
        
        setSelectedSeats(prev => {
            const isAlreadySelected = prev.some(
                seat => seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
            );
            
            if (isAlreadySelected) {
                return prev.filter(
                    seat => !(seat.rowIndex === rowIndex && seat.seatIndex === seatIndex)
                );
            } else {
                return [...prev, seatPosition];
            }
        });
    };

    const isSeatSelected = (rowIndex: number, seatIndex: number) => {
        return selectedSeats.some(
            seat => seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
        );
    };

    const handleBuyTickets = async() => {

    const tickets = selectedSeats.map(seat => {
        const { rowIndex, seatIndex } = seat;
        const seatType = configArray[rowIndex][seatIndex];

        const getSeatPrice = (seatType: string): number => {
            if (!hall) {
                throw new Error('Hall data is not available');
            }
            
            if (seatType === 'vip') {
                return hall.hall_price_vip;
            }
            if (seatType === 'standart') {
                return hall.hall_price_standart;
            }
            
            throw new Error(`Unknown seat type: ${seatType}`);
        };

        const coast = getSeatPrice(seatType);

            return {
                row: rowIndex + 1,
                place: seatIndex + 1,
                coast: coast,
            };
        });

        if (tickets.length > 0 && seanceId && date) {
            try {
                const result = await dispatch(setTickets({
                    seanceId: Number(seanceId),
                    ticketDate: date,
                    tickets: tickets
                })).unwrap();
                
                if (result.success && result.result) {
                    const totalCoast = tickets.reduce((sum, ticket) => sum + ticket.coast, 0);
                    
                    const selectedSeatsInfo = tickets.map(ticket => 
                        `Ряд ${ticket.row}- место ${ticket.place}`
                    ).join(', ');
                    
                    navigate('/payment', {
                        state: {
                            tickets: result.result, 
                            filmName: result.result[0]?.ticket_filmname, 
                            seanceTime: result.result[0]?.ticket_time,
                            totalCoast: totalCoast,
                            hallName: result.result[0]?.ticket_hallname,
                            selectedSeatsInfo: selectedSeatsInfo
                        }
                    });
                } else {
                    alert('Ошибка при покупке билетов');
                }
                
            } catch (error) {
                console.error('Purchase failed:', error);
                alert('Ошибка при покупке билетов');
            }
        }
    };
    
    return <>
        <div className={styles.container}>
            <div className={styles.seance}>
                <div className={styles['film-name']}>{film?.film_name}</div>
                <div className={styles['seance-time']}>Начало сеанса:&nbsp;{seance?.seance_time}</div>
                <div className={styles['hall-name']}>{hall?.hall_name}</div>
            </div>
                
            <div className={styles.hall}>
                <img src="Client/screen.png" alt="картинка экрана" className={styles.screen}/>
                {hallsLoading || !dataHall?.result ? (
                    <div className={styles.loading}>Загрузка схемы зала...</div>
                ) : hallsError ? (
                    <div className={styles.error}>Ошибка загрузки залов: {hallsError}</div>
                ) : dataHall.result.length === 0 ? (
                    <div className={styles.loading}>Нет доступных залов</div>
                ) : (
                <div className={styles['hall-config']}>
                    {configArray.map((row, rowIndex: number) => (
                                    <div key={rowIndex} className={styles.row}>
                                        <div className={styles.seats}>
                                            {row.map((seat, seatIndex: number) => (
                                                <div 
                                                className={cn(styles.seat,
                                                    seat === 'standart' && styles['standart-chair'],
                                                    seat === 'vip' && styles['vip-chair'],
                                                    seat === 'taken' && styles['taken-chair'],
                                                    isSeatSelected(rowIndex, seatIndex) && styles['selected-chair']
                                                )}
                                                key={`${rowIndex+1} ${seatIndex+1}`} 
                                                onClick={()=> handleClickSeat(rowIndex, seatIndex, seat)}></div>
                                                
                                            ))}
                                        </div>
                                    </div>
                                ))}
                </div>)}
                <div className={styles.chairs}>
                    <div className={styles.chair}>
                        <div className={cn(styles.seat, styles['standart-chair'])}></div>
                        <div className={styles['chair-text']}>&nbsp;Свободно&nbsp;({hall?.hall_price_standart}руб)</div>
                    </div>
                    <div className={styles.chair}>
                        <div className={cn(styles.seat, styles['taken-chair'])}></div>
                        <div className={styles['chair-text']}>&nbsp;Занято&nbsp;</div>
                    </div>
                    <div className={styles.chair}>
                        <div className={cn(styles.seat, styles['vip-chair'])}></div>
                        <div className={styles['chair-text']}>&nbsp;Свободно&nbsp;VIP&nbsp;({hall?.hall_price_vip}руб)</div>
                    </div>
                    <div className={styles.chair}>
                        <div className={cn(styles.seat, styles['selected-chair'])}></div>
                        <div className={styles['chair-text']}>&nbsp;Выбрано&nbsp;</div>
                    </div>
                </div>
            </div>
            <div className={styles.button}>
                <Button appereance="big" onClick={handleBuyTickets}>Забронировать</Button>
            </div>
            
        </div>
    </>
}
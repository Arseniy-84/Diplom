import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppDispatch } from '../../store/store';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './HallConfig.module.css';
import cn from 'classnames';
import { configHall } from '../../store/hallOperationsSlice.slice';
import type { SeatType } from '../../interfaces/Hall.interface';
import { useAppData } from '../../hooks/useAppData';

export function HallConfig() {
    const [error, setError] = useState<string | null>(null);
    const [configArray, setConfigArray] = useState<SeatType[][]>([]);
    const [formValue, setFormValue] = useState(() => ({rows: 0, places: 0}));
    const [selectHall, setSelectHall] = useState<number>(0);
    const [isManualInput, setIsManualInput] = useState(false);

    const dispatch = useAppDispatch();
    const { halls, loading: hallsLoading, error: hallsError } = useAppData();

    useEffect(() => {
        if (selectHall){
            setError(null);
            loadHallConfig(selectHall);   
        }
    }, [selectHall]);

    useEffect(() => {
    if (isManualInput && formValue.rows > 0 && formValue.places > 0) {
        setError(null);
        generateHallConfig();
        setIsManualInput(false);
    }
    }, [formValue.rows, formValue.places, isManualInput, error]);

    useEffect(() => {
        if (halls?.length > 0 && !selectHall) {
            setSelectHall(halls[0].id);
        }
    }, [halls, selectHall]);

    const loadHallConfig = (hallId: number) => {
        const selectedHall = halls.find(hall => hall.id === hallId);

        if (selectedHall && selectedHall.hall_config) {           
            setConfigArray(selectedHall?.hall_config)

            if (Array.isArray(selectedHall?.hall_config) && selectedHall?.hall_config.length > 0) {
                setConfigArray(selectedHall?.hall_config);

                const rows = selectedHall?.hall_config.length;
                const places = selectedHall?.hall_config[0]?.length || 0;

                setFormValue({
                    rows: rows,
                    places: places
                });
                setIsManualInput(false);
                return;
            }
        }
    }

    const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;

        setFormValue(prev => ({
            ...prev,
            [name]: numValue
        }));
        setIsManualInput(true);
    }

    const handleHallClick = (hallId: number) => {
            setSelectHall(hallId);
    }

    const generateHallConfig = () => {
        const { rows, places} = formValue;

        if (rows <= 0 || places <= 0) {
            setError('Укажите корректное количество рядов и мест');
            return;
        }

        if (rows > 20 || places > 20) {
            setError('Слишком большой зал. Максимум: 20 рядов x 20 мест');
            return;
        }

        if (rows > 0 && places > 0) {
            const newConfig: SeatType[][] = Array.from({ length: rows }, () =>
                Array.from({ length: places }, () => 'standart')
            );
            setConfigArray(newConfig);
        }
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectHall) {
            setError('Выберите зал для конфигурации');
            return;
        }

        if (formValue.rows <= 0 || formValue.places <= 0) {
            setError('Укажите корректное количество мест и рядов');
            return;
        }

        if (configArray.length === 0) {
            setError('Сначала создайте схему зала');
            return;
        }

        const formData = new FormData();
        formData.set('rowCount', formValue.rows.toString());
        formData.set('placeCount', formValue.places.toString());
        formData.set('config', JSON.stringify(configArray));

        await handleAddHall(selectHall, formData);
    };

    const handleAddHall = async (hallId: number, formData: FormData) => {
        try {
            const res = await dispatch(configHall({
                hallId,
                formData
            })).unwrap();
            setConfigArray(res.result.hall_config);
        } catch (e: any) {
            console.error('Error updating hall:', e);
            setError(e.message || 'Ошибка при обновлении зала');
        }
    };

    const handleSeatClick = (rowIndex: number, seatIndex: number ) => {
        const newConfig = configArray.map((row, rIndex) => 
        rIndex === rowIndex 
            ? [...row]
            : row
    );
        
        const currentType = newConfig[rowIndex][seatIndex];
        const types: SeatType[] = ['standart', 'vip', 'disabled'];
        const currentIndex = types.indexOf(currentType);
        const nextIndex = (currentIndex + 1) % types.length;
        
        newConfig[rowIndex][seatIndex] = types[nextIndex];
        setConfigArray(newConfig);
        
    };

    const getSeatIcon = (seatType: SeatType) => {
        switch (seatType) {
            case 'standart':
                return '../Admin/regular-chair-icon.svg';
            case 'vip':
                return '../Admin/VIP-chair-icon.svg';
            case 'disabled':
                return '../Admin/disabled-chair-icon.svg';
        }
    }

    const cancel = (hallId: number) => {
        loadHallConfig(hallId);
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.header}>
                <div>Выберите зал для конфигурации:</div>
                {hallsLoading ? (
                    <div className={styles.loading}>Загрузка залов...</div>
                ) : hallsError ? (
                    <div className={styles.error}>Ошибка загрузки залов: {hallsError}</div>
                ) : halls.length === 0 ? (
                    <div className={styles.loading}>Нет доступных залов</div>
                ) : (
                    <div className={styles.halls}>
                        {halls.map((hall) => (
                            <div
                                className={cn(
                                    styles.hall,
                                    selectHall === hall.id && styles['hall_active']
                                )}
                                onClick={() => handleHallClick(hall.id)}
                                key={hall.id}
                            >
                                {hall.hall_name}
                            </div>
                        ))}
                    </div>
                )}    
            </div>
            <div className={styles.header}>
                Укажите количество рядов и максимальное количество кресел в ряду:
                <div className={styles.inputs}>
                    <div className={styles.field}>
                        <label htmlFor="hall_rows">Рядов, шт</label>
                        <Input id="hall_rows" name="rows" onChange={handleChangeForm} value={formValue.rows} />
                    </div>
                    <img src="../Admin/x-icon.svg" alt="иконка крестика" className={styles.icon} />
                    <div className={styles.field}>
                        <label htmlFor="hall_places">Мест, шт</label>
                        <Input id="hall_places" name="places" value={formValue.places} onChange={handleChangeForm} />
                    </div>
                </div>
            </div>

            <div className={styles.header}>
                Теперь вы можете указать типы кресел на схеме зала:
                <div className={styles.chairs}>
                    <div className={styles.chair}>
                        <img src="../Admin/regular-chair-icon.svg" alt="иконка для обычных кресел" />
                        <div>&nbsp;— обычные кресла</div>
                    </div>
                    <div className={styles.chair}>
                        <img src="../Admin/VIP-chair-icon.svg" alt="иконка для VIP кресел" />
                        <div>&nbsp;— VIP кресла</div>
                    </div>
                    <div className={styles.chair}>
                        <img src="../Admin/disabled-chair-icon.svg" alt="иконка для заблокированных кресел" />
                        <div>&nbsp;— заблокированные (нет кресла)</div>
                    </div>
                </div>
                <div className={styles.comment}>Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</div>
                {!hallsLoading ? (
                    <div className={styles['container-hall']}>
                        <div className={styles.screen}>экран</div>
                        {error ? (
                            <div className={styles.error}>{error}</div>
                        ) : (
                            <div className={styles.schemeHall}>
                                {configArray.map((row: SeatType[], rowIndex: number) => (
                                    <div key={rowIndex} className={styles.row}>
                                        <div className={styles.seats}>
                                            {row.map((seat: SeatType, seatIndex: number) => (
                                                <img
                                                    key={`${rowIndex}-${seatIndex}`}
                                                    src={getSeatIcon(seat)}
                                                    alt={`кресло ${rowIndex + 1}-${seatIndex + 1}`}
                                                    className={styles.seat}
                                                    onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Загрузка схемы зала</div>
                )}
            </div>
            <div className={styles.buttons}>
                <Button appereance="cancel" onClick={() => cancel(selectHall)}>Отменить</Button>
                <Button appereance="admin" type="submit">Сохранить</Button>
            </div>
        </form>
    );
} 
import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch } from '../../store/store';
import styles from './OpenSales.module.css';
import cn from 'classnames'
import Button from '../Button/Button';
import { openHall } from '../../store/hallOperationsSlice.slice';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

export function OpenSales () {
    const [selectHall, setSelectHall] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { halls, loading: hallsLoading, error: hallsError } = useAppData();
    const selectedHallData = halls.find(hall => hall.id === selectHall);
    const currentStatus = selectedHallData?.hall_open || 0;

    useEffect(() => {
        if (halls?.length > 0 && !selectHall) {
            setSelectHall(halls[0].id);
        }
    }, [halls, selectHall]);

    const submit = async(e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true)

        if(loading) {
            return
        }
        
        if (!selectHall) {
            setError('Выберите зал для конфигурации');
            setLoading(false);
            return;
        }

        const newStatus = currentStatus === 1 ? 0 : 1 

        const params = new FormData();
        params.set('hallOpen', newStatus.toString())

        
        await handleOpenHall(selectHall, params)
    }

    const handleOpenHall =  async(hallId: number, formData: FormData) => {
        try {
            await dispatch(openHall({
                hallId,
                formData
            })).unwrap();
        } catch (e: any) {
            console.error('Error updating hall:', e);
            setError(e.message || 'Ошибка при обновлении зала');
        } finally {
            setLoading(false)
        }
    }
    const handleHallClick = (hallId: number) => {
            setSelectHall(hallId);
            setError(null);
    }

    return <form className={styles.form} onSubmit={submit}>
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
            {error ? <div className={styles.error}>{error}</div> : currentStatus === 1 ? <div className={styles.content}>Зал открыт</div> : <div className={styles.content}>Всё готово к открытию</div>}
            <div className={styles.buttons}>
                <Button appereance="admin" type="submit"  disabled={loading}>{currentStatus === 1 ? 'Приостановить продажу билетов' : 'Открыть продажу билетов'}</Button>
                <Button appereance="admin" type='button' onClick={() => navigate('/')}>выйти</Button>
            </div>
    </form>
}
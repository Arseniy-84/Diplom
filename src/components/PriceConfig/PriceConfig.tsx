import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppDispatch } from '../../store/store';
import styles from './PriceConfig.module.css';
import cn from 'classnames';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { configPrice } from '../../store/hallOperationsSlice.slice';
import { useAppData } from '../../hooks/useAppData';


export function PriceConfig () {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectHall, setSelectHall] = useState<number>(0);
    const [formValue, setFormValue] = useState(() => ({priceStandart: 0, priceVip: 0}));
    
    const dispatch = useAppDispatch();
    const { halls, loading: hallsLoading, error: hallsError } = useAppData();

    useEffect(() => {
        if(selectHall) {
            loadHallConfig(selectHall);
        }
    }, [selectHall])

    useEffect(() => {
        if (halls?.length > 0 && !selectHall) {
            setSelectHall(halls[0].id);
        }
    }, [halls, selectHall]);

    const handleHallClick = (hallId: number) => {
        setSelectHall(hallId);
    }

    const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;

        setFormValue(prev => ({
            ...prev,
            [name]: numValue
        }));
    }

    const loadHallConfig = (hallId: number) => {
        const selectedHall = halls.find(hall => hall.id === hallId);
    
        if (selectedHall) {           
            setFormValue({
                priceStandart: selectedHall.hall_price_standart || 0,
                priceVip: selectedHall.hall_price_vip || 0
            });
        }
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formValue.priceStandart <= 0 || formValue.priceVip <= 0) {
            setError('Укажите корректную цену билетов');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.set('priceStandart', formValue.priceStandart.toString());
        formData.set('priceVip', formValue.priceVip.toString());
        
        await handleAddHall(selectHall, formData)
    }

    const handleAddHall = async (hallId: number, formData: FormData) => {
            try {
                await dispatch(configPrice({
                    hallId,
                    formData
                })).unwrap();
            } catch (e: any) {
                console.error('Error updating hall:', e);
                setError(e.message || 'Ошибка при обновлении зала');
            } finally {
                setLoading(false);
            }
    };

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
                Установите цены для типов кресел:
                <div className={styles.inputs}>
                    <div className={styles.field}>
                        <div className={styles.input}>
                            <label htmlFor="priceStandart">Цена, рублей</label>
                            <Input id="priceStandart" onChange={handleChangeForm} name="priceStandart" value={formValue.priceStandart}/>
                        </div>
                            <div className={styles.chair}><span>&nbsp;за</span>&nbsp;<img src="../Admin/regular-chair-icon.svg" alt="иконка для обычных кресел" />&nbsp;<span>обычные кресла</span></div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.input}>
                            <label htmlFor="priceVip">Цена, рублей</label>
                            <Input id="priceVip" name="priceVip" onChange={handleChangeForm} value={formValue.priceVip}/>
                        </div>
                        <div className={styles.chair}><span>&nbsp;за</span>&nbsp;<img src="../Admin/VIP-chair-icon.svg" alt="иконка для VIP кресел" />&nbsp;<span>VIP кресла</span></div>
                    </div>
                </div>
            </div>
            {error && <div>{error}</div>}
            <div className={styles.buttons}>
                <Button appereance="cancel" onClick={() => cancel(selectHall)}>Отменить</Button>
                <Button 
                    appereance="admin" 
                    type="submit"
                    disabled={loading || !selectHall || hallsLoading}
                >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </div>
        </form>
    );    
}
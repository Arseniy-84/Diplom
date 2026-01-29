import { useState } from "react";
import Button from "../Button/Button";
import Headling from "../Headling/Headling";
import type { PopupProps } from "./Popup.interface";
import styles from "./Popup.module.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";

export function PopupAddSeance ({ onClose, onSuccessAddLocal, film, hall }: PopupProps) {    
    const [error, setError] = useState<string | null>();
    const [selectedHallId, setSelectedHallId] = useState<string>(hall?.id?.toString() || '');
    const [selectedFilmId, setSelectedFilmId] = useState<string>(film?.id?.toString() || '');
    const [selectedTime, setSelectedTime] = useState<string>('');

    const { data, loading: hallsLoading } = useAppSelector(state => state.allData);
    const navigate = useNavigate();

    const halls = data?.result.halls;
    const films = data?.result.films;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedHallId || !selectedFilmId || !selectedTime) {
            setError('Заполните все поля');
            return;
        }

        const hallId = parseInt(selectedHallId);
        const filmId = parseInt(selectedFilmId);

        if (isNaN(hallId) || isNaN(filmId)) {
            setError('Некорректные ID зала или фильма');
            return;
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(selectedTime)) {
            setError('Некорректный формат времени. Используйте HH:MM');
            return;
        }

        onSuccessAddLocal?.({
            hallId,
            filmId,
            time: selectedTime
        });
    };

    return (
        <div className={styles.popup}>
            <div className={styles.head}>
                <Headling appearence="admin">Добавление сеанса</Headling>
                <img 
                    src="../Admin/close-icon.svg" 
                    alt="иконка крестика" 
                    className={styles.icon}  
                    onClick={onClose || (() => navigate('/admin/cabinet'))}
                />
            </div>       
            <form className={styles.form} onSubmit={submit}>
                <div className={styles['input-block']}>
                    <label htmlFor="hallName" className={styles.title}>Название зала</label>
                    <select 
                        id="hallName" 
                        name="hallName" 
                        value={selectedHallId}
                        onChange={(e) => setSelectedHallId(e.target.value)}
                        className={styles.select}
                        required
                    >
                        <option value="">Выберите зал</option>
                        {halls?.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.hall_name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className={styles['input-block']}>
                    <label htmlFor="filmName" className={styles.title}>Название фильма</label>
                    <select 
                        id="filmName" 
                        name="filmName" 
                        value={selectedFilmId}
                        onChange={(e) => setSelectedFilmId(e.target.value)}
                        className={styles.select}
                        required
                    >
                        <option value="">Выберите фильм</option>
                        {films?.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.film_name}
                            </option>
                        ))}
                    </select>                
                </div>
                
                <div className={styles['input-block']}>
                    <label htmlFor="time" className={styles.title}>Время начала</label>
                    <input 
                        className={styles.select}
                        type="time"
                        name="seanceTime"
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                    />
                </div>
                
                {hallsLoading ? (
                    <div className={styles.loading}>Загрузка данных...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : null} 
                
                <div className={styles.buttons}>
                    <Button 
                        type="submit" 
                        appereance="admin"
                        disabled={!selectedHallId || !selectedFilmId || !selectedTime}
                    >
                        Добавить сеанс
                    </Button>
                    <Button 
                        type="button" 
                        appereance="cancel" 
                        onClick={onClose || (() => navigate('/admin/cabinet'))}
                    >
                        Отменить
                    </Button>
                </div>
            </form>
        </div>
    );
}
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fetchAllData } from '../../store/allDataSlice.slice';
import { useAppDispatch } from '../../store/store';
import Button from '../Button/Button';
import styles from './SeancesGrid.module.css';
import { PopupAddFilm } from '../Popup/PopupAddFilm';
import { deleteFilm } from '../../store/filmOperationsSlice.slice';
import { DraggableFilm } from '../Drag&Drop/DraggableFilm/DraggableFilm';
import { PopupAddSeance } from '../Popup/PopupAddSeance';
import type { Film } from '../../interfaces/Film.interface';
import type { Hall } from '../../interfaces/Hall.interface';
import { useFilmColors } from '../../hooks/useFilmColors';
import { HallWithBasket } from '../Drag&Drop/HallWithBasket/HallWithBasket';
import { PopupDeleteSeance } from '../Popup/PopupDeleteSeance';
import type { Seance } from '../../interfaces/Seance.interface';
import { addSeance } from '../../store/seanceOperationsSlice.slice';
import { useAppData } from '../../hooks/useAppData';

export function SeancesGrid() {
    const [showFilmPopup, setShowFilmPopup] = useState(false);
    const [showSeancePopup, setShowSeancePopup] = useState(false);
    const [showDeleteSeancePopup, setShowDeleteSeancePopup] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
    const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
    const [localSeances, setLocalSeances] = useState<Seance[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const { halls, films, seances, refreshData } = useAppData();

    const allSeances = [...seances, ...localSeances];

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getFilmDuration = (filmId: number) => {
        const film = films.find((item) => item.id === filmId);
        return film?.film_duration ?? null;
    };

    const cancel = () => {
        setLocalSeances([]);
        setError(null);
    };

    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        if (localSeances.length === 0) {
            setError('Нет сеансов для сохранения');
            return;
        }

        setIsSaving(true);

        try {
            await Promise.all(
                localSeances.map((seance) =>
                    dispatch(addSeance({
                        seanceHallid: seance.seance_hallid,
                        seanceFilmid: seance.seance_filmid,
                        seanceTime: seance.seance_time
                    })).unwrap()
                )
            );

            setLocalSeances([]);
            await refreshData();
        } catch (saveError) {
            console.error('Сетевая ошибка при сохранении сеансов:', saveError);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddFilm = () => {
        setShowFilmPopup(true);
    };

    const handleCloseFilmPopup = () => {
        setShowSeancePopup(false);
        setShowFilmPopup(false);
    };

    const handleSuccessCreate = () => {
        setShowFilmPopup(false);
        dispatch(fetchAllData());
    };

    const handleSeanceDelete = (seanceId: Seance, film: Film) => {
        setSelectedSeance(seanceId);
        setSelectedFilm(film);
        setShowDeleteSeancePopup(true);
    };

    const handleCloseDeletePopup = () => {
        setShowDeleteSeancePopup(false);
        setSelectedSeance(null);
        setSelectedFilm(null);
    };

    const delFilm = async (id: number) => {
        try {
            await dispatch(deleteFilm(id)).unwrap();
        } catch (deleteError) {
            console.error('Error delete film:', deleteError);
        }
    };

    const handleFilmDropped = (film: Film, hall: Hall) => {
        setSelectedHall(hall);
        setSelectedFilm(film);
        setShowSeancePopup(true);
    };

    const validateSeance = ({ hallId, filmId, time }: { hallId: number; filmId: number; time: string }) => {
        const duration = getFilmDuration(filmId);

        if (!duration || duration <= 0) {
            return 'Не удалось определить продолжительность фильма для проверки пересечений';
        }

        const newStart = timeToMinutes(time);
        const newEnd = newStart + duration;

        const hasOverlap = allSeances
            .filter((seance) => seance.seance_hallid === hallId)
            .some((seance) => {
                const existingDuration = getFilmDuration(seance.seance_filmid);

                if (!existingDuration || existingDuration <= 0) {
                    return false;
                }

                const existingStart = timeToMinutes(seance.seance_time);
                const existingEnd = existingStart + existingDuration;

                return newStart < existingEnd && existingStart < newEnd;
            });

        return hasOverlap ? 'Сеанс пересекается по времени с другим сеансом в этом зале' : null;
    };

    const handleSeanceAdd = (seanceData: { hallId: number; filmId: number; time: string }) => {
        const newSeance: Seance = {
            id: Date.now(),
            seance_hallid: seanceData.hallId,
            seance_filmid: seanceData.filmId,
            seance_time: seanceData.time,
        };

        setLocalSeances((prev) => [...prev, newSeance]);
        setError(null);
        setShowSeancePopup(false);
        setSelectedFilm(null);
        setSelectedHall(null);
    };

    const filmColors = useFilmColors(films);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.container}>
                <Button appereance='admin' className={styles.add} onClick={handleAddFilm}>
                    Добавить фильм
                </Button>
                <div className={styles.films}>
                    {films.map((film) => (
                        <DraggableFilm
                            key={film.id}
                            film={film}
                            backgroundColor={filmColors[film.id]}
                            onDelete={delFilm}
                        />
                    ))}
                </div>
                <div className={styles['seances-grid']}>
                    {halls.map((hall) => (
                        <HallWithBasket
                            key={hall.id}
                            hall={hall}
                            films={films}
                            filmColors={filmColors}
                            onFilmDropped={handleFilmDropped}
                            seances={allSeances}
                            onSeanceDelete={handleSeanceDelete}
                        />
                    ))}
                </div>
                {isSaving ? <div>Выполняется сохранение сеансов...</div> : error ? <div className={styles.error}>{error}</div> : ''}
                <div className={styles.buttons}>
                    <Button appereance="cancel" onClick={cancel}>Отменить</Button>
                    <Button appereance="admin" type="submit" onClick={handleSave} disabled={isSaving}>Сохранить</Button>
                </div>
                {showFilmPopup && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popupContent}>
                            <PopupAddFilm
                                onClose={handleCloseFilmPopup}
                                onSuccess={handleSuccessCreate}
                            />
                        </div>
                    </div>
                )}
                {showSeancePopup && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popupContent}>
                            <PopupAddSeance
                                onClose={handleCloseFilmPopup}
                                onSuccessAddLocal={handleSeanceAdd}
                                onValidateSeance={validateSeance}
                                hall={selectedHall ?? undefined}
                                film={selectedFilm ?? undefined}
                            />
                        </div>
                    </div>
                )}
                {showDeleteSeancePopup && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popupContent}>
                            <PopupDeleteSeance
                                onClose={handleCloseDeletePopup}
                                onSuccess={handleSuccessCreate}
                                seance={selectedSeance ?? undefined}
                                film={selectedFilm ?? undefined}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
}

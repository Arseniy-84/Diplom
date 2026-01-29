import { useDrop } from 'react-dnd';
import styles from './DroppableTimeline.module.css';
import type { Film } from '../../../interfaces/Film.interface';
import type { Hall } from '../../../interfaces/Hall.interface';
import type { Seance } from '../../../interfaces/Seance.interface';
import { useTimeline } from '../../../hooks/useTimeline';
import { DraggableSeance } from '../DraggableSeance/DraggableSeance';

interface DroppableTimelineProps {
    hall: Hall,
    films: Film[],
    seances: Seance[],
    filmColors: Record<number, string>;
    onFilmDropped: (film: Film, hall: Hall) => void;
}

export const DroppableTimeline = ({ 
    hall, 
    films = [], 
    seances = [], 
    filmColors = {}, 
    onFilmDropped 
}: DroppableTimelineProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FILM',
        drop: (item: any) => {
            onFilmDropped(item.film, hall);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [hall, onFilmDropped]);

    const { getSeancePosition } = useTimeline();
    const hallSeances = seances.filter(seance => seance.seance_hallid === hall.id);

        
    const getFilmById = (filmId: number): Film | undefined => {
        return films.find(film => film.id === filmId);
    };

    return (
        <div className={styles.halls}>
            
            <div className={styles['hall-name']}>{hall.hall_name}</div>
            <div 
                ref={drop as any}
                className={`${styles.timeline} ${isOver ? styles['drag-over'] : ''}`}
            >
                {hallSeances.sort((a, b) => a.seance_time.localeCompare(b.seance_time))
                    .map(seance => {
                        const film = getFilmById(seance.seance_filmid);

                        if (!film) return null;

                        const position = getSeancePosition(seance.seance_time);
                        
                            
                        return <DraggableSeance
                                    key={seance.id}
                                    seance={seance}
                                    film={film}
                                    filmColor={filmColors[film.id]}
                                    position={position}
                                    hallId={hall.id}
                                />
                        
                    })
                }
            </div>
        </div>
    );
};
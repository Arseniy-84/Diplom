import { useDrop } from 'react-dnd';
import styles from './HallWithBasket.module.css';
import { DroppableTimeline } from '../DroppableTimeline/DroppableTimeline';
import { DeleteSeance } from '../DeleteSeance/DeleteSeance';
import type { Film } from '../../../interfaces/Film.interface';
import type { Hall } from '../../../interfaces/Hall.interface';
import type { Seance } from '../../../interfaces/Seance.interface';

interface HallWithBasketProps {
    hall: Hall;
    films: Film[];
    filmColors: Record<number, string>;
    onFilmDropped: (film: Film, hall: Hall) => void;
    seances: Seance[];
    onSeanceDelete: (seanceId: Seance, film: Film) => void;
}

interface DragItem {
    seance: Seance;
    hallId: number;
    film: Film;
}

export function HallWithBasket({ 
    hall, 
    films, 
    filmColors, 
    onFilmDropped, 
    seances, 
    onSeanceDelete 
}: HallWithBasketProps) {
    const [{ draggedItem }] = useDrop({
        accept: 'SEANCE',
        drop: (item: DragItem) => {
            if (item.hallId === hall.id) {
                onSeanceDelete(item.seance, item.film);
            }
        },
        collect: (monitor) => ({
            draggedItem: monitor.getItem() as DragItem | null,
        }),
    });

    const shouldShowBasket = draggedItem && draggedItem.hallId === hall.id;

    return (
        <div className={styles.deletSeance}>
            {shouldShowBasket && (
                <DeleteSeance onSeanceDelete={onSeanceDelete} /> 
            )}
            <DroppableTimeline 
                hall={hall}
                films={films}
                filmColors={filmColors}
                onFilmDropped={onFilmDropped}
                seances={seances}
            />
        </div>
    );
}
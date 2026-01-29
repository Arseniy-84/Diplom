import { useDrag } from 'react-dnd';
import styles from './DraggableSeance.module.css';
import type { Film } from '../../../interfaces/Film.interface';
import type { Seance } from '../../../interfaces/Seance.interface';

interface DraggableSeanceProps {
    seance: Seance;
    film: Film;
    filmColor: string;
    position: { left: string };
    hallId: number;
}

export const DraggableSeance = ({ 
    seance, 
    film, 
    filmColor, 
    position, 
    hallId 
}: DraggableSeanceProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'SEANCE',
        item: { 
            seance: seance,
            hallId: hallId,
            film: film
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [seance, hallId]);

    return (
        <div 
            ref={drag as any}
            className={`${styles.seance} ${isDragging ? styles.dragging : ''}`}
            style={{ 
                backgroundColor: filmColor,
                left: position.left 
            }}
        >
            <span className={styles.name}>{film.film_name}</span>
            <span className={styles.time}>{seance.seance_time}</span>
        </div>
    );
};
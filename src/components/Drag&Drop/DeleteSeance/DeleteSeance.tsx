import { useDrop } from 'react-dnd';
import styles from './DeleteSeance.module.css';
import type { Film } from '../../../interfaces/Film.interface';
import type { Seance } from '../../../interfaces/Seance.interface';

interface DeleteSeanceProps {
    onSeanceDelete: (seance: Seance, film: Film) => void;
}

export const DeleteSeance = ({ onSeanceDelete }: DeleteSeanceProps) => {
    const [{ isOver, draggedItem }, drop] = useDrop(() => ({
        accept: 'SEANCE',
        drop: (item: { seance: Seance; hallId: number; film: Film }) => {
            onSeanceDelete(item.seance, item.film);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            draggedItem: monitor.getItem()
        }),
    }), [onSeanceDelete]);
    
    if (!draggedItem) {
        return null;
    }

    return (
        <div 
            ref={drop as any}
            className={`${styles.trashBin} ${isOver ? styles['drag-over'] : ''}`}
        >   
            <img src="../Admin/trash-icon.svg" alt="икнока мусорки" className={styles.icon}/>
        </div>
    );
};
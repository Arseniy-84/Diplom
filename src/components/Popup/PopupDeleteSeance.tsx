import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import Headling from "../Headling/Headling";
import type { PopupProps } from "./Popup.interface";
import styles from "./Popup.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { deleteSeance } from "../../store/seanceOperationsSlice.slice";

export function PopupDeleteSeance({ onClose, onSuccess, film, seance }: PopupProps) {
    const [error, setError] = useState<string | null>(null); // Исправлено
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const submit = async (e: FormEvent) => {    
        e.preventDefault();
        setLoading(true);
        setError(null);
            
        if (!seance?.id) {
            setError('Сеанс не существует');
            setLoading(false);
            return;
        }
        
        await handleDeleteSeance(seance.id);            
    }

    const handleDeleteSeance = async (id: number) => {
        try {
            const resp = await dispatch(deleteSeance(id)).unwrap();
            
            if(!resp.success) {
                setError(resp.error);
            } 
            else {
                onSuccess?.(); 
                onClose?.();
            }
        } catch (e: any) {
            console.error('Error deleting seance:', e); // Исправлено описание ошибки
            setError(e.response?.data?.message || 'Ошибка удаления сеанса');
        } finally {
            setLoading(false);            
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.head}>
                <Headling appearence="admin">Удаление сеанса</Headling>
                {/* ИСПРАВЛЕН ПУТЬ К ИКОНКЕ: */}
                <img 
                    src="/Admin/close-icon.svg" 
                    alt="иконка крестика" 
                    className={styles.icon}  
                    onClick={onClose || (() => navigate('/admin/cabinet'))}
                />
            </div>       
            <form className={styles.form} onSubmit={submit}>      
                <div className={styles['input-block']}>
                    Вы действительно хотите удалить сеанс фильма: <strong>{film?.film_name}</strong>
                </div>
                <div className={styles.buttons}>
                    <Button type="submit" appereance="admin" disabled={loading}>
                        {loading ? 'Удаление...' : 'удалить'}
                    </Button>
                    <Button type="button" appereance="cancel" onClick={onClose || (() => navigate('/admin/cabinet'))}>
                        Отменить
                    </Button>
                </div>
                {error && <div className={styles.error}>❌ {error}</div>}
            </form>        
        </div>
    );
}
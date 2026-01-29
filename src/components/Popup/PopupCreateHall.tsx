import { useState, type FormEvent } from "react";
import Button from "../Button/Button";
import Headling from "../Headling/Headling";
import Input from "../Input/Input";
import type { PopupForm, PopupProps } from "./Popup.interface";
import styles from "./Popup.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { addHall } from "../../store/hallOperationsSlice.slice";

export function PopupCreateHall ({ onClose, onSuccess }: PopupProps) {
    const [error, setError] = useState<string | null>()
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const submit = async (e: FormEvent) => {
            e.preventDefault();
            const target = e.target as typeof  e.target  as PopupForm;
            const { hallName } = target;

            if(!hallName?.value.trim()) {
                setError('Название зала обязательно');
                setLoading(false);
                return;
            }
            
            await handleAddHall(hallName.value);        
        }

    const handleAddHall= async (hallName: string) => {
        try {
            const resp = await dispatch(addHall(hallName)).unwrap();
            
            if(!resp.success) {
                setError(resp.error);
            } 
            else {
                onSuccess?.(); 
                navigate('/admin/cabinet');
            }
        } catch (e: any) {
            console.error('Error creating hall:', e);
            setError(e.response?.data?.message || 'Ошибка при создании зала');
        } finally {
            setLoading(false);            
        }
    }

    return <div className={styles.popup}>
        <div className={styles.head}>
            <Headling appearence="admin"> Добавление Зала</Headling>
            <img src="../Admin/close-icon.svg" alt="иконка крестика" className={styles.icon}  onClick={onClose || (() => navigate('/admin/cabinet'))}/>
        </div>       
        <form className={styles.form} onSubmit={submit}>               
            <div className={styles['input-block']}>
                <label htmlFor="hallName" className={styles.title}>Название зала</label>
                <Input id="hallName" name="hallName" placeholder="Например, «Зал 1»" className={styles.input} required/>
                {error && <div className={styles.error}>{error}</div>} 
            </div>
            <div className={styles.buttons}>
                <Button appereance="admin" disabled={loading}>Добавить зал</Button>
                <Button type="button" appereance="cancel" onClick={onClose || (() => navigate('/admin/cabinet'))}>Отменить</Button>
            </div>            
        </form>       
    </div>
}
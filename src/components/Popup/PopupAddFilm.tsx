import { useRef, useState, type FormEvent } from "react";
import Button from "../Button/Button";
import Headling from "../Headling/Headling";
import Input from "../Input/Input";
import type { PopupProps } from "./Popup.interface";
import styles from "./Popup.module.css";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addFilm } from "../../store/filmOperationsSlice.slice";
import { assetPath } from "../../helpers/assetPath";

export function PopupAddFilm({ onClose, onSuccess }: PopupProps) {
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading: hallsLoading } = useAppSelector((state) => state.filmOperations);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError(null);
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePoster = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const filmName = formData.get("filmName") as string;
        const filmDuration = formData.get("filmDuration") as string;
        const filmDescription = formData.get("filmDescription") as string;
        const filmOrigin = formData.get("filmOrigin") as string;

        if (!filmName?.trim() || !filmDescription?.trim() || !filmOrigin?.trim()) {
            setError("Заполните все текстовые поля");
            return;
        }

        const duration = parseInt(filmDuration);
        if (!filmDuration?.trim() || isNaN(duration) || duration <= 0) {
            setError("Укажите корректную продолжительность фильма");
            return;
        }

        if (!selectedFile) {
            setError("Постер фильма обязателен");
            return;
        }

        try {
            const res = await dispatch(addFilm(formData)).unwrap();

            if (!res.success) {
                setError(res.error);
            } else {
                onSuccess?.();
                navigate("/admin/cabinet");
            }
        } catch (e: any) {
            console.error("Error adding film:", e);
            setError(e.response?.data?.message || "Ошибка при добавлении фильма");
        }
    };

    return (
        <div className={styles.popup}>
            <div className={styles.head}>
                <Headling appearence="admin">Добавление фильма</Headling>
                <img
                    src={assetPath("Admin/close-icon.svg")}
                    alt="иконка крестика"
                    className={styles.icon}
                    onClick={onClose || (() => navigate("/admin/cabinet"))}
                />
            </div>

            <form className={styles.form} onSubmit={submit}>
                <div className={styles["input-block"]}>
                    <label htmlFor="filmName" className={styles.title}>
                        Название фильма
                    </label>
                    <Input id="filmName" name="filmName" placeholder='Например, «Гражданин Кейн»' className={styles.input} />
                </div>
                <div className={styles["input-block"]}>
                    <label htmlFor="filmDuration" className={styles.title}>
                        Продолжительность фильма (мин.)
                    </label>
                    <Input id="filmDuration" name="filmDuration" className={styles.input} />
                </div>
                <div className={styles["input-block"]}>
                    <label htmlFor="filmDescription" className={styles.title}>
                        Описание фильма
                    </label>
                    <textarea name="filmDescription" id="filmDescription" className={cn(styles.input, styles.description)}></textarea>
                </div>
                <div className={styles["input-block"]}>
                    <label htmlFor="filmOrigin" className={styles.title}>
                        Страна
                    </label>
                    <Input id="filmOrigin" name="filmOrigin" className={styles.input} />
                </div>

                {hallsLoading ? <div className={styles.loading}>Добавление фильма...</div> : error ? <div className={styles.error}>{error}</div> : null}

                <div className={styles.buttons}>
                    <Button type="submit" appereance="admin">
                        Добавить фильм
                    </Button>
                    <Button type="button" appereance="admin" onClick={() => fileInputRef.current?.click()} disabled={hallsLoading}>
                        Загрузить постер
                    </Button>
                    <input
                        type="file"
                        name="filePoster"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                    <Button type="button" appereance="cancel" onClick={onClose || (() => navigate("/admin/cabinet"))}>
                        Отменить
                    </Button>
                </div>
            </form>

            {previewUrl && (
                <div className={styles["preview-container"]}>
                    <div className={styles.preview}>
                        <img src={previewUrl} alt="Предпросмотр постера" className={styles["preview-image"]} />
                        <img
                            src={assetPath("Admin/close-icon.svg")}
                            alt="Удалить постер"
                            onClick={handleRemovePoster}
                            className={styles["remove-icon"]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

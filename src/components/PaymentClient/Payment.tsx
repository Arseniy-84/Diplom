import { useLocation } from "react-router-dom";
import Button from "../Button/Button";
import styles from './PaymentClient.module.css'
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function Payment() {
    const [showQR, setShowQR] = useState(false);
    
    const location = useLocation();
    const { filmName, hallName, seanceTime, totalCoast, selectedSeatsInfo } = location.state || {};

    // Извлекаем дату из seanceTime или получаем текущую дату
    // Предполагаем, что seanceTime содержит дату и время, например: "2024-03-15 18:30"
    const getDateFromSeanceTime = (timeString: string) => {
        if (!timeString) return new Date().toLocaleDateString('ru-RU');
        try {
            const [datePart] = timeString.split(' ');
            return datePart.split('-').reverse().join('.'); // Преобразуем "2024-03-15" в "15.03.2024"
        } catch {
            return new Date().toLocaleDateString('ru-RU');
        }
    };

    const getTimeFromSeanceTime = (timeString: string) => {
        if (!timeString) return '';
        try {
            const [, timePart] = timeString.split(' ');
            return timePart || '';
        } catch {
            return '';
        }
    };

    const handleGetCode = () => {
        setShowQR(true);
    };

    // Формируем полную строку для QR-кода
    const qrValue = `
БИЛЕТ В КИНО
══════════════════
Фильм: ${filmName || 'Не указан'}
Дата: ${getDateFromSeanceTime(seanceTime)}
Время: ${getTimeFromSeanceTime(seanceTime)}
Зал: ${hallName || 'Не указан'}
Места: ${selectedSeatsInfo || 'Не указаны'}
Стоимость: ${totalCoast || 0} ₽
══════════════════
Билет действителен строго на свой сеанс.
`.trim();

    return (
        <div>
            <div className={styles.header}>
                {!showQR ? `Вы выбрали билеты:` : `Электронный билет`}
            </div>
            <div className={styles.container}>
                <div className={styles['ticket-info']}>
                    <div className={styles.property}>
                        На фильм:&nbsp;<span>{filmName}</span>
                    </div>
                    <div className={styles.property}>
                        Места:&nbsp;<span>{selectedSeatsInfo}</span>
                    </div>
                    <div className={styles.property}>
                        В зале:&nbsp;<span>{hallName}</span>
                    </div>
                    <div className={styles.property}>
                        Начало сеанса:&nbsp;<span>{seanceTime}</span>
                    </div>
                    {!showQR && (
                        <div className={styles.property}>
                            Стоимость:&nbsp;<span>{totalCoast} ₽</span>
                        </div>
                    )}
                </div>
                
                <div className={styles.button}>
                    {!showQR ? (
                        <Button appereance="big" onClick={handleGetCode}>
                            Получить код бронирования
                        </Button>
                    ) : (
                        <div className={styles.qrCode}>
                            <QRCodeSVG 
                                value={qrValue}  // Используем полную строку
                                size={200}
                                level="H"  // Высокая степень коррекции ошибок
                                includeMargin={true}
                            />
                            <div className={styles.qrHint}>
                                QR-код содержит все данные о билете
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={styles.instructions}>
                    {!showQR ? (
                        <div>
                            После оплаты билет будет доступен в этом окне, а также придёт вам на почту. 
                            Покажите QR-код нашему контролёру у входа в зал.
                        </div>
                    ) : (
                        <div>
                            Покажите QR-код нашему контроллеру для подтверждения бронирования.
                        </div>
                    )}
                    <div>Приятного просмотра!</div>
                </div>
            </div>
        </div>
    );
}
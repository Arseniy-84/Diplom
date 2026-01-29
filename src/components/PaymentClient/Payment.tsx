import { useLocation } from "react-router-dom";
import Button from "../Button/Button";
import styles from './PaymentClient.module.css'
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function Payment() {
    const [showQR, setShowQR] = useState(false);
    
    
    const location = useLocation();
    const { filmName, hallName, seanceTime, totalCoast, selectedSeatsInfo } = location.state || {};

    const handleGetCode = () => {
        setShowQR(true);
    };

    return <div>
        <div className={styles.header}>{!showQR ? `Вы выбрали билеты:`: `Электронный билет`}</div>
        <div className={styles.container}>           
            <div className={styles['ticket-info']}>
                <div className={styles.property}>На фильм:&nbsp;<span>
                    {filmName}</span></div>
                <div className={styles.property}>Места:&nbsp;<span>{selectedSeatsInfo}</span></div>
                <div className={styles.property}>В зале:&nbsp;<span>{hallName}</span></div>
                <div className={styles.property}>Начало сеанса:&nbsp;<span>{seanceTime}</span></div>
                {!showQR ? <div className={styles.property}>Стоимость:&nbsp;<span>{totalCoast}</span></div> : <div></div>}
            </div>
            <div className={styles.button}>
                {!showQR ? (
                    <Button appereance="big" onClick={handleGetCode}>
                        Получить код бронирования
                    </Button>
                ) : (
                    <div className={styles.qrCode}>
                        <QRCodeSVG 
                            value={`Билет: ${filmName}, ${seanceTime}, ${selectedSeatsInfo}`}
                            size={200}
                        />
                    </div>
                )}
            </div>
            
            
            <div>
                {!showQR ? <div>После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</div> : <div>Покажите QR-код нашему контроллеру для подтверждения бронирования.</div>}
                <div>Приятного просмотра!</div>
            </div>
        </div>
    </div> 
        
}
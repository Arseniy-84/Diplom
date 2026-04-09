import { useLocation } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./PaymentClient.module.css";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { assetPath } from "../../helpers/assetPath";

type Ticket = {
    row: number;
    place: number;
    coast: number;
};

export function Payment() {
    const [showQR, setShowQR] = useState(false);
    const location = useLocation();
    const {
        filmName,
        hallName,
        seanceTime,
        seanceDate,
        totalCoast,
        selectedSeatsInfo,
        tickets = []
    } = location.state || {};

    const formatTicketDate = (dateString?: string) => {
        if (!dateString) {
            return new Date().toLocaleDateString("ru-RU");
        }

        const [year, month, day] = dateString.split("-");
        if (!year || !month || !day) {
            return dateString;
        }

        return `${day}.${month}.${year}`;
    };

    const ticketRows = (tickets as Ticket[]).map((ticket) => ticket.row).join(", ");
    const ticketPlaces = (tickets as Ticket[]).map((ticket) => ticket.place).join(", ");

    const qrValue = [
        "БИЛЕТ В КИНО",
        `Фильм: ${filmName || "Не указан"}`,
        `Дата: ${formatTicketDate(seanceDate)}`,
        `Время: ${seanceTime || "Не указано"}`,
        `Зал: ${hallName || "Не указан"}`,
        `Ряд: ${ticketRows || "Не указан"}`,
        `Место: ${ticketPlaces || "Не указано"}`,
        `Стоимость: ${totalCoast || 0} ₽`,
        "Билет действителен строго на свой сеанс."
    ].join("\n");

    return (
        <div
            className={styles.page}
            style={{
                ["--ticket-top-image" as string]: `url(${assetPath("Client/circle-top-ticket.png")})`,
                ["--ticket-bottom-image" as string]: `url(${assetPath("Client/circle-bot-ticket.png")})`
            }}
        >
            <div className={styles.header}>
                {!showQR ? "Вы выбрали билеты:" : "Электронный билет"}
            </div>
            <div className={styles.container}>
                <div className={styles["ticket-info"]}>
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
                        <Button appereance="big" onClick={() => setShowQR(true)}>
                            Получить код бронирования
                        </Button>
                    ) : (
                        <div className={styles.qrCode}>
                            <QRCodeSVG value={qrValue} size={200} level="H" includeMargin={true} />
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
                            Покажите QR-код нашему контролёру для подтверждения бронирования.
                        </div>
                    )}
                    <div>Приятного просмотра!</div>
                </div>
            </div>
        </div>
    );
}

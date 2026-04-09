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
    ticket_date?: string;
    ticket_time?: string;
    ticket_datetime?: string;
    datetime?: string;
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

    const firstTicket = (tickets as Ticket[])[0];

    const normalizeTicketDateTime = (dateValue?: string, timeValue?: string) => {
        const rawDate = dateValue?.trim() || "";
        const rawTime = timeValue?.trim() || "";
        const combinedSource = [rawDate, rawTime].find((value) => /(\d{4}-\d{2}-\d{2})|(\d{2}\.\d{2}\.\d{4})/.test(value));
        const timeSource = [rawTime, rawDate].find((value) => /\d{2}:\d{2}/.test(value));

        let normalizedDate = rawDate;
        let normalizedTime = rawTime;

        if (combinedSource) {
            const isoDateMatch = combinedSource.match(/\d{4}-\d{2}-\d{2}/);
            const ruDateMatch = combinedSource.match(/\d{2}\.\d{2}\.\d{4}/);
            normalizedDate = isoDateMatch?.[0] || ruDateMatch?.[0] || normalizedDate;
        }

        if (timeSource) {
            const timeMatch = timeSource.match(/\d{2}:\d{2}/);
            normalizedTime = timeMatch?.[0] || normalizedTime;
        }

        return {
            date: normalizedDate,
            time: normalizedTime
        };
    };

    const formatTicketDate = (dateString?: string) => {
        if (!dateString) {
            return "Не указано";
        }

        if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
            return dateString;
        }

        const [year, month, day] = dateString.split("-");
        if (!year || !month || !day) {
            return dateString;
        }

        return `${day}.${month}.${year}`;
    };

    const normalizedDateTime = normalizeTicketDateTime(
        (seanceDate as string | undefined)
            || firstTicket?.ticket_date
            || firstTicket?.ticket_datetime
            || firstTicket?.datetime,
        (seanceTime as string | undefined)
            || firstTicket?.ticket_time
            || firstTicket?.ticket_datetime
            || firstTicket?.datetime
    );

    const ticketDate = formatTicketDate(normalizedDateTime.date);
    const ticketTime = normalizedDateTime.time || "Не указано";
    const ticketRows = (tickets as Ticket[]).map((ticket) => ticket.row).join(", ");
    const ticketPlaces = (tickets as Ticket[]).map((ticket) => ticket.place).join(", ");

    const qrValue = [
        "БИЛЕТ В КИНО",
        `Фильм: ${filmName || "Не указан"}`,
        `Дата: ${ticketDate}`,
        `Время: ${ticketTime}`,
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
                        Дата сеанса:&nbsp;<span>{ticketDate}</span>
                    </div>
                    <div className={styles.property}>
                        Время сеанса:&nbsp;<span>{ticketTime}</span>
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

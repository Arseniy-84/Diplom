import { addWeeks, eachDayOfInterval, format, isToday, startOfToday } from "date-fns";
import { ru } from "date-fns/locale";
import { NavLink, useSearchParams } from "react-router-dom";
import { Seances } from "../Seances/Seances";
import { useNavigation } from "../../hooks/useNavigation";
import type { DateItem } from "../../interfaces/date.types";
import styles from "./MovieCalendar.module.css";
import { useEffect, useState } from "react";

type CalendarArrowProps = {
    direction: "prev" | "next";
    onClick: () => void;
};

function CalendarArrow({ direction, onClick }: CalendarArrowProps) {
    return (
        <button
            type="button"
            className={`${styles["calendar-arrow"]} ${styles[`calendar-arrow-${direction}`]}`}
            onClick={onClick}
            aria-label={direction === "prev" ? "Предыдущие даты" : "Следующие даты"}
        >
            <span className={styles["calendar-arrow-icon"]} aria-hidden="true" />
        </button>
    );
}

function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getBaseVisibleDateCount(viewportWidth: number) {
    if (viewportWidth <= 590) {
        return 3;
    }

    if (viewportWidth <= 768) {
        return 4;
    }

    return 6;
}

export function MovieCalendar() {
    const [searchParams] = useSearchParams();
    const activeSeance = searchParams.get("seance");
    const { setNavigationData, navigationData } = useNavigation();
    const [windowStart, setWindowStart] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(() =>
        typeof window === "undefined" ? 1024 : window.innerWidth
    );

    const getSeanceDate = () => {
        const today = startOfToday();
        const twoWeeksLater = addWeeks(today, 2);

        return eachDayOfInterval({
            start: today,
            end: twoWeeksLater
        }).map((date) => {
            const shortWeekDay = capitalizeFirstLetter(format(date, "EEEEEE", { locale: ru }));

            return {
                date,
                id: format(date, "yyyy-MM-dd"),
                shortLabel: format(date, "dd"),
                shortWeekDay,
                isToday: isToday(date),
                isWeekend: ["сб", "вс"].includes(shortWeekDay.toLowerCase())
            };
        });
    };

    const dates = getSeanceDate();
    const activeDateId = activeSeance ?? dates[0]?.id ?? "";
    const activeDateIndex = dates.findIndex((date) => date.id === activeDateId);

    const getVisibleDateCount = (startIndex: number) => {
        const baseVisibleDateCount = getBaseVisibleDateCount(viewportWidth);
        const reducedVisibleDateCount = Math.max(1, baseVisibleDateCount - 1);
        const hasPrev = startIndex > 0;

        let visibleDateCount = hasPrev ? reducedVisibleDateCount : baseVisibleDateCount;
        const hasNext = startIndex + visibleDateCount < dates.length;

        if (!hasNext) {
            visibleDateCount = Math.min(baseVisibleDateCount, dates.length - startIndex);
        }

        return visibleDateCount;
    };

    const visibleDateCount = getVisibleDateCount(windowStart);
    const visibleDates = dates.slice(windowStart, windowStart + visibleDateCount);
    const hasPrev = windowStart > 0;
    const hasNext = windowStart + visibleDateCount < dates.length;

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (dates.length > 0 && !navigationData.date) {
            const firstDate = dates[0];
            setNavigationData((prev) => ({
                ...prev,
                date: firstDate.id
            }));
        }
    }, [dates, navigationData.date, setNavigationData]);

    useEffect(() => {
        if (activeDateIndex === -1) {
            return;
        }

        const nextVisibleDateCount = getVisibleDateCount(windowStart);
        const visibleRangeEnd = windowStart + nextVisibleDateCount;

        if (activeDateIndex < windowStart) {
            setWindowStart(activeDateIndex);
            return;
        }

        if (activeDateIndex >= visibleRangeEnd) {
            const nextStart = Math.max(0, activeDateIndex - nextVisibleDateCount + 1);
            setWindowStart(nextStart);
        }
    }, [activeDateIndex, viewportWidth, windowStart]);

    const dateActiveClick = (date: DateItem) => {
        setNavigationData((prev) => ({
            ...prev,
            date: date.id
        }));
    };

    return (
        <div>
            <nav className={styles.container}>
                <div className={styles.calendar}>
                    {hasPrev && (
                        <CalendarArrow direction="prev" onClick={() => setWindowStart((prev) => Math.max(0, prev - 1))} />
                    )}
                    {visibleDates.map((date) => {
                        const isActive = activeDateId === date.id;
                        const isWeekendClass = date.isWeekend ? styles.weekend : "";
                        const isActiveClass = isActive ? styles["date-active"] : "";
                        const todayDateLabel = `${date.shortWeekDay}, ${date.shortLabel}`;

                        return (
                            <NavLink
                                key={date.id}
                                to={`?seance=${date.id}`}
                                className={`${styles.date} ${isActiveClass} ${isWeekendClass}`}
                                onClick={() => dateActiveClick(date)}
                            >
                                <div className={styles["date-content"]}>
                                    {date.isToday ? (
                                        <>
                                            <span className={styles.todayLabel}>Сегодня</span>
                                            <span className={styles.todayDate}>{todayDateLabel}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.weekDay}>{`${date.shortWeekDay},`}</span>
                                            <span className={styles.dayDate}>{date.shortLabel}</span>
                                        </>
                                    )}
                                </div>
                            </NavLink>
                        );
                    })}
                    {hasNext && (
                        <CalendarArrow
                            direction="next"
                            onClick={() => setWindowStart((prev) => Math.min(dates.length - 1, prev + 1))}
                        />
                    )}
                </div>
            </nav>
            <div>
                <Seances />
            </div>
        </div>
    );
}

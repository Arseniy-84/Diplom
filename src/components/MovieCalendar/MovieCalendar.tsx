import { addWeeks, eachDayOfInterval, format, isToday, startOfToday } from "date-fns";
import { ru } from "date-fns/locale";
import { NavLink, useSearchParams } from "react-router-dom";
import styles from "./MovieCalendar.module.css";
import { Seances } from "../Seances/Seances";
import { useNavigation } from "../../hooks/useNavigation";
import type { DateItem } from "../../interfaces/date.types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";

export function MovieCalendar() {
    const [searchParams] = useSearchParams();
    const activeSeance = searchParams.get("seance");
    const { setNavigationData, navigationData } = useNavigation();

    const getSeanceDate = () => {
        const today = startOfToday();
        const twoWeeksLater = addWeeks(today, 2);

        return eachDayOfInterval({
            start: today,
            end: twoWeeksLater
        }).map((date) => {
            const shortWeekDay = format(date, "EEEEEE", { locale: ru }).toLowerCase();

            return {
                date,
                id: format(date, "yyyy-MM-dd"),
                shortLabel: format(date, "dd"),
                shortWeekDay,
                isToday: isToday(date),
                isWeekend: ["сб", "вс"].includes(shortWeekDay)
            };
        });
    };

    const dates = getSeanceDate();

    useEffect(() => {
        if (dates.length > 0 && !navigationData.date) {
            const firstDate = dates[0];
            setNavigationData((prev) => ({
                ...prev,
                date: firstDate.id
            }));
        }
    }, [dates, navigationData.date, setNavigationData]);

    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 2,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 926,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                    variableWidth: true
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 2,
                    variableWidth: true
                }
            },
            {
                breakpoint: 590,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    variableWidth: true
                }
            },
            {
                breakpoint: 489,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 3,
                    variableWidth: true
                }
            }
        ]
    };

    const dateActiveClick = (date: DateItem) => {
        setNavigationData((prev) => ({
            ...prev,
            date: date.id
        }));
    };

    return (
        <div>
            <nav className={styles.container}>
                <Slider {...sliderSettings}>
                    {dates.map((date) => {
                        const isActive = activeSeance === date.id || (!activeSeance && dates[0]?.id === date.id);
                        const isWeekendClass = date.isWeekend ? styles.weekend : "";
                        const isActiveClass = isActive ? styles["date-active"] : "";
                        const dayAndDate = `${date.shortWeekDay}, ${date.shortLabel}`;

                        return (
                            <div key={date.id} className={styles.slide}>
                                <NavLink
                                    to={`?seance=${date.id}`}
                                    className={`${styles.date} ${isActiveClass} ${isWeekendClass}`}
                                    onClick={() => dateActiveClick(date)}
                                >
                                    <div className={styles["date-content"]}>
                                        {date.isToday && <span className={styles.todayLabel}>Сегодня</span>}
                                        <span className={styles.dayDate}>{dayAndDate}</span>
                                    </div>
                                </NavLink>
                            </div>
                        );
                    })}
                </Slider>
            </nav>
            <div>
                <Seances />
            </div>
        </div>
    );
}

import { addWeeks, eachDayOfInterval, format, isToday, startOfToday } from "date-fns"
import { ru } from "date-fns/locale";
import { NavLink, useSearchParams } from "react-router-dom";
import styles from './MovieCalendar.module.css'
import { Seances } from "../Seances/Seances";
import { useNavigation } from "../../hooks/useNavigation";
import type { DateItem } from "../../interfaces/date.types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";

export function MovieCalendar () {
    
    const [searchParams] = useSearchParams();
    const activeSeance = searchParams.get('seance');
    const { setNavigationData, navigationData } = useNavigation();

    const getSeanceDate = () => {
        const today = startOfToday();
        const twoWeeksLater = addWeeks(today, 2);

        const dates = eachDayOfInterval({
            start: today,
            end: twoWeeksLater
        });

        return dates.map((date) => ({
            date,
            id: format(date, 'yyyy-MM-dd'),
            shortLabel: format(date, 'dd'),
            // ИЗМЕНЕНО: Полное название дня с заглавной буквы
            shortWeekDay: format(date, 'EEEE', {locale: ru}),
            isToday: isToday(date),
            // ИЗМЕНЕНО: Проверка на полное название
            isWeekend: ['суббота', 'воскресенье'].includes(format(date, 'EEEE', { locale: ru }))
        }))
    }

    const dates = getSeanceDate();
    
    useEffect(() => {
        if (dates.length > 0 && !navigationData.date) {
            const firstDate = dates[0];
            setNavigationData(prev => ({
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
                breakpoint:767,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 2,
                variableWidth: true
            }
            },
            {
                breakpoint:590,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                variableWidth: true
            }
            },
            {
                breakpoint:489,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 3,
                variableWidth: true
            }
            }
        ]
    }

    const dateActiveClick = (date: DateItem) => {
        setNavigationData(prev => ({
            ...prev,
            date: date.id           
        }));
    }

    // ДОБАВЛЕНО: Функция для форматирования дня недели
    const formatDayName = (dayName: string) => {
        return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    };

    return  (
        <div>
            <nav className={styles.container}>
                <Slider {...sliderSettings}>
                    {dates.map((date) => {
                        const isActive = activeSeance === date.id || 
                                (!activeSeance && dates[0]?.id === date.id);
                        
                        // ДОБАВЛЕНО: Единая логика для всех дней
                        const dayNameFormatted = formatDayName(date.shortWeekDay);
                        const isWeekendClass = date.isWeekend ? styles.weekend : '';
                        const isActiveClass = isActive ? styles['date-active'] : '';

                        if(date.isToday) {
                            return  (
                                <div key={date.id} className={styles.slide}>
                                    <NavLink 
                                        to={`?seance=${date.id}`}
                                        className={`${styles.date} ${isActiveClass} ${isWeekendClass}`}
                                        onClick={() => dateActiveClick(date)}
                                    >   
                                        <div className={styles['date-content']}>
                                            {/* ДОБАВЛЕН класс todayLabel для пробела после запятой */}
                                            <span className={styles.todayLabel}>Сегодня</span>
                                            <span>{dayNameFormatted}, {date.shortLabel}</span>
                                        </div>
                                    </NavLink>
                                </div>
                            );
                        }    
                        
                        return  (
                            <div key={date.id} className={styles.slide}>
                                <NavLink 
                                    to={`?seance=${date.id}`}
                                    className={`${styles.date} ${isActiveClass} ${isWeekendClass}`}
                                    onClick={() => dateActiveClick(date)}
                                >
                                    <div className={styles['date-content']}>
                                        {/* ИСПРАВЛЕНО: Форматированный день недели */}
                                        <span className={styles.dayName}>{dayNameFormatted}</span>
                                        <span>{date.shortLabel}</span>
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
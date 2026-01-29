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
            shortWeekDay: format(date, 'EEEEEE', {locale: ru}),
            isToday: isToday(date),
            isWeekend: ['сб', 'вс'].includes(format(date, 'EEEEEE', { locale: ru }))
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

    return  <div>
                <nav className={styles.container}>
                    <Slider {...sliderSettings}>
                    
            {dates.map((date) => {
                const isActive = activeSeance === date.id || 
                        (!activeSeance && dates[0]?.id === date.id);

                if(date.isToday) {
                        return  (
                            <div key={date.id} className={styles.slide}>
                                <NavLink 
                                    key={date.id}
                                    to={`?seance=${date.id}`}
                                    className={`${styles.date} ${isActive ? styles['date-active'] : ''}`}
                                    onClick={() => dateActiveClick(date)}>   
                                        <div >Сегодня</div>
                                        <div>{date.shortWeekDay},{date.shortLabel}</div>   
                                </NavLink>
                            </div>)
                    }    
                return  (<div key={date.id} className={styles.slide}>
                    <NavLink 
                            key={date.id}
                            to={`?seance=${date.id}`}
                            className={`${styles.date} ${isActive ? styles['date-active'] : date.isWeekend ? styles.weekend : ''}`}
                            onClick={() => dateActiveClick(date)}>
                            
                                <div>{date.shortWeekDay},</div>
                                <div>{date.shortLabel}</div>                   
                        </NavLink> 
                </div>)
                })
            }
            
                </Slider>    
        </nav>            
        <div>
            <Seances />
        </div>
    </div>       
}
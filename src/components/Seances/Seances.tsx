import styles from "./Seances.module.css";
import { NavLink } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";
import { useAppData } from "../../hooks/useAppData";
import { isAfter, parse } from "date-fns";
import { assetPath } from "../../helpers/assetPath";

export function Seances() {
    const { films, seances, halls } = useAppData();
    const { navigationData, setNavigationData } = useNavigation();

    interface FilmSchedule {
        film: typeof films[0];
        seances: Array<{
            seance: typeof seances[0];
            hall: typeof halls[0];
        }>;
    }

    const seancesByFilm = seances.reduce((acc, seance) => {
        if (!acc[seance.seance_filmid]) {
            acc[seance.seance_filmid] = [];
        }
        acc[seance.seance_filmid].push(seance);
        return acc;
    }, {} as Record<number, typeof seances>);

    const schedule: FilmSchedule[] = films
        .filter((film) => (seancesByFilm[film.id] || []).length > 0)
        .map((film) => {
            const filmSeances = seancesByFilm[film.id] || [];
            const seancesWithHall = filmSeances
                .map((seance) => {
                    const hall = halls.find((hallItem) => hallItem.id === seance.seance_hallid);
                    return { seance, hall };
                })
                .filter((item): item is { seance: typeof seances[0]; hall: typeof halls[0] } => !!item.hall && item.hall.hall_open === 1)
                .sort((a, b) => a.seance.seance_time.localeCompare(b.seance.seance_time));

            return {
                film,
                seances: seancesWithHall
            };
        })
        .filter((item) => item.seances.length > 0);

    const handleHallClickSeance = (seance: typeof seances[0], film: typeof films[0]) => {
        setNavigationData((prev) => ({
            ...prev,
            seance,
            film
        }));
    };

    const isSeancePassed = (seanceTime: string, selectedDate: string) => {
        if (!selectedDate) {
            return false;
        }

        const now = new Date();
        const seanceDateTime = parse(`${selectedDate} ${seanceTime}`, "yyyy-MM-dd HH:mm", new Date());

        return isAfter(now, seanceDateTime);
    };

    return (
        <div className={styles.container}>
            {schedule.map(({ film, seances: filmSeances }) => (
                <div className={styles.film} key={film.id}>
                    <div className={styles.content}>
                        <img src={film.film_poster} className={styles.poster} alt={film.film_name} />
                        <div
                            className={styles.info}
                            style={{ ["--poster-accent-image" as string]: `url(${assetPath("Client/after-poster-icon-desktop.png")})` }}
                        >
                            <div className={styles.name}>{film.film_name}</div>
                            <div className={styles.description}>{film.film_description}</div>
                            <div className={styles["second-info"]}>
                                <div>{film.film_duration}&nbsp;минут</div>
                                <div>{film.film_origin}</div>
                            </div>
                        </div>
                    </div>
                    {Object.entries(
                        filmSeances.reduce((acc, { seance, hall }) => {
                            if (!acc[hall.hall_name]) {
                                acc[hall.hall_name] = [];
                            }
                            acc[hall.hall_name].push(seance);
                            return acc;
                        }, {} as Record<string, typeof filmSeances[0]["seance"][]>)
                    ).map(([hallName, hallSeances]) => (
                        <div key={hallName} className={styles.hall}>
                            <div className={styles["hall-name"]}>{hallName}</div>
                            <div className={styles.seances}>
                                {hallSeances
                                    .sort((a, b) => a.seance_time.localeCompare(b.seance_time))
                                    .map((seance) => {
                                        const isPassed = navigationData.date
                                            ? isSeancePassed(seance.seance_time, navigationData.date)
                                            : false;

                                        return (
                                            <NavLink
                                                to={navigationData.date && !isPassed ? `/hallconfig?seanceId=${seance.id}&date=${navigationData.date}` : "#"}
                                                key={seance.id}
                                                className={`${styles["seance-time"]} ${isPassed ? styles.disabled : ""}`}
                                                onClick={(e) => {
                                                    if (!navigationData.date || isPassed) {
                                                        e.preventDefault();
                                                    } else {
                                                        handleHallClickSeance(seance, film);
                                                    }
                                                }}
                                                style={isPassed ? { pointerEvents: "none" } : {}}
                                            >
                                                {seance.seance_time}
                                                {isPassed && <span className={styles["seance-time__disabled-indicator"]} />}
                                            </NavLink>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Seances;

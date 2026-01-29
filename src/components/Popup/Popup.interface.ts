import type { Film } from "../../interfaces/Film.interface";
import type { Hall } from "../../interfaces/Hall.interface";
import type { Seance } from "../../interfaces/Seance.interface";

export interface PopupForm {
    hallName?: HTMLInputElement;
    filmName?: HTMLInputElement;
    filmDuration?: HTMLInputElement;
    filmDescription?: HTMLInputElement;
    filmOrigin?: HTMLInputElement;
    filePoster?: HTMLInputElement;
}

export interface PopupProps {
    onClose?: () => void;
    onSuccess?: () => void;
    onSuccessAddLocal?:(seanceData: { hallId: number; filmId: number; time: string }) => void;
    film?: Film;
    hall?: Hall;
    seance?: Seance;
}
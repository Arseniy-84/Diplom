import { useMemo } from 'react';

export const useFilmColors = (films: any[]) => {
    const getRandomBalancedColor = (filmId: number): string => {
        const hue = (filmId * 137) % 360;
        const saturation = 70 + Math.floor(Math.random() * 30);
        const lightness = 40 + Math.floor(Math.random() * 30);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const filmColors = useMemo(() => {
        const colors: Record<number, string> = {};
        films.forEach(film => {
            colors[film.id] = getRandomBalancedColor(film.id);
        });
        return colors;
    }, [films]);

    return filmColors;
};
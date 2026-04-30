export const useTimeline = () => {
    const visibleRange = {
        start: 7 * 60,
        end: 23 * 60
    };

    const getSeanceWidth = (duration = 0, timelineWidth = 720) => {
        const rangeWidth = visibleRange.end - visibleRange.start;
        const calculatedWidth = (duration / rangeWidth) * timelineWidth;

        return Math.max(60, Math.min(timelineWidth, calculatedWidth));
    };

    const getSeancePosition = (seanceTime: string, timelineWidth = 720, seanceWidth = 0) => {
        const [hours, minutes] = seanceTime.split(":").map(Number);
        const startMinutes = hours * 60 + minutes;
        const rangeWidth = visibleRange.end - visibleRange.start;
        const left = ((startMinutes - visibleRange.start) / rangeWidth) * timelineWidth;
        const clampedLeft = Math.max(0, Math.min(timelineWidth - seanceWidth, left));

        return {
            left: `${clampedLeft}px`
        };
    };

    return { getSeancePosition, getSeanceWidth };
};

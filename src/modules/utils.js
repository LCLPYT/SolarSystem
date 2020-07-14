/**
 * Limitiert eine Zahl zwischen zwei Grenzen.
 * 
 * @param {number} number Die zu limitierende Zahl.
 * @param {number} min Das Minimum (untere Grenze). Wenn die zu limitierende Zahl kleiner ist, wird sie auf das Minimum gesetzt.
 * @param {number} max Das Maximum (obere Grenze). Wenn die zu limitierende Zahl größer ist, wird sie auf das Maximum gesetzt.
 * @returns Die limitierte Zahl.
 */
export function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}
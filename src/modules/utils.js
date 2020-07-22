import { scale } from "./values";

/**
 * Limitiert eine Zahl zwischen zwei Grenzen.
 * 
 * @param {number} number Die zu limitierende Zahl.
 * @param {number} min Das Minimum (untere Grenze). Wenn die zu limitierende Zahl kleiner ist, wird sie auf das Minimum gesetzt.
 * @param {number} max Das Maximum (obere Grenze). Wenn die zu limitierende Zahl größer ist, wird sie auf das Maximum gesetzt.
 * @returns {number} Die limitierte Zahl.
 */
export function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

/**
 * Konvertiert Einheiten pro Sekunde (u/s) zu Kilometer pro Sekunde (km/s).
 * 
 * @param {number} ups Einheiten pro Sekunde (u/s)
 * @returns {number} Kilometer pro Sekunde (km/s)
 */
export function convert_U_S_to_KM_S(ups) {
    return ups / scale;
}

/**
 * Konvertiert Kilometer pro Sekunde (km/s) zu Einheiten pro Sekunde (u/s).
 * 
 * @param {number} km_s Kilometer pro Sekunde (km/s)
 * @returns {number} Einheiten pro Sekunde (u/s)
 */
export function convert_KM_S_to_U_S(km_s) {
    return km_s * scale;
}

/**
 * Konvertiert Einheiten pro Sekunde (u/s) zu Kilometer pro Stunde (km/h).
 * 
 * @param {number} ups Einheiten pro Sekunde (u/s)
 * @returns {number} Kilometer pro Stunde (km/h)
 */
export function convert_U_S_to_KM_H(ups) {
    return convert_U_S_to_KM_S(ups) * 3600;
}

/**
 * Konvertiert Kilometer pro Stunde (km/h) zu Einheiten pro Sekunde (u/s).
 * 
 * @param {number} km_h Kilometer pro Stunde (km/h)
 * @returns {number} Einheiten pro Sekunde (u/s)
 */
export function convert_KM_H_to_U_S(km_h) {
    return convert_KM_S_to_U_S(km_h / 3600);
}

/**
 * Konvertiert Einheiten pro Sekunde (u/s) zu Meter pro Sekunde (m/s).
 * 
 * @param {number} ups Einheiten pro Sekunde (u/s)
 * @returns {number} Meter pro Sekunde (m/s)
 */
export function convert_U_S_to_M_S(ups) {
    return convert_U_S_to_KM_S(ups) * 1000;
}

/**
 * Konvertiert Meter pro Sekunde (m/s) zu Einheiten pro Sekunde (u/s).
 * 
 * @param {number} m_s Meter pro Sekunde (m/s)
 * @returns {number} Einheiten pro Sekunde (u/s)
 */
export function convert_M_S_to_U_S(m_s) {
    return convert_KM_S_to_U_S(m_s / 1000);
}

/**
 * Spaltet eine Zeichenkette in ihre Wörter auf. Die Wörter können nicht leer sein.
 * 
 * @param {string} string Der zu konvertierende String.
 * @returns {string[]} Ein Feld mit den einzelnden Wörtern.
 */
export function splitIntoWords(string) {
    return string.split(" ").filter(word => word.length > 0);
}

/**
 * Berechnet die Einheiten pro Sekunde (u/s) aufgrund einer gegebenen Einheit und Anzahl.
 * 
 * @param {number} amount Die Anzahl der Einheit.
 * @param {string} unit Die Einheit als String.
 * @returns {number} Einheiten pro Sekunde (u/s)
 */
export function getUPS(amount, unit) {
    switch (unit.toLowerCase()) {
        case "km/s": return convert_KM_S_to_U_S(amount);
        case "km/h": return convert_KM_H_to_U_S(amount);
        case "m/s": return convert_M_S_to_U_S(amount);
        default: return amount; // u/s
    }
}
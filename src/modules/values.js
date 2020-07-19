// Konstanten
export const scale = 0.000001; // Die Skalierung der Objekte in der Szene. Der Maßstab beträgt 100000:1
export const speedOfLight = 299792 * scale; // Die Lichtgeschwindigkeit, skaliert.

// Variablen
export let timePerSecond = 60 * 60 * 24; // Eine Sekunde (Echtzeit) entspricht einem Tag

// Setter für Variablen
export function setTimePerSecond(tps) {
    timePerSecond = tps;
}

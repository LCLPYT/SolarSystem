/** @type {HTMLCanvasElement} */
export const canvas = (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
export const ctx = (canvas.getContext('2d'));

export const grav = 6.67430E-11; // m^3*km^-2*s^-1

export let auPerPixel = 1 / 15; // 1 AE pro 15 pixel
export let secondMultiplier = 6000; // 1 Sekunde Echtzeit entspricht 6000 Sekunden in der Simulation

export function setAuPerPixel(value) {
    auPerPixel = value;
}

export function setSecondMultiplier(multiplier) {
    secondMultiplier = multiplier;
}
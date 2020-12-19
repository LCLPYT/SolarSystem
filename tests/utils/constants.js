/** @type {HTMLCanvasElement} */
export const canvas = (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
export const ctx = canvas != null ? (canvas.getContext('2d')) : null;

export const grav = 6.67430E-11; // m^3*kg^-1*s^-2

export let auPerPixel = 1 / 15; // 1 AE pro 15 pixel
export let secondMultiplier = 60; // 1 Sekunde Echtzeit entspricht 60 Sekunden in der Simulation

export function setAuPerPixel(value) {
    auPerPixel = value;
}

export function setSecondMultiplier(multiplier) {
    secondMultiplier = multiplier;
}
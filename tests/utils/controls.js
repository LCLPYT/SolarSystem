import * as CONSTANTS from './constants.js';

const btnZoomIn = document.getElementById("zoomIn"), btnZoomOut = document.getElementById("zoomOut");
/** @type {HTMLInputElement} */
const timeScaleInput = (document.getElementById("timeScaleInput"));

btnZoomIn.addEventListener("click", () => {
    let pixel = 1 / CONSTANTS.auPerPixel;
    CONSTANTS.setAuPerPixel(1 / (pixel + 3));
});
btnZoomOut.addEventListener("click", () => {
    let pixel = 1 / CONSTANTS.auPerPixel;
    if(pixel == 3) return;
    CONSTANTS.setAuPerPixel(1 / (pixel - 3));
});

timeScaleInput.value = (CONSTANTS.secondMultiplier / 60).toString();
timeScaleInput.addEventListener ("change", function () {
    CONSTANTS.setSecondMultiplier(Number(timeScaleInput.value) * 60);
});
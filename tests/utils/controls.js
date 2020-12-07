import * as CONSTANTS from './constants.js';

const btnZoomIn = document.getElementById("zoomIn"), btnZoomOut = document.getElementById("zoomOut");
/** @type {HTMLInputElement} */
const timeScaleInput = (document.getElementById("timeScaleInput"));

if(btnZoomIn != null) {
    btnZoomIn.addEventListener("click", () => {
        let pixel = 1 / CONSTANTS.auPerPixel;
        CONSTANTS.setAuPerPixel(1 / (pixel + 3));
    });
}
if(btnZoomOut != null) {
    btnZoomOut.addEventListener("click", () => {
        let pixel = 1 / CONSTANTS.auPerPixel;
        if(pixel == 3) return;
        CONSTANTS.setAuPerPixel(1 / (pixel - 3));
    });
}

if(timeScaleInput != null) {
    timeScaleInput.value = (CONSTANTS.secondMultiplier / 60).toString();
    timeScaleInput.addEventListener ("change", function () {
        CONSTANTS.setSecondMultiplier(Number(timeScaleInput.value) * 60);
    });
}
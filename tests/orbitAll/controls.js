const btnZoomIn = document.getElementById("zoomIn"), btnZoomOut = document.getElementById("zoomOut");
const timeScaleInput = document.getElementById("timeScaleInput");

btnZoomIn.addEventListener("click", () => {
    let pixel = 1 / auPerPixel;
    auPerPixel = 1 / (pixel + 3);
});
btnZoomOut.addEventListener("click", () => {
    let pixel = 1 / auPerPixel;
    if(pixel == 3) return;
    auPerPixel = 1 / (pixel - 3);
});

timeScaleInput.value = secondMultiplier / 60;
timeScaleInput.addEventListener ("change", function () {
    secondMultiplier = Number(timeScaleInput.value) * 60;
});
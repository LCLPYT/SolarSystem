/* Benötigte Dateien für Webpack importieren */
import './index.html';
import './style.css';
import '../resource/favicon.png';

/* Komponenten anderer Module importieren */
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { bodies, setDwarfPlanetsVisible, setMoonsVisible, sun } from './ts/Bodies';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitBody } from './ts/OrbitBody';
import { advanceTime, updateTimestamp, timeMultiplier, setTimeMultiplier, precision, setPrecision } from './ts/Physics';
import { TICKS_PER_SECOND } from './ts/Constants';

/* three.js Komponenten deklarieren */
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cssRenderer: CSS2DRenderer;
let canvas: HTMLCanvasElement;
let controls: OrbitControls;

/* three.js Komponenten initialisieren */
// Szenen Objekt
scene = new THREE.Scene;
// Kamera Objekt
camera = new THREE.PerspectiveCamera(
    75,                                     // Sichtfeld
    window.innerWidth / window.innerHeight, // Seitenverhältnis
    0.1,                                    // Distanz zur Kamera, bis zu welcher Objekte nicht angezeigt werden; Performance
    100000000                               // Distanz zur Kamera, ab welcher Objekte nicht mehr angezeigt werden; Performance
);
// Renderer (Der Abbilder)
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Leinwand generieren und in HTML einfügen
canvas = renderer.domElement;
document.body.appendChild(canvas);
// 2D Renderer (projeziert HTML Objekte aus dem dreidimensionalen Raum auf die Bildschirmkoordinaten)
cssRenderer = new CSS2DRenderer;
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0px';
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssRenderer.domElement);
// Steuerung der Bewegung (mit der Maus Umsehen usw.)
controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableKeys = true;
controls.maxDistance = 10000000;

/* Szene populieren */
// Umgebungslicht
let ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);
// Himmelskörper hinzufügen
bodies.forEach(body => {
    body.init();
    body.addToScene(scene);
});
// Kamera positionieren und auf die Sonne richten
camera.position.set(80000, 160000, 320000);
camera.lookAt(sun.mesh.position);

/* Benutzeroberfläche */
// Anfangszeitpunkt in HTML schreiben
updateTimestamp();
// Programm pausieren, wenn der Benutzer den Fokus wegnimmt;
window.onblur = () => paused = true;
// Programm fortsetzen, sobald der Benutzer den Tab wieder fokussiert
window.onfocus = () => {
    paused = false;
    tickLogic();
    requestAnimationFrame(animate); 
};
// Kamera und Renderers beim umskalieren des Tabs aktualisieren.
window.onresize = () => {
    // https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
};
// Einstellungselemente aus HTML holen
let dwarfCheckbox = <HTMLInputElement> document.getElementById("dwarf");
let moonsCheckbox = <HTMLInputElement> document.getElementById("moons");
let speedControl = <HTMLInputElement> document.getElementById("speed");
let precisionControl = <HTMLInputElement> document.getElementById("precision");
// Standardwerte schreiben
dwarfCheckbox.checked = true;
moonsCheckbox.checked = true;
speedControl.value = timeMultiplier.toString();
precisionControl.value = precision.toString();
// Änderungsfunktionen definieren
dwarfCheckbox.onchange = () => setDwarfPlanetsVisible(dwarfCheckbox.checked);
moonsCheckbox.onchange = () => setMoonsVisible(moonsCheckbox.checked);
speedControl.onchange = () => setTimeMultiplier(Number(speedControl.value));
precisionControl.onchange = () => setPrecision(Number(precisionControl.value));

/* Schleifen */
let paused: boolean = false;

/**
 * render()-Schleife, in welcher die Szene auf der Leinwand dargestellt wird.
 * Wird abhängig von der Bildwiederholfrequenz des Bildschirms wiederholt aufgerufen.
 */
function animate() {
    if (paused) return;

    // Funktion erneut aufrufen
    requestAnimationFrame(animate);

    // Bewegungssteuerung aktualisieren, wird von three.js von sich aus benötigt
    controls.update();

    // Abbilder die momente Szene abbilden lassen
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);

    // Die Planetenpositionen interpolieren
    bodies.forEach(body => body.interpolation.tick());
}

/**
 * tick()-Schleife, in welcher die Berechnungen der Planetenbewegungen ausgeführt werden.
 * Wird in einem vorgegebenen Zeitabstand wiederholt.
 */
async function tickLogic() {
    if (paused) return;

    // Zeitdifferenz zum letzten Aufruf ermitteln. Ergibt sich aus den festgelegten Ausführungen pro Sekunde.
    const dt = 1 / TICKS_PER_SECOND; // in Sekunden

    // Berechnungen tätigen
    advanceTime(dt);

    // Planetenspuren hinterlassen
    bodies.forEach(body => {
        if (body instanceof OrbitBody) body.feedOrbitPosition(body.mesh.position);
    });

    // Funktion wiederholt aufrufen, nachdem alle Berechnungen abgeschlossen sind.
    setTimeout(tickLogic, dt * 1000);
}

// Schleifen werden hiermit begonnen.
tickLogic();
requestAnimationFrame(animate);
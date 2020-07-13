import './index.html';
import './style.css';
import * as THREE from 'three';
import * as PLANETS from './modules/planets.js';
import * as INPUT from './modules/input.js';
import * as MOVEMENT from './modules/movement.js'

/* Globale Variablen */

export const scale = 0.000001;

// Die drei Basisvariablen vom Three.js renderer. (weiter beschrieben in init())
export let scene, camera, renderer;

// Das HTML5 Leinwand (canvas) Objekt, auf welchem der renderer abbildet.
export let canvas;

/* - */

// Initialisieren
init();
// Event listeners registrieren
INPUT.registerInputListeners();
// Die Hauptschleife starten.
animate();

/**
 * Initialisiert den Renderer, die Szene und Kamera, sowie die Objekte, die dargestellt werden sollen.
 */
function init() {
  // Die Szene enthält die Objekte, die später auf dem Bildschirm abgebildet werden sollen.
  scene = new THREE.Scene();

  // Die Kamera repräsentiert den Blick des Zuschauers.
  camera = new THREE.PerspectiveCamera(
    75, // field of view - Blickwinkel
    window.innerWidth / window.innerHeight, // aspect ratio - Seitenverhältnis, das für Skalierungen usw. benutzt wird.
    1, // near clipping pane - Objekte die näher an der Kamera als diese Distanz sind, werden ausgeblendet.
    10000 // far clipping pane - Objekte die weiter entfernt von der Kamera als diese Distanz sind, werden ausgeblendet (aus Leistungsgründen)
  );

  // Der Renderer ist für das Darstellen der Objekte auf dem Bildschirm zuständig.
  renderer = new THREE.WebGLRenderer({
    antialias: true // Kantenglättung
  });
  // Setzen der Auflösung. Hier wird sie der des Bildschirms angepasst.
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Hinzufügen des HTML5 Leinwand Objektes (canvas)
  canvas = renderer.domElement;
  document.body.appendChild(canvas);

  /** Hinzufügen von einer Lichtquelle TODO: später in einer Klasse mit Sonne erzeugen **/
  let lamp = new THREE.PointLight(0xffffff, 2);
  lamp.position.set(0, 0, 0);
  scene.add(lamp);

  /** Hinzufügen Sonne **/
  PLANETS.SUN.addToScene(scene);

  /** Hinzufügen der Planeten **/
  PLANETS.MERCURY.addToScene(scene);
  PLANETS.VENUS.addToScene(scene);
  PLANETS.EARTH.addToScene(scene);
  PLANETS.MOON.addToScene(scene);
  PLANETS.MARS.addToScene(scene);
  PLANETS.JUPITER.addToScene(scene);
  PLANETS.SATURN.addToScene(scene);
  PLANETS.URANUS.addToScene(scene);
  PLANETS.NEPTUNE.addToScene(scene);
  PLANETS.PLUTO.addToScene(scene);

  // Die Kamera aus dem Koordinatenursprung bewegen, da sie sonst in der Sonne stecken würde.
  camera.position.set(0, 1000, 2000);
  camera.lookAt(PLANETS.SUN.mesh.position);

  // Die Blickrichtung initalisieren
  MOVEMENT.updateViewDirection();
}

/**
 * Diese Funktion ist eine Schleife, welche für das Aktualisieren des Bildschirms zuständig ist.
 * In ihr wird der Renderer aufgerufen.
 */
function animate() {
  requestAnimationFrame(animate); // Diese Anweisung sorgt dafür, dass die Funktion wiederholt aufgerufen wird. Dabei wird auch eine bestimmte Zeit gewartet um der Wiederholfrequenz des Bildschirms gerecht zu werden.

  MOVEMENT.tick();

  // Mit dieser Anweisung bildet der Renderer die Szene auf der Leinwand ab.
  renderer.render(scene, camera);

  // Zeichnen der Planetenbeschriftungen.
  PLANETS.drawPlanetLabels();
}
import './index.html';
import './style.css';
import * as THREE from 'three';
import * as PLANETS from './modules/planets.js';
import * as INPUT from './modules/input.js';
import * as MOVEMENT from './modules/movement.js'

/* Globale Variablen */

// Die drei Basisvariablen vom Three.js renderer. (weiter beschrieben in init())
export let scene, camera, renderer;

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
    0.1, // near clipping pane - Objekte die näher an der Kamera als diese Distanz sind, werden ausgeblendet.
    100000000 // far clipping pane - Objekte die weiter entfernt von der Kamera als diese Distanz sind, werden ausgeblendet (aus Leistungsgründen)
  );

  // Der Renderer ist für das Darstellen der Objekte auf dem Bildschirm zuständig.
  renderer = new THREE.WebGLRenderer({
    antialias: true // Kantenglättung
  });
  // Setzen der Auflösung. Hier wird sie der des Bildschirms angepasst.
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Hinzufügen des HTML5 Leinwand Objektes (canvas)
  document.body.appendChild(renderer.domElement);

  /** Hinzufügen von einer Lichtquelle TODO: später in einer Klasse mit Sonne erzeugen **/
  let lamp = new THREE.PointLight(0xffffff, 2);
  lamp.position.set(0, 0, 0);
  scene.add(lamp);

  /** Hinzufügen Sonne **/
  PLANETS.SUN.addToScene(scene);

  /** Hinzufügen der Planeten **/
  PLANETS.MERCURY.moveTo(750000, 0, 0).addToScene(scene);
  PLANETS.VENUS.moveTo(850000, 0, 0).addToScene(scene);
  PLANETS.EARTH.moveTo(980000, 0, 0).addToScene(scene);
  PLANETS.MOON.moveTo(990000, 0, 0).addToScene(scene);
  PLANETS.MARS.moveTo(1100000, 0, 0).addToScene(scene);
  PLANETS.JUPITER.moveTo(1500000, 0, 0).addToScene(scene);
  PLANETS.SATURN.moveTo(1800000, 0, 0).addToScene(scene);
  PLANETS.URANUS.moveTo(2100000, 0, 0).addToScene(scene);
  PLANETS.NEPTUNE.moveTo(2350000, 0, 0).addToScene(scene);

  // Die Kamera aus dem Koordinatenursprung bewegen, da sie sonst in der Sonne stecken würde.
  camera.position.z = 2000000;

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
}
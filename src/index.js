import './index.html';
import './style.css';
import * as THREE from 'three';

/* Globale Variablen */

// Die drei Basisvariablen vom Three.js renderer. (weiter beschrieben in init())
let scene, camera, renderer;
// Objekte der Szene, die außerhalb von init() noch gebraucht werden.
let sun;
// Ein Feld, welches die Nummern der gerade gedrückten Tasten enthält.
let pressedKeys = [];
// Bewegungsgeschwindigkeit der Kamera
const movement = 0.02;
// Nummern bestimmter Tasten
const MOVE_FORWARDS = 87, // 'w'
      MOVE_BACKWARDS = 83, // 's'
      MOVE_LEFT = 65, // 'a'
      MOVE_RIGHT = 68, // 'd'
      MOVE_UP = 32, // 'space'
      MOVE_DOWN = 16, // 'shift'
      LOOK_UP = 38, // 'arrow_up'
      LOOK_DOWN = 40, // 'arrow_down'
      LOOK_LEFT = 37, // 'arrow_left',
      LOOK_RIGHT = 39; // 'arrow_right'

/* - */

// Initialisieren
init();
// Event listeners registrieren
registerListeners();
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
    1000 // far clipping pane - Objekte die weiter entfernt von der Kamera als diese Distanz sind, werden ausgeblendet (aus Leistungsgründen)
  );

  // Der Renderer ist für das Darstellen der Objekte auf dem Bildschirm zuständig.
  renderer = new THREE.WebGLRenderer({
    antialias: true // Kantenglättung
  });
  // Setzen der Auflösung. Hier wird sie der des Bildschirms angepasst.
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Hinzufügen des HTML5 Leinwand Objektes (canvas)
  document.body.appendChild(renderer.domElement);

  /** Hinzufügen von einer Lichtquelle TODO: später entfernen **/
  let lamp = new THREE.PointLight(0xffffff, 1);
  lamp.position.y = 5;
  lamp.position.x = -4;
  lamp.position.z = 3;
  scene.add(lamp);

  /** Darstellung der Sonne **/
  addSun();

  // Die Kamera aus dem Koordinatenursprung bewegen, da sie sonst in der Sonne stecken würde.
  camera.position.z = 5;
}

function addSun() {
  // Definieren eines Geometrieobjektes, welches alle Eckpunkte, sowie Flächen dieser speichert. SphereGeometry ist in dem Fall die Geometrie für eine Kugel.
  let sunGeometry = new THREE.SphereGeometry(
    1, //Radius
    64, // widthSegments - Anzahl der horizontalen Segmente der Kugel
    64 // heightSegments - Anzahl der vertikalen Segmente der Kugel
  );

  // Definieren eines Materials, welches für das Objekt benutzt wird. Dieses Material sorgt für die Farbe des dargestellten Objektes. In diesem Fall sorgt dieses Material dafür, dass die Sonne gelb dargestellt wird.
  let sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xFDB813, // Farbe der Sonne
    emissive: 0xFDB813, // Sonne soll als Lichtquelle agieren, deshalb emmitiert sie Licht
    emissiveIntensity: 0.1 // Stärke der Emmitierung (TODO test)
  });
  // Definieren eines Meshes. Dieses Objekt speichert eine Geometrie und ein dazugehöriges Material. Dieses Objekt repräsentiert im Moment die Sonne.
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  // Hinzufügen der Sonne zur Szene.
  scene.add(sun);
}

/**
 * Diese Funktion registriert alle für dieses Projekt relevanten event listeners.
 * Ein EventListener ist eine Funktion, die aufgerufen wird, sobald ein bestimmtes Ereignis auftritt (z.B. eine Taste wird gedrückt)
 */
function registerListeners() {
  /*
  Dieser Listener wird aufgerufen, sobald eine Taste gedrückt wird.
  Die Funktion testet, ob die gedrückte Taste schon vorher gedrückt wurde (dieser Listener kann mehrmals auf einmal aufgerufen werden).
  Wenn nicht, wird sich gemerkt, dass die Taste gedrückt wurde, indem die Nummer der Taste in einem Feld gespeichert wird.
  Dieses Programm sieht die Taste solang als gedrückt an, wie diese Nummer im Feld gespeichert bleibt.
  */
  document.addEventListener("keydown", e => {
    if(!pressedKeys.includes(e.which)) pressedKeys.push(e.which);
  }, false);

  /*
  Dieser Listener ist das Gegenstück zum 'keydown' Listener, er wird aufgerufen, sobald eine Taste losgelassen wird.
  Wenn die Nummer der Taste im Feld gespeichert ist, wird sie entfernt und somit nicht mehr als gedrückt angesehen.
  */
  document.addEventListener("keyup", e => {
    if(!pressedKeys.includes(e.which)) return;
    let index = pressedKeys.indexOf(e.which);
    if(index >= 0) pressedKeys.splice(index, 1);
  }, false);
}

/**
 * Diese Funktion ist eine Schleife, welche für das Aktualisieren des Bildschirms zuständig ist.
 * In ihr wird der Renderer aufgerufen.
 */
function animate() {
  requestAnimationFrame(animate); // Diese Anweisung sorgt dafür, dass die Funktion wiederholt aufgerufen wird. Dabei wird auch eine bestimmte Zeit gewartet um der Wiederholfrequenz des Bildschirms gerecht zu werden.

  // Bewegungslogik der Kamera
  // TODO: Bewegung aufgrund der Blickrichtung ausrichten
  // z-Achse
  if (isKeyDown(MOVE_FORWARDS) && !isKeyDown(MOVE_BACKWARDS)) camera.position.z -= movement;
  else if (isKeyDown(MOVE_BACKWARDS) && !isKeyDown(MOVE_FORWARDS)) camera.position.z += movement;
  // x-Achse
  if (isKeyDown(MOVE_LEFT) && !isKeyDown(MOVE_RIGHT)) camera.position.x -= movement;
  else if (isKeyDown(MOVE_RIGHT) && !isKeyDown(MOVE_LEFT)) camera.position.x += movement;
  // y-Achse
  if (isKeyDown(MOVE_UP) && !isKeyDown(MOVE_DOWN)) camera.position.y += movement;
  else if (isKeyDown(MOVE_DOWN) && !isKeyDown(MOVE_UP)) camera.position.y -= movement;
  // x-Rotation
  if (isKeyDown(LOOK_UP) && !isKeyDown(LOOK_DOWN)) camera.rotation.x += movement;
  else if (isKeyDown(LOOK_DOWN) && !isKeyDown(LOOK_UP)) camera.rotation.x -= movement;
  // y-Rotation
  if (isKeyDown(LOOK_LEFT) && !isKeyDown(LOOK_RIGHT)) camera.rotation.y += movement;
  else if (isKeyDown(LOOK_RIGHT) && !isKeyDown(LOOK_LEFT)) camera.rotation.y -= movement;

  // Mit dieser Anweisung bildet der Renderer die Szene auf der Leinwand ab.
  renderer.render(scene, camera);
}

/**
 * Testet, ob eine Taste gerade gedrückt ist.
 * 
 * @param {number} keyCode Die Nummer der Taste.
 * @returns {boolean} True, wenn die Taste mit der angegebenen Nummer gerade gedrückt ist.
 */
function isKeyDown(keyCode) {
  return pressedKeys.includes(keyCode);
}
import './index.html';
import './style.css';
import * as THREE from 'three';
import * as PLANETS from './modules/planets.js';
import * as INPUT from './modules/input.js';

/* Globale Variablen */

// Die drei Basisvariablen vom Three.js renderer. (weiter beschrieben in init())
let scene, camera, renderer;
// Die Blickrichtung als Vektor
let view = new THREE.Vector3();
// Bewegungsrichtungs-Vektor
let movement = new THREE.Vector3();
// Bewegungsgeschwindigkeit der Kamera
const movementSpeed = 10000, rotationSpeed = 0.02;
// Achsen-Vektoren
const AXIS_Y = new THREE.Vector3(0, 1, 0);

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
  updateViewDirection();
}

/**
 * Diese Funktion ist eine Schleife, welche für das Aktualisieren des Bildschirms zuständig ist.
 * In ihr wird der Renderer aufgerufen.
 */
function animate() {
  requestAnimationFrame(animate); // Diese Anweisung sorgt dafür, dass die Funktion wiederholt aufgerufen wird. Dabei wird auch eine bestimmte Zeit gewartet um der Wiederholfrequenz des Bildschirms gerecht zu werden.

  runMovementLogic();

  // Mit dieser Anweisung bildet der Renderer die Szene auf der Leinwand ab.
  renderer.render(scene, camera);
}

/**
 * Diese Funktion wird aus der animate() Schleife aufgerufen.
 * Sie kümmert sich um die Bewegungslogik der Kamera. Also z.B. wenn man 'w' drückt, dass sie sich nach vorne bewegt
 */
function runMovementLogic() {
  movement.set(0, 0, 0); //Bewegungsvektor zurücksetzen

  // Vor / Zurück
  if (INPUT.isKeyDown(INPUT.MOVE_FORWARDS) && !INPUT.isKeyDown(INPUT.MOVE_BACKWARDS)) movement.add(view); // Die Blickrichtung entspricht der Richtung vorwärts und ist auch schon skaliert, daher kann der Vektor einfach addiert werden.
  else if (INPUT.isKeyDown(INPUT.MOVE_BACKWARDS) && !INPUT.isKeyDown(INPUT.MOVE_FORWARDS)) movement.sub(view); // Wie in der Zeile darüber, nur wird der Vektor dieses mal subtrahiert und nicht addiert.
  // Links / Rechts
  if (INPUT.isKeyDown(INPUT.MOVE_LEFT) && !INPUT.isKeyDown(INPUT.MOVE_RIGHT)) movement.add(view.clone().applyAxisAngle(AXIS_Y, Math.PI / 2)); // Gleiches Prinzip, wie für Vor / Zurück, nur dass der Bewegungsrichtungsvektor 90° an der y-Achse rotiert ist.
  else if (INPUT.isKeyDown(INPUT.MOVE_RIGHT) && !INPUT.isKeyDown(INPUT.MOVE_LEFT)) movement.sub(view.clone().applyAxisAngle(AXIS_Y, Math.PI / 2)); // **
  // Oben / Unten
  if (INPUT.isKeyDown(INPUT.MOVE_UP) && !INPUT.isKeyDown(INPUT.MOVE_DOWN)) movement.setComponent(1, movementSpeed); // Die y-Komponente des Bewegungsvektors (index 1) auf die Bewegungsgeschwindigkeit setzen.
  else if (INPUT.isKeyDown(INPUT.MOVE_DOWN) && !INPUT.isKeyDown(INPUT.MOVE_UP)) movement.setComponent(1, -movementSpeed); // Das gleiche, nur mit der negativen Bewegungsgeschwindigkeit

  camera.position.add(movement); // Die Bewegung mithilfe von Vektoraddition auf die position addieren.

  // Rotationslogik der Kamera
  let rotated = false; // In dieser Variable wird gespeichert, ob in dieser Iteration die Kamera rotiert wurde.
  
  // nach Oben / Unten sehen
  if (INPUT.isKeyDown(INPUT.LOOK_UP) && !INPUT.isKeyDown(INPUT.LOOK_DOWN)) {
    camera.rotation.x += rotationSpeed;
    if (camera.rotation.x > Math.PI / 2) camera.rotation.x = Math.PI / 2; // Durch diese Beschränkung kann man Maximal 90° nach oben schauen und sich nicht "überschlagen"
    rotated = true;
  }
  else if (INPUT.isKeyDown(INPUT.LOOK_DOWN) && !INPUT.isKeyDown(INPUT.LOOK_UP)) {
    camera.rotation.x -= rotationSpeed;
    if (camera.rotation.x < -Math.PI / 2) camera.rotation.x = -Math.PI / 2; // Durch diese Beschränkung kann man Maximal -90° nach unten schauen und sich nicht "überschlagen"
    rotated = true;
  }
  // Nach Links / Rechts sehen
  if (INPUT.isKeyDown(INPUT.LOOK_LEFT) && !INPUT.isKeyDown(INPUT.LOOK_RIGHT)) {
    camera.rotation.y += rotationSpeed;
    rotated = true;
  }
  else if (INPUT.isKeyDown(INPUT.LOOK_RIGHT) && !INPUT.isKeyDown(INPUT.LOOK_LEFT)) {
    camera.rotation.y -= rotationSpeed;
    rotated = true;
  }

  // Wenn eine Rotation stattgefunden hat, den Vektor der Blickrichtung aktualisieren.
  if (rotated) updateViewDirection();
}

/**
 * Diese Funktion aktualisiert den Blickrichtungs-Vektor.
 * Sie sollte aufgerufen werden, sobald die Rotation der Kamera verändert wird.
 */
function updateViewDirection() {
  camera.getWorldDirection(view); // Berechnet die Blickrichtung der Kamera und speichert sie in 'view'.
  view.multiplyScalar(movementSpeed); // Bewegungsrichtung aus Performancegründen direkt hier skalieren.
}
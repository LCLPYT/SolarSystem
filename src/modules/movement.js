import * as THREE from 'three';
import * as INPUT from './input.js';
import {camera} from './../index.js';

// Bewegungsgeschwindigkeiten der Kamera
export let movementSpeed = 10,
  rotationSpeed = 0.02;
// Die Blickrichtung als Vektor
let view = new THREE.Vector3();
// Bewegung als Vektor
let movement = new THREE.Vector3();
// Achsen-Vektoren
const AXIS_Y = new THREE.Vector3(0, 1, 0);

/**
 * Diese Funktion wird aus der animate() Schleife aufgerufen.
 * Sie kümmert sich um die Bewegungslogik der Kamera. Also z.B. wenn man 'w' drückt, dass sie sich nach vorne bewegt
 */
export function tick() {
  movement.set(0, 0, 0); //Bewegungsvektor zurücksetzen

  let step = view.clone();
  step.multiplyScalar(movementSpeed);

  // Vor / Zurück
  if (isKeyDown(INPUT.MOVE_FORWARDS) && !isKeyDown(INPUT.MOVE_BACKWARDS)) movement.add(step); // Die Blickrichtung entspricht der Richtung vorwärts und ist auch schon skaliert, daher kann der Vektor einfach addiert werden.
  else if (isKeyDown(INPUT.MOVE_BACKWARDS) && !isKeyDown(INPUT.MOVE_FORWARDS)) movement.sub(step); // Wie in der Zeile darüber, nur wird der Vektor dieses mal subtrahiert und nicht addiert.
  // Links / Rechts
  if (isKeyDown(INPUT.MOVE_LEFT) && !isKeyDown(INPUT.MOVE_RIGHT)) movement.add(step.clone().applyAxisAngle(AXIS_Y, Math.PI / 2)); // Gleiches Prinzip, wie für Vor / Zurück, nur dass der Bewegungsrichtungsvektor 90° an der y-Achse rotiert ist.
  else if (isKeyDown(INPUT.MOVE_RIGHT) && !isKeyDown(INPUT.MOVE_LEFT)) movement.sub(step.clone().applyAxisAngle(AXIS_Y, Math.PI / 2)); // **
  // Oben / Unten
  if (isKeyDown(INPUT.MOVE_UP) && !isKeyDown(INPUT.MOVE_DOWN)) movement.setComponent(1, movementSpeed); // Die y-Komponente des Bewegungsvektors (index 1) auf die Bewegungsgeschwindigkeit setzen.
  else if (isKeyDown(INPUT.MOVE_DOWN) && !isKeyDown(INPUT.MOVE_UP)) movement.setComponent(1, -movementSpeed); // Das gleiche, nur mit der negativen Bewegungsgeschwindigkeit

  camera.position.add(movement); // Die Bewegung mithilfe von Vektoraddition auf die position addieren.

  // Rotationslogik der Kamera
  let rotated = false; // In dieser Variable wird gespeichert, ob in dieser Iteration die Kamera rotiert wurde.

  // nach Oben / Unten sehen
  if (isKeyDown(INPUT.LOOK_UP) && !isKeyDown(INPUT.LOOK_DOWN)) {
    camera.rotation.x += rotationSpeed;
    if (camera.rotation.x > Math.PI / 2) camera.rotation.x = Math.PI / 2; // Durch diese Beschränkung kann man Maximal 90° nach oben schauen und sich nicht "überschlagen"
    rotated = true;
  } else if (isKeyDown(INPUT.LOOK_DOWN) && !isKeyDown(INPUT.LOOK_UP)) {
    camera.rotation.x -= rotationSpeed;
    if (camera.rotation.x < -Math.PI / 2) camera.rotation.x = -Math.PI / 2; // Durch diese Beschränkung kann man Maximal -90° nach unten schauen und sich nicht "überschlagen"
    rotated = true;
  }
  // Nach Links / Rechts sehen
  if (isKeyDown(INPUT.LOOK_LEFT) && !isKeyDown(INPUT.LOOK_RIGHT)) {
    camera.rotation.y += rotationSpeed;
    rotated = true;
  } else if (isKeyDown(INPUT.LOOK_RIGHT) && !isKeyDown(INPUT.LOOK_LEFT)) {
    camera.rotation.y -= rotationSpeed;
    rotated = true;
  }

  // Wenn eine Rotation stattgefunden hat, den Vektor der Blickrichtung aktualisieren.
  if (rotated) updateViewDirection();
}

/**
 * Abkürzung für isKeyDown()
 * 
 * @param {number} key Nummer der Taste.
 */
function isKeyDown(key) {
  return INPUT.isKeyDown(key);
}

/**
 * Diese Funktion aktualisiert den Blickrichtungs-Vektor.
 * Sie sollte aufgerufen werden, sobald die Rotation der Kamera verändert wird.
 */
export function updateViewDirection() {
  camera.getWorldDirection(view); // Berechnet die Blickrichtung der Kamera und speichert sie in 'view'.
}

/**
 * Setzt die Bewegungsgeschwindigkeit der Kamera
 * 
 * @param {number} speed Die Bewegungsgeschwindigkeit in Einheiten/Sekunde
 */
export function setMovementSpeed(speed) {
  console.log(speed);
  movementSpeed = Math.max(0, speed); // movementSpeed kann hiermit nicht kleiner als 0 werden.
}
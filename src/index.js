import './index.html';
import './style.css';
import * as THREE from 'three';

let scene, camera, renderer;
let geometry, material, cube;

init();
animate();

/**
 * Initialisiert den Renderer, die Szene und Kamera, sowie die Objekte, die dargestellt werden sollen.
 */
function init() {
  // Die Szene enthält die Objekte, die später auf dem Bildschirm abgebildet werden sollen.
  scene = new THREE.Scene();

  // Die Kamera repräsentiert den Blick des Zuschauers.
  camera = new THREE.PerspectiveCamera(
    75, // field of view      - Blickwinkel
    window.innerWidth / window.innerHeight, // aspect ratio       - Seitenverhältnis, das für Skalierungen usw. benutzt wird.
    0.1, // near clipping pane - Objekte die näher an der Kamera als diese Distanz sind, werden ausgeblendet.
    1000 // far clipping pane  - Objekte die weiter entfernt von der Kamera als diese Distanz sind, werden ausgeblendet (aus Leistungsgründen)
  );

  // Der Renderer ist für das Darstellen der Objekte auf dem Bildschirm zuständig.
  renderer = new THREE.WebGLRenderer();
  // Setzen der Auflösung. Hier wird sie der des Bildschirms angepasst.
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Hinzufügen des HTML5 Leinwand Objektes (canvas)
  document.body.appendChild(renderer.domElement);

  /** Darstellung eines Würfels **/

  // Definieren eines Geometrieobjektes, welches alle Eckpunkte, sowie Flächen dieser speichert. BoxGeometry ist in dem Fall die Geometrie für einen Würfel.
  geometry = new THREE.BoxGeometry();
  // Definieren eines Materials, welches für das Objekt benutzt wird. Dieses Material sorgt für die Farbe des dargestellten Objektes. In diesem Fall sorgt dieses Material dafür, dass der Würfel grün dargestellt wird.
  material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  // Definieren eines Meshes. Dieses Objekt speichert eine Geometrie und ein dazugehöriges Material. Dieses Objekt repräsentiert im Moment einen grünen Würfel.
  cube = new THREE.Mesh(geometry, material);

  // Hinzufügen des Würfels zur Szene.
  scene.add(cube);

  // Der Würfel ist im Moment im Koordinatenursprung, genauso, wie die Kamera. Deswegen würde man den Würfel nicht sehen. Mit dieser Anweisung wird die Position der Kamera auf der z-Achse um 5 Einheiten bewegt, damit man den Würfel sehen kann.
  camera.position.z = 5;
}

/**
 * Diese Funktion ist eine Schleife, welche für das Aktualisieren des Bildschirms zuständig ist.
 * In ihr wird der Renderer aufgerufen.
 */
function animate() {
  requestAnimationFrame(animate); // Diese Anweisung sorgt dafür, dass die Funktion wiederholt aufgerufen wird. Dabei wird auch eine bestimmte Zeit gewartet um der Wiederholfrequenz des Bildschirms gerecht zu werden.

  // Hier wird die Rotation des Würfels verändert, damit der Würfel nicht nur immer in der selben Position abgebildet wird.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  // Mit dieser Anweisung bildet der Renderer die Szene auf der Leinwand ab.
  renderer.render(scene, camera);
}
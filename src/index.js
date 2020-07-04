import './index.html';
import './style.css';
import * as THREE from 'three';

let scene, camera, renderer;
let sun;

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
    emissiveIntensity: 1 // Stärke der Emmitierung (TODO test)
  });
  // Definieren eines Meshes. Dieses Objekt speichert eine Geometrie und ein dazugehöriges Material. Dieses Objekt repräsentiert im Moment die Sonne.
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  // Hinzufügen der Sonne zur Szene.
  scene.add(sun);
}

/**
 * Diese Funktion ist eine Schleife, welche für das Aktualisieren des Bildschirms zuständig ist.
 * In ihr wird der Renderer aufgerufen.
 */
function animate() {
  requestAnimationFrame(animate); // Diese Anweisung sorgt dafür, dass die Funktion wiederholt aufgerufen wird. Dabei wird auch eine bestimmte Zeit gewartet um der Wiederholfrequenz des Bildschirms gerecht zu werden.

  // Mit dieser Anweisung bildet der Renderer die Szene auf der Leinwand ab.
  renderer.render(scene, camera);
}
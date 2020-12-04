import './index.html';
import './style.css';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { bodies, mercury, pluto, saturn, sun } from './ts/Bodies';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cssRenderer: CSS2DRenderer;
let canvas: HTMLCanvasElement;

scene = new THREE.Scene;

camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
canvas = renderer.domElement;
document.body.appendChild(canvas);

cssRenderer = new CSS2DRenderer;
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0px';
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssRenderer.domElement);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

bodies.forEach(body => {
    body.init();
    body.addToScene(scene);
});

camera.position.set(0, 5000, 5000);
camera.lookAt(pluto.mesh.position);

let lastAnimate: number = undefined;
requestAnimationFrame(animate);

function animate(now: number) {
    if (now === undefined) throw new Error("now is undefined."); // this can be removed in the final form. trust me :)

    requestAnimationFrame(animate);
    if (lastAnimate === undefined) {
        lastAnimate = now;
        return;
    }


    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}

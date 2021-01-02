import './index.html';
import './style.css';
import '../resource/favicon.png';
import '../resource/images/universe.jpg';

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { bodies, sun } from './ts/Bodies';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitBody } from './ts/OrbitBody';
import { advanceTime } from './ts/Physics';

const logicTicksPerSecond = 20;

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
    100000000
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

let controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableKeys = true;
controls.maxDistance = 10000000;

let ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

bodies.forEach(body => {
    body.init();
    body.addToScene(scene);
});

camera.position.set(80000, 160000, 320000);
camera.lookAt(sun.mesh.position);

new THREE.TextureLoader().load('resource/images/universe.jpg', texture => {
    const rt = new THREE.WebGLCubeRenderTarget(512);
    scene.background = rt.fromEquirectangularTexture(renderer, texture);
});

let lastAnimate: number = undefined;
tickLogic();
requestAnimationFrame(animate);

function animate(now: number) {
    requestAnimationFrame(animate);

    if (lastAnimate === undefined) {
        lastAnimate = now;
        return;
    }

    lastAnimate = now;

    // const dt = (now - lastAnimate) / 1000;

    controls.update();

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);

    bodies.forEach(body => body.animation.tick());
}

async function tickLogic() {
    const dt = 1 / logicTicksPerSecond; // Sekunden

    advanceTime(dt, 50);

    bodies.forEach(body => {
        if (body instanceof OrbitBody) body.feedOrbitPosition(body.mesh.position);
    });

    setTimeout(tickLogic, dt * 1000);
}

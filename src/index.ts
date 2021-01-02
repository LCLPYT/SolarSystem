import './index.html';
import './style.css';
import '../resource/favicon.png';
import '../resource/images/universe.jpg';

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { bodies, setDwarfPlanetsVisible, setMoonsVisible, sun } from './ts/Bodies';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitBody } from './ts/OrbitBody';
import { advanceTime, updateTimestamp, timeMultiplier, setTimeMultiplier, precision, setPrecision } from './ts/Physics';

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
    const rt = new THREE.WebGLCubeRenderTarget(2048);
    scene.background = rt.fromEquirectangularTexture(renderer, texture);
});

updateTimestamp();

let lastAnimate: number = undefined;
let paused = false;

function animate(now: number) {
    if (paused) return;

    requestAnimationFrame(animate);

    if (lastAnimate === undefined) {
        lastAnimate = now;
        return;
    }

    lastAnimate = now;

    controls.update();

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);

    bodies.forEach(body => body.animation.tick());
}

async function tickLogic() {
    if (paused) return;

    const dt = 1 / logicTicksPerSecond; // Sekunden

    advanceTime(dt);

    bodies.forEach(body => {
        if (body instanceof OrbitBody) body.feedOrbitPosition(body.mesh.position);
    });

    setTimeout(tickLogic, dt * 1000);
}

window.onblur = () => {
    paused = true;
    lastAnimate = undefined;
};

window.onfocus = () => {
    paused = false;
    tickLogic();
    requestAnimationFrame(animate); 
};

window.onresize = () => {
    // https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
};

let dwarfCheckbox = <HTMLInputElement> document.getElementById("dwarf");
dwarfCheckbox.onchange = () => setDwarfPlanetsVisible(dwarfCheckbox.checked);

let moonsCheckbox = <HTMLInputElement> document.getElementById("moons");
moonsCheckbox.onchange = () => setMoonsVisible(moonsCheckbox.checked);

let speedControl = <HTMLInputElement> document.getElementById("speed");
speedControl.value = timeMultiplier.toString();
speedControl.onchange = () => setTimeMultiplier(Number(speedControl.value));

let precisionControl = <HTMLInputElement> document.getElementById("precision");
precisionControl.value = precision.toString();
precisionControl.onchange = () => setPrecision(Number(precisionControl.value));

tickLogic();
requestAnimationFrame(animate);

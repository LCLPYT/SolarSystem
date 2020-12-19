import './index.html';
import './style.css';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { bodies, earth, sun } from './ts/Bodies';
import { BufferAttribute, BufferGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitBody, ORBIT_MAX_VERTICES } from './ts/OrbitBody';
import { advanceTime } from './ts/Physics';

const logicTicksPerSecond = 30;

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
    10000000
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

let ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

bodies.forEach(body => {
    body.init();
    body.addToScene(scene);
});

/*let focus = sun;
let vec = sun.mesh.position.sub(focus.mesh.position).normalize().multiplyScalar(focus.radius * -2000 * scale);
vec = vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), 1.5);
if(focus === sun) vec = new Vector3(sun.radius * 2000 * scale, 0, 0);
camera.position.subVectors(focus.mesh.position, vec);
camera.lookAt(focus.mesh.position);*/

camera.position.set(1000000, 1000000, 1000000);
camera.lookAt(sun.mesh.position);

let lastAnimate: number = undefined;
tickLogic();
requestAnimationFrame(animate);

function animate(now: number) {
    if (now === undefined) throw new Error("now is undefined."); // this can be removed in the final form. trust me :)

    requestAnimationFrame(animate);
    if (lastAnimate === undefined) {
        lastAnimate = now;
        return;
    }

    const dt = (now - lastAnimate) / 1000;
    lastAnimate = now;

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}

async function tickLogic() {
    const dt = 1 / logicTicksPerSecond; // Sekunden

    advanceTime(dt * 600000, 10);

    bodies.forEach(body => {
        if (body instanceof OrbitBody) body.feedOrbitPosition(body.mesh.position);
    });

    setTimeout(tickLogic, dt * 1000);
}

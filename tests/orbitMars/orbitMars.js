import { canvas, ctx } from "../utils/constants.js";
import { accel } from "../utils/utils.js";

import '../utils/controls.js';
import { mars, sun } from "../utils/planets.js";

let lastRender = undefined;
let paused = false;

function render(timestamp) {
    if(paused) return;

    requestAnimationFrame(render);

    if(lastRender === undefined) {
        lastRender = timestamp;
        return;
    }
    const dt = timestamp - lastRender; // Zeitdifferenz zwischen diesem und dem letzten Aufruf von 'render()'
    lastRender = timestamp;

    canvas.width  = window.innerWidth - 50;
    canvas.height = window.innerHeight - 50;

    ctx.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    sun.draw();

    let acceleration = accel(sun, mars); // m/s^2
    let scaledDt = dt * 6000; // 1 s Echtzeit = 6000 s Simulationszeit
    // v = a * t
    // v [m/s] = a [m/s^2] * dt [s]
    let vel = acceleration.multScalar(scaledDt);

    mars.vel = mars.vel.add(vel);

    // r = r + v * t
    mars.pos = mars.pos.add(mars.vel.multScalar(scaledDt));    
    mars.draw();
}

window.onblur = () => {
    paused = true;
    lastRender = undefined;
};

window.onfocus = () => {
    paused = false;
    requestAnimationFrame(render);    
};

requestAnimationFrame(render);

/*
- https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
- https://en.wikipedia.org/wiki/Gravitational_acceleration
 */
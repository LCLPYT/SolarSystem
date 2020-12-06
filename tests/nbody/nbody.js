import { canvas, ctx, secondMultiplier } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";
import { accel } from "../utils/utils.js";

import '../utils/controls.js';

let lastRender = undefined;
let paused = false;

/**
 * @param {number} timestamp Momentane Zeit in ms.
 */
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

    PLANETS.list.forEach(p1 => {
        PLANETS.list.forEach(p2 => {
            if(p1 === p2) return;

            let acceleration = accel(p1, p2);

            // v = a * t
            // v [AE/d] = a [m/s^2] / 149597870700 * dt [s] * 86400
            let vel = acceleration.divScalar(149597870700).multScalar(dt * secondMultiplier).multScalar(86400);
    
            p1.vel = p1.vel.add(vel);
            p1.pos = p1.pos.add(p1.vel.multScalar(dt * secondMultiplier / 86400));
            
            planet.draw();
        });
    });
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
import { canvas, ctx, secondMultiplier } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";
import { accel } from "../utils/utils.js";

import '../utils/controls.js';
import { Vector } from "../utils/vector.js";

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

    PLANETS.list.forEach(attracted => {
        let totalAttractionAcceleration = new Vector(0, 0, 0);

        PLANETS.list.forEach(attractor => {
            if(attracted === attractor) return;

            let acceleration = accel(attractor, attracted);

            totalAttractionAcceleration = totalAttractionAcceleration.add(acceleration);
        });

        // v = a * t
        // v [AE/d] = a [m/s^2] / 149597870700 * dt [s] * 86400
        let vel = totalAttractionAcceleration.divScalar(149597870700).multScalar(dt * secondMultiplier).multScalar(86400);
        attracted.vel = attracted.vel.add(vel);
    });

    PLANETS.list.forEach(planet => {
        // s = s0 + v * t
        planet.pos = planet.pos.add(planet.vel.multScalar(dt * secondMultiplier / 86400));
        planet.draw();
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
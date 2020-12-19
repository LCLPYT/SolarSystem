import { canvas, ctx, secondMultiplier } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";
import { accel } from "../utils/utils.js";

import '../utils/controls.js';

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

    PLANETS.list.forEach(planet => {
        if(planet === PLANETS.sun) {
            planet.draw();
            return;
        }

        let acceleration = accel(PLANETS.sun, planet);

        // v = a * t
        // v [m/s] = a [m/s^2] * dt [s]
        let vel = acceleration.multScalar(dt * secondMultiplier);

        planet.vel = planet.vel.add(vel);
        planet.pos = planet.pos.add(planet.vel.multScalar(dt * secondMultiplier));
        
        planet.draw()
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
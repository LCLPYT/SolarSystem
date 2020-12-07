import { canvas, ctx, secondMultiplier } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";
import { accel } from "../utils/utils.js";

import '../utils/controls.js';
import { Vector } from "../utils/vector.js";

const dt = 1;
for(let t = 0; t < 365 * 24 * 60 * 60; t++) {
    if(t % (60*60*24) === 0) console.log(t / (365 * 24 * 60 * 60));

    PLANETS.list.forEach(attracted => {
        let totalAttractionAcceleration = new Vector(0, 0, 0);

        PLANETS.list.forEach(attractor => {
            if(attracted === attractor) return;

            let acceleration = accel(attractor, attracted);

            totalAttractionAcceleration = totalAttractionAcceleration.add(acceleration);
        });

        // v = a * t
        // v [AE/d] = a [m/s^2] / 149597870700 * dt [s] * 86400
        let vel = totalAttractionAcceleration.divScalar(149597870700).multScalar(dt).multScalar(86400);
        attracted.vel = attracted.vel.add(vel);
    });

    PLANETS.list.forEach(planet => {
        // s = s0 + v * t
        planet.pos = planet.pos.add(planet.vel.multScalar(dt / 86400));
    });
}
let after = PLANETS.earth.pos;
let real = new Vector(9.389956708783105E-01, -3.700412702037588E-01, 1.321273146769900E-05);
console.log("calculated position: ", after);
console.log("jpl horizons calulated position: ", real);

let distance = real.sub(after).length();
console.log("Distance: " + distance + " AU (" + (distance * 149597870700) + " m)");

/*
- https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
- https://en.wikipedia.org/wiki/Gravitational_acceleration
*/
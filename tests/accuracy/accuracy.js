import { setAuPerPixel } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";
import { accel } from "../utils/utils.js";

import { Vector } from "../utils/vector.js";

const EARTH_REAL_2021_09_01 = new Vector(9.389956708783105E-01, -3.700412702037588E-01, 1.321273146769900E-05).multScalar(149597870700);

console.log(EARTH_REAL_2021_09_01);

test(365 * 24 * 60 * 60, 60, true);
test(365.2422 * 24 * 60 * 60, 60, false);

function test(duration, dt, print = false) {
    let canvas = null;
    let ctx = null;
    
    const attracted = PLANETS.earth;
    const startPos = attracted.pos;
    const startVel = attracted.vel;

    if(print) {
        let title = document.createElement("h2");
        title.appendChild(document.createTextNode(`${attracted.name}'s orbit arround the sun (${duration} s)`));

        canvas = document.createElement("canvas");
        canvas.height = canvas.width = 800;
        ctx = canvas.getContext("2d");

        document.body.appendChild(title);
        document.body.appendChild(canvas);

        setAuPerPixel(1 / 200);

        PLANETS.sun.draw(ctx, canvas);
    }

    let t;
    
    console.log(`Simulating ${attracted.name}'s orbit arround the sun for ${duration} seconds...`);
    
    for (t = 0; t < duration; t += dt) {
        // a(t) = -G * M * r(t) * 1 / mag(r(t))^3
        let acceleration = accel(PLANETS.sun, attracted);
        
        // t=0: v(dt / 2)    = v(0) + a(t) * dt / 2
        // else: v(t + dt / 2) = v(t - dt / 2) + a(t) * dt
        if(t === 0) attracted.vel = attracted.vel.add(acceleration.multScalar(dt / 2));
        else attracted.vel = attracted.vel.add(acceleration.multScalar(dt));
    
        // r(t + dt) = r(t) + v(t + dt / 2) * dt
        attracted.pos = attracted.pos.add(attracted.vel.multScalar(dt));

        if(print) attracted.draw(ctx, canvas);
    }

    console.log(attracted.pos);
    console.log(`Done. Simulation time now: ${t}`);
    console.log(`Distance to real position: ${EARTH_REAL_2021_09_01.sub(attracted.pos).length()} m`);
    console.log(`Distance to start position: ${startPos.sub(attracted.pos).length()} m`);

    console.log("");

    attracted.pos = startPos;
    attracted.vel = startVel;
}

/*
- https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
- https://en.wikipedia.org/wiki/Gravitational_acceleration
- https://www.leifiphysik.de/mechanik/gravitationsgesetz-und-feld/ausblick/numerische-behandlung-von-satellitenbahnen
- http://www.stargazing.net/kepler/ellipse.html
- 
*/
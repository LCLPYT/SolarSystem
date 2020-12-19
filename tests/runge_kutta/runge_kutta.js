import { grav, setAuPerPixel } from "../utils/constants.js";
import * as PLANETS from "../utils/planets.js";

import { Vector, zero } from "../utils/vector.js";

const EARTH_REAL_2020_09_02 = new Vector(9.463388784741484E-01, -3.498898353423753E-01, 1.629540552346900E-05).multScalar(149597870700);
const EARTH_REAL_2021_09_01 = new Vector(9.389956708783105E-01, -3.700412702037588E-01, 1.321273146769900E-05).multScalar(149597870700);

test(365 * 24 * 60 * 60, 60, true, EARTH_REAL_2021_09_01);
/*test(0.5 * 365 * 24 * 60 * 60, 60, true);
test(365.2422 * 24 * 60 * 60, 60, false);*/

function test(duration, dt, print = false, real_pos) {
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

        setAuPerPixel(1 / 100);

        PLANETS.sun.draw(ctx, canvas);
    }

    let t;
    
    console.log(`Simulating ${attracted.name}'s orbit arround the sun for ${duration} seconds...`);
    
    let lastProgress = 0;
    const iterations = 4;
    for (t = 0; t < duration; t += dt) {
        for (let k = 0; k < iterations; k++) {
            rk4(dt / iterations);
        }
        let progress = t / duration * 100;
        if(progress.toFixed(0) !== lastProgress) {
            lastProgress = progress.toFixed(0);
            console.log(lastProgress + " %");
        }
        if(print) {
            PLANETS.earth.draw(ctx, canvas);
            PLANETS.mercury.draw(ctx, canvas);
            PLANETS.venus.draw(ctx, canvas);
        }
    }

    console.log(attracted.pos);
    console.log(`Done. Simulation time now: ${t}`);
    console.log(`Distance to real position: ${real_pos.sub(attracted.pos).length()} m`);
    console.log(`Distance to start position: ${startPos.sub(attracted.pos).length()} m`);

    console.log("");

    attracted.pos = startPos;
    attracted.vel = startVel;
}

function accels() {
    PLANETS.list.forEach(planet => planet.force = zero);
    for (let i = 0; i < PLANETS.list.length; i++) {
        for (let j = i + 1; j < PLANETS.list.length; j++) {
            let a = PLANETS.list[i], b = PLANETS.list[j];
            let direction = b.pos.sub(a.pos);
            let disSq = direction.lengthSquared();
            let f = grav * a.mass * b.mass / disSq;
            a.force = a.force.add(direction.normalize().multScalar(f));
            b.force = b.force.sub(a.force);
        }
    }
    PLANETS.list.forEach(planet => planet.accel = planet.force.divScalar(planet.mass));
}

function accelsAtPos(pos) {
    PLANETS.list.forEach(planet => planet.force = zero);
    for (let i = 0; i < PLANETS.list.length; i++) {
        for (let j = i + 1; j < PLANETS.list.length; j++) {
            let a = PLANETS.list[i], b = PLANETS.list[j];
            let direction = pos[j].sub(pos[i]);
            let disSq = direction.lengthSquared();
            let f = grav * a.mass * b.mass / disSq;
            a.force = a.force.add(direction.normalize().multScalar(f));
            b.force = b.force.sub(a.force);
        }
    }
    PLANETS.list.forEach(planet => planet.accel = planet.force.divScalar(planet.mass));
}

function rk4(dt) {
    let k0 = [], k1 = [], k2 = [], k3 = [];
    let l0 = [], l1 = [], l2 = [], l3 = [];
    let temppos = [];
    accels();
    PLANETS.list.forEach((planet, i) => {
        k0[i] = planet.vel.multScalar(dt);
        l0[i] = planet.accel.multScalar(dt);
        k1[i] = planet.vel.add(l0[i].multScalar(0.5)).multScalar(dt);
        temppos[i] = planet.pos.add(k0[i].multScalar(0.5));
    });
    accelsAtPos(temppos);
    PLANETS.list.forEach((planet, i) => {
        l1[i] = planet.accel.multScalar(dt);
        k2[i] = planet.vel.add(l1[i].multScalar(0.5)).multScalar(dt);
        temppos[i] = planet.pos.add(k1[i].multScalar(0.5));
    });
    accelsAtPos(temppos);
    PLANETS.list.forEach((planet, i) => {
        l2[i] = planet.accel.multScalar(dt);
        k3[i] = planet.vel.add(l2[i]).multScalar(0.5);
        temppos[i] = planet.pos.add(k2[i]);
    });
    accelsAtPos(temppos);
    PLANETS.list.forEach((planet, i) => {
        l3[i] = planet.accel.multScalar(dt);
        planet.pos = planet.pos.add(k0[i].add(k1[i].multScalar(2)).add(k2[i].multScalar(2)).add(k3[i]).divScalar(6));
        planet.vel = planet.vel.add(l0[i].add(l1[i].multScalar(2)).add(l2[i].multScalar(2)).add(l3[i]).divScalar(6));
    });
}

/*
- https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
- https://en.wikipedia.org/wiki/Gravitational_acceleration
- https://www.leifiphysik.de/mechanik/gravitationsgesetz-und-feld/ausblick/numerische-behandlung-von-satellitenbahnen
- http://www.stargazing.net/kepler/ellipse.html
- 
*/
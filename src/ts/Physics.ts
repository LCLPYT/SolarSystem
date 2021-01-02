import { bodies } from "./Bodies";
import { G } from "./Constants";
import { ZERO as NONE } from "./Vector";

let now = new Date(2020, 8, 1, 0, 0, 0);
let timeMultiplier = 600000;

export function advanceTime(elapsed: number, precision: number) {
    let dt = elapsed * timeMultiplier / precision;
    for (let k = 0; k < precision; k++) {
        bodies.forEach(body => body.force = NONE);
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                let bodyA = bodies[i], bodyB = bodies[j];
                let direction = bodyB.position.sub(bodyA.position);
                let distanceSquared = direction.lengthSquared();
                let forceScalar = G * bodyA.mass * bodyB.mass / distanceSquared;
                bodyA.force = bodyA.force.add(direction.normalize().multScalar(forceScalar));
                bodyB.force = bodyB.force.sub(bodyA.force); // Newtons drittes Gesetz: F_1 = -F_2
            }
        }
        bodies.forEach(body => {
            body.acceleration = body.force.divScalar(body.mass);
            body.velocity = body.velocity.add(body.acceleration.multScalar(dt));
            body.setPositionSmooth(body.position.add(body.velocity.multScalar(dt)), elapsed * 1000);
        });
    }
    now.setTime(now.getTime() + elapsed * timeMultiplier * 1000);
    updateTimestamp();
}

export function updateTimestamp() {
    let span = document.getElementById("timestamp");
    span.innerHTML = now.toString();
}
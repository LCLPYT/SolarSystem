import { bodies } from "./Bodies";
import { G } from "./Constants";
import { ZERO } from "./Vector";

export function advanceTime(dt: number, precision: number) {
    dt /= precision;
    for (let k = 0; k < precision; k++) {
        bodies.forEach(body => body.force = ZERO);
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                let bodyA = bodies[i], bodyB = bodies[j];
                let direction = bodyB.position.sub(bodyA.position);
                let distanceSquared = direction.lengthSquared();
                let forceScalar = G * bodyA.mass * bodyB.mass / distanceSquared;
                bodyA.force = bodyA.force.add(direction.normalize().multScalar(forceScalar));
                bodyB.force = bodyB.force.sub(bodyA.force); // Newtons drittes Gesetz: F1 = -F2
            }
        }
        bodies.forEach(body => {
            body.acceleration = body.force.divScalar(body.mass);
            body.velocity = body.velocity.add(body.acceleration.multScalar(dt));
            body.setPosition(body.position.add(body.velocity.multScalar(dt)));
        });
    }
}
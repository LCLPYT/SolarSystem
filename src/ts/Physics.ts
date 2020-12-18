import { Vector } from "./Vector";
import { Body } from "./Body";
import { sun } from "./Bodies";

let time = 0;

/**
 * Berechnet die Beschleunigung, die ein Körper durch einen anderen Körper erfährt.
 * 
 * @param body1 Der Anziehende Körper.
 * @param body2 Der Angezogende Körper.
 * @returns Die Beschleunigung, die der angezogene Körper durch den anziehenden Körper erfährt. In m*s^-2
 */
export function calculateAcceleration(body1: Body, body2: Body): Vector {
    let direction = body2.position.sub(body1.position); // Verschiebungsvektor zwischen body1 und body2; in m
    let distanceSquared = direction.lengthSquared(); // Distanz zum Quadrat in m^2

    let acceleration = -body1.g_times_m / distanceSquared; // Beschleunigung in m*s^-2
    return direction.normalize().multScalar(acceleration); // Normierter Verschiebungsvektor zum Beschleunigungsvektor machen
}

export function applyTime(body: Body) {
    // a(t) = -G * M * r(t) * 1 / mag(r(t))^3
    let acceleration = calculateAcceleration(sun, body);

    // t=0: v(dt / 2) = v(0) + a(t) * dt / 2
    // else: v(t + dt / 2) = v(t - dt / 2) + a(t) * dt
    if(t === 0) attracted.vel = attracted.vel.add(acceleration.multScalar(dt / 2));
    else attracted.vel = attracted.vel.add(acceleration.multScalar(dt));

}
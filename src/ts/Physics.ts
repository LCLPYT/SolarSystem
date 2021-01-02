/*
Dieses Modul ist für die physikalischen Dinge verantwortlich.
*/

import { bodies } from "./Bodies";
import { G } from "./Constants";
import { ZERO as NONE } from "./Vector";

// Variablen
/** Der momentane Zeitpunkt der Simulation */
let now = new Date(2020, 8, 1, 0, 0, 0);
/** Der Beschleunigungsfaktor. */
export let timeMultiplier = 600000;
/** Der Präzisionswert. Wenn dieser Wert gleich n ist, wird bei der Positionsberechnung n mal mit dt/n gerechnet. */
export let precision = 50;

/**
 * Bringt die Simulationszeit vorran, wobei die Bewegungen der Himmelskörper ausgerechnet werden.
 * @param elapsed Die vergangende Zeit seit dem letzten Aufruf.
 */
export function advanceTime(elapsed: number) {
    // Die vergangende Zeit mit dem Beschleunigungsfaktor multiplizieren und durch den Präzisionswert teilen.
    let dt = elapsed * timeMultiplier / precision;

    // Die folgende Berechnung so oft ausführen, wie es der Präzisionswert besagt.
    for (let k = 0; k < precision; k++) {
        // Zuerst die Kraft, die auf die Körper wirkt, zurücksetzen.
        bodies.forEach(body => body.force = NONE);

        // Die Kraft als Summe der Gravitationskräfte aller anderen Körper ausrechnen.
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                let bodyA = bodies[i], bodyB = bodies[j];
                // Verschiebungsvektor
                let direction = bodyB.position.sub(bodyA.position);
                // Distanz zwischen den Körpern, zum Quadrat, damit nicht zuerst die zeitintensive Quadratwurzel-Funktion aufgerufen werden muss.
                let distanceSquared = direction.lengthSquared();
                // Kraft nach dem Gravitationsgesetz ausrechnen
                let forceScalar = G * bodyA.mass * bodyB.mass / distanceSquared;
                // Kraft als Vektor summieren
                bodyA.force = bodyA.force.add(direction.normalize().multScalar(forceScalar));
                bodyB.force = bodyB.force.sub(bodyA.force); // Newtons drittes Gesetz: F_1 = -F_2; dadurch müssen weniger Berechnungen stattfinden
            }
        }

        // Beschleunigung, Geschwindigkeit und neue Position ausrechnen.
        bodies.forEach(body => {
            body.acceleration = body.force.divScalar(body.mass);
            body.velocity = body.velocity.add(body.acceleration.multScalar(dt));
            // Neue Position als Interpolationszielwert setzen; Die Interpolation finden bis zum nächsten Aufruf dieser Funktion (elapsed) statt.
            body.setPositionSmooth(body.position.add(body.velocity.multScalar(dt)), elapsed * 1000);
        });
    }

    // Zeit vorranschreiten lassen und Text in der Benutzeroberfläche ändern
    now.setTime(now.getTime() + elapsed * timeMultiplier * 1000);
    updateTimestamp();
}

/**
 * Ändert den Text der Zeit in der Benutzeroberfläche.
 */
export function updateTimestamp() {
    let span = document.getElementById("timestamp");
    span.innerHTML = now.toString();
}

/**
 * Verändert die Geschwindigkeit der Simulation.
 * @param factor Der neue Beschleunigungsfaktor
 */
export function setTimeMultiplier(factor: number) {
    timeMultiplier = factor;
}

/**
 * Verändert die Genauigkeit der Berechnungen.
 * @param times Der neue Genauigkeitswert.
 */
export function setPrecision(times: number) {
    precision = times;
}
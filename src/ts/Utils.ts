import { Vector } from "./Vector";
import { Body } from "./Body";
import { AU_FACTOR, GRAV } from "./Constants";

export function au_to_m(au: number): number {
    return au * AU_FACTOR;
}

export function m_to_au(m: number): number {
    return m / AU_FACTOR;
}

/**
 * Berechnet die Beschleunigung, die ein Körper durch einen anderen Körper erfährt.
 * 
 * @param body1 Der Anziehende Körper.
 * @param body2 Der Angezogende Körper.
 * @returns Die Beschleunigung, die der angezogene Körper durch den anziehenden Körper erfährt.
 */
export function calculateAcceleration(body1: Body, body2: Body): Vector {
    let direction = body2.position.sub(body1.position); // Verschiebungsvektor zwischen body1 und body2; in AE
    direction = direction.multScalar(AU_FACTOR); // AE zu m

    let distance = direction.length(); // Distanz in m

    let acceleration = -GRAV * body1.mass / (distance * distance); // Beschleunigung in m*s^-2
    return direction.normalize().multScalar(acceleration); // Normierter Verschiebungsvektor zum Beschleunigungsvektor machen
}
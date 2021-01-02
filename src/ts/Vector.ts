/**
 * In diesem Modul wird die Vector-Klasse definiert.
 */

import { Vector3 } from "three";
import { scale } from "./Constants";

/**
 * Ein Vektor, wie man ihn aus dem Matheunterricht kennt.
 */
export class Vector {

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Rechnet die Länge des Vektors aus.
     */
    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Rechnet das Quadrat der Länge des Vektors aus.
     * Diese Funktion ist schneller als die length()-Funktion.
     * Wenn man also nicht unbedingt die richtige Länge benötigt, solle man mit der quadrierten weiter rechnen.
     */
    lengthSquared(): number {
        return this.dot(this);
    }

    /**
     * Multipliziert den Vektor mit einem Skalar.
     * @param s Der Skalar
     */
    multScalar(s: number): Vector {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    /**
     * Dividiert den Vektor mit einem Skalar.
     * @param s Der Skalar
     */
    divScalar(s: number): Vector {
        return this.multScalar(1 / s);
    }

    /**
     * Addition des Vektors.
     * @param vec Der andere Summand.
     */
    add(vec: Vector): Vector {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    /**
     * Subtraktion des Vektors.
     * @param vec Der Subtrahend.
     */
    sub(vec: Vector): Vector {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    /**
     * Rechnet das Skalarprodukt des Vektors mit einem anderen aus.
     * @param vec Der andere Vektor.
     */
    dot(vec: Vector): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    /**
     * Normiert den Vektor.
     */
    normalize(): Vector {
        return this.divScalar(this.length());
    }

    /**
     * Wandelt den Vektor in einen three.js Vektor um.
     */
    toThreeJs(): Vector3 {
        return new Vector3(this.x * scale, this.z * scale, this.y * scale); // die y- und z- Koordinaten sind bewusst vertauscht.
    }

}

/** Der Nullvektor */
export const ZERO = new Vector(0, 0, 0);
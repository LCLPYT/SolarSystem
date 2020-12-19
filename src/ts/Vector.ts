import { Vector3 } from "three";
import { scale } from "./Values";

export class Vector {

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    lengthSquared(): number {
        return this.dot(this);
    }

    multScalar(s: number): Vector {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    divScalar(s: number): Vector {
        return this.multScalar(1 / s);
    }

    add(vec: Vector): Vector {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    sub(vec: Vector): Vector {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    dot(vec: Vector): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    cross(vec: Vector): Vector {
        return new Vector(
            this.y * vec.z - this.z * vec.y, 
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
            );
    }

    normalize(): Vector {
        return this.divScalar(this.length());
    }

    toThreeJs(): Vector3 {
        return new Vector3(this.x * scale, this.z * scale, this.y * scale);
    }

}

export const ZERO = new Vector(0, 0, 0);
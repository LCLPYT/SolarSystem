export class Vector {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    multScalar(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    divScalar(s) {
        return this.multScalar(1 / s);
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    cross(vec) {
        return new Vector(
            this.y * vec.z - this.z * vec.y, 
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
            );
    }

    normalize() {
        return this.divScalar(this.length());
    }

}
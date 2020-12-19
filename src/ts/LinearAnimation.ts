import { Object3D, Vector3 } from "three";
import { lerp } from "./MathHelper";

export class LinearAnimation {

    protected object: Object3D;
    protected startPosition: Vector3;
    protected targetPosition: Vector3;
    protected startTimestamp: number;
    protected duration: number;

    constructor(object: Object3D) {
        this.object = object;
    }

    make(targetPosition: Vector3, duration: number) {
        this.startPosition = this.object.position.clone();
        this.targetPosition = targetPosition;
        this.startTimestamp = Date.now();
        this.duration = duration;
    }

    stop() {
        this.startPosition = undefined;
        this.targetPosition = undefined;
        this.startTimestamp = undefined;
        this.duration = undefined;
    }

    isAnimated(): boolean {
        return this.startPosition !== undefined;
    }

    tick() {
        if(!this.isAnimated()) return;

        let progress = (Date.now() - this.startTimestamp) / this.duration;
        if(progress >= 1) {
            this.object.position.copy(this.targetPosition);
            stop();
            return;
        }

        let pos = new Vector3(
            lerp(this.startPosition.x, this.targetPosition.x, progress),
            lerp(this.startPosition.y, this.targetPosition.y, progress),
            lerp(this.startPosition.z, this.targetPosition.z, progress)
        );

        this.object.position.copy(pos);
    }

}
/*
Dieses Modul definiert die LinearInterpolation-Klasse, mit welcher die Planetenpositionen zwischen den Berechnungen interpoliert werden.
Dadurch sehen die Bewegungen weicher aus.
*/

import { Object3D, Vector3 } from "three";
import { clamp, lerp } from "./MathHelper";

/**
 * Beinhaltet Daten zur linearen Interpolation eines Mesh-Objektes.
 */
export class LinearInterpolation {

    /** Das Mesh-Objekt, welches Interpoliert werden soll */
    protected object: Object3D;
    /** Die Anfangsposition */
    protected startPosition: Vector3;
    /** Die Zielposition */
    protected targetPosition: Vector3;
    /** Der Zeitpunkt, andem die momentane Interpolation gestartet wurde */
    protected startTimestamp: number;
    /** Die Zeit, in der das Mesh-Objekt die Zielposition erreichen soll. In ms */
    protected duration: number;

    /**
     * Konstruktor.
     * @param object Das zu interpolierende Mesh-Objekt.
     */
    constructor(object: Object3D) {
        this.object = object;
    }

    /**
     * Fängt eine neue Interpolation an.
     * @param targetPosition Die Zielposition.
     * @param duration Die Zeit in der die Zielposition erreicht werden soll. In ms
     */
    make(targetPosition: Vector3, duration: number) {
        this.startPosition = this.object.position.clone();
        this.targetPosition = targetPosition;
        this.startTimestamp = Date.now();
        this.duration = duration;
    }

    /**
     * Stoppt die momentane Interpolation.
     */
    stop() {
        this.startPosition = undefined;
        this.targetPosition = undefined;
        this.startTimestamp = undefined;
        this.duration = undefined;
    }

    /**
     * Ob das Mesh-Objekt im Moment interpoliert wird.
     */
    isAnimated(): boolean {
        return this.startPosition !== undefined;
    }

    /**
     * Diese Funktion wird aus der render()-Schleife herraus aufgerufen, wodurch die Interpolation stattfinden kann.
     */
    tick() {
        if(!this.isAnimated()) return;

        // Fortschritt ermitteln.
        let progress = (Date.now() - this.startTimestamp) / this.duration;
        // Wenn der Fortschritt >= 100% ist, dann wird die Interpolation gestoppt.
        if(progress >= 1) {
            this.object.position.copy(this.targetPosition);
            stop();
            return;
        }
        // Fortschritt zwischen 0 und 1 beschränken.
        progress = clamp(progress, 0, 1);

        // koordinatenweise aufgrund des Fortschritts interpolieren.
        let pos = new Vector3(
            lerp(this.startPosition.x, this.targetPosition.x, progress),
            lerp(this.startPosition.y, this.targetPosition.y, progress),
            lerp(this.startPosition.z, this.targetPosition.z, progress)
        );

        // Mesh zur interpolierten Position bewegen.
        this.object.position.copy(pos);
    }

}
/*
Dieses Modul definiert die Body-Klasse, welche die Repräsentation eines Himmelskörpers ist.
*/

import { Material, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { AU_IN_M, DAY_IN_SECONDS, G } from "./Constants";
import { LinearInterpolation } from "./LinearInterpolation";
import { scale } from "./Constants";
import { Vector } from "./Vector";

/**
 * Representation eines Himmelskörpers. Geht von einer Kugel mit einem bestimmten Radius aus.
 */
export class Body {

    /** Der Name des Himmelskörpers */
    readonly name: string;
    /** Die Farbe des Himmelskörpers. */
    readonly color: number;
    /** Die Masse des Körpers. In kg */
    readonly mass: number;
    /** Der Radius des Körpers. In m */
    readonly radius: number;
    /** Die Position des Körpers, relativ zur Sonne. In m */
    position: Vector;
    /** Die Geschwindigkeit des Körpers. In m/s */
    velocity: Vector;
    /** Die Gravitationskraft, die auf den Köroer wirkt. In N */
    force: Vector;
    /** Die Beschleunigung, mit der der Körper aufgrund der Gravitationskraft beschleunigt wird. In m/s^2 */
    acceleration: Vector;
    /** Die Daten für die Interpolation dieses Himmelskörpers */
    interpolation: LinearInterpolation;
    /** Das Mesh-Objekt dieses Himmelskörpers */
    mesh: Mesh<SphereGeometry, Material>;
    /** Das Namensschild dieses Himmelskörpers */
    label: CSS2DObject;

    /**
     * Konstruktor.
     * @param name Der Name.
     * @param color Die Farbe.
     * @param position Der Ortsvektor. In AE; wird automatisch umgewandelt.
     * @param velocity Der Geschwindigkeitsvektor. In AE/d; wird automatisch umgewandelt.
     * @param mass Die Masse in kg
     * @param radius Der Radius der idealisierten Kugel. In km; wird automatisch umgewandelt.
     */
    constructor(name: string, color: number, position: Vector, velocity: Vector, mass: number, radius: number) {
        this.name = name;
        this.color = color;
        this.position = position.multScalar(AU_IN_M);
        this.velocity = velocity.multScalar(AU_IN_M / DAY_IN_SECONDS);
        this.mass = mass;
        this.radius = radius * 1000;
    }

    /**
     * Wird aufgerufen, bevor der Himmelskörper zur Szene hinzugefügt wird.
     */
    init() {
        // Mesh und Namensschild initialisieren.
        this.initMesh();
        this.initLabel();
    }

    /**
     * Wird aufgerufen, wenn der Himmelskörper zur Szene hinzugefügt werden soll.
     * @param scene Die Szene, zu der hinzugefügt wird.
     */
    addToScene(scene: Scene) {
        scene.add(this.mesh);
    }

    /**
     * Helfermethode um das Material für das Mesh-Objekt zu erzeugen.
     * Kann somit leicht mit Vererbung überschrieben werden.
     */
    protected getMeshMaterial(): Material {
        return new MeshStandardMaterial({ color: this.color });
    }

    /**
     * Helfermethode um das Mesh-Objekt einer Kugel zu erzeugen.
     * Kann leicht mit Vererbung überschrieben werden.
     */
    protected initMesh() {
        // Geometrie erzeugen
        let geometry = new SphereGeometry(
            this.radius * scale,
            64, // Anzahl der horizontalen Segmente der Kugel; beeinflusst das Aussehen der Kugel.
            64 // Anzahl der vertikalen Segmente der Kugel; beeinflusst das Aussehen der Kugel.
        );
        // Mesh erzeugen
        this.mesh = new Mesh(geometry, this.getMeshMaterial());
        // Position des Mesh-Objektes aktualisieren
        this.updatePosition();
        // Interpolationsdaten für den Himmelskörper initialisieren.
        this.interpolation = new LinearInterpolation(this.mesh);
    }

    /**
     * Helfermethode um das Namensschild des Himmelskörpers zu erzeugen.
     * Kann leicht überschrieben werden.
     */
    protected initLabel() {
        // HTML "div"-Element mit Namen des Himmelskörpers erzeugen
        let div = document.createElement("div");
        div.classList.add("label");
        div.appendChild(document.createTextNode(this.name));
        // CSS2DObjekt von three.js erzeugen
        this.label = new CSS2DObject(div);
        this.label.position.set(0, this.radius * scale, 0); // Relative Position zum Himmelskörper setzen.
        this.mesh.add(this.label); // Als Kind des Mesh-Objektes hinzufügen, damit das Namensschild mitbewegt wird.
    }

    /**
     * Funktion, welche die Koordinaten des Mesh-Objektes an die Koordinaten des Himmelskörpers angleicht.
     */
    protected updatePosition() {
        this.mesh.position.copy(this.position.toThreeJs());
    }

    /**
     * Verändert die Position des Himmelskörpers.
     * @param position Die neue Position.
     */
    setPosition(position: Vector) {
        this.position = position;
        this.updatePosition();
        this.interpolation.stop();
    }

    /**
     * @param position Die neue Position.
     * @param dt Die Zeit, bis der Himmelskörper die gewünschte Position erreichen soll. In ms
     */
    setPositionSmooth(position: Vector, dt: number) {
        this.position = position;
        this.interpolation.make(position.toThreeJs(), dt); // Interpolationsdaten aktualisieren.
    }

}
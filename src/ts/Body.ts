import { Material, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { AU_IN_M, DAY_IN_SECONDS, G } from "./Constants";
import { LinearAnimation } from "./LinearAnimation";
import { scale } from "./Values";
import { Vector } from "./Vector";

/**
 * Representation eines Himmelskörpers. Geht von einer Kugel mit Radius r aus.
 */
export class Body {

    readonly name: string;
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
    mesh: Mesh;
    animation: LinearAnimation;
    label: CSS2DObject;

    constructor(name: string, color: number, position: Vector, velocity: Vector, mass: number, radius: number) {
        this.name = name;
        this.color = color;
        this.position = position.multScalar(AU_IN_M);
        this.velocity = velocity.multScalar(AU_IN_M / DAY_IN_SECONDS);
        this.mass = mass;
        this.radius = radius * 1000;
    }

    init() {
        this.initMesh();
        this.initLabel();
    }

    addToScene(scene: Scene) {
        scene.add(this.mesh);
    }

    protected getMeshMaterial(): Material {
        return new MeshStandardMaterial({
            color: this.color
        });
    }

    protected initMesh() {
        let geometry = new SphereGeometry(
            this.radius * scale,
            64, // Anzahl der horizontalen Segmente der Kugel
            64 // Anzahl der vertikalen Segmente der Kugel
        );
    
        this.mesh = new Mesh(geometry, this.getMeshMaterial());
        this.updatePosition();

        this.animation = new LinearAnimation(this.mesh);
    }

    protected initLabel() {
        let div = document.createElement("div");
        div.classList.add("label");
    
        let text = document.createTextNode(this.name);
        div.appendChild(text);
    
        this.label = new CSS2DObject(div);
        this.label.position.set(0, this.radius * scale, 0); // Relative Position zum Himmelskörper setzen.
        this.mesh.add(this.label);
    }

    protected updatePosition() {
        this.mesh.position.copy(this.position.toThreeJs());
    }

    setPosition(position: Vector) {
        this.position = position;
        this.updatePosition();
        this.animation.stop();
    }

    /**
     * @param position The new position.
     * @param dt The smooth animation duration. In ms.
     */
    setPositionSmooth(position: Vector, dt: number) {
        this.position = position;
        this.animation.make(position.toThreeJs(), dt);
    }

}
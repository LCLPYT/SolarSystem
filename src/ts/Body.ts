import { CircleGeometry, LineBasicMaterial, LineLoop, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { AU_IN_M, DAY_IN_SECONDS, G } from "./Constants";
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
    /** Die Masse des Körpers mal der Gravitationskonstante. In m^3*s^-2 */
    readonly g_times_m: number;
    /** Die Position des Körpers, relativ zur Sonne. In m */
    position: Vector;
    /** Die Geschwindigkeit des Körpers. In m/s */
    velocity: Vector;
    mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
    label: CSS2DObject;

    constructor(name: string, color: number, position: Vector, velocity: Vector, mass: number, radius: number) {
        this.name = name;
        this.color = color;
        this.position = position.multScalar(AU_IN_M);
        this.velocity = velocity.multScalar(AU_IN_M / DAY_IN_SECONDS);
        this.mass = mass;
        this.radius = radius * 1000;
        this.g_times_m = G * this.mass;
    }

    init() {
        this.initMesh();
        this.initLabel();
    }

    addToScene(scene: Scene) {
        scene.add(this.mesh);
    }

    protected initMesh() {
        let geometry = new SphereGeometry(
            this.radius * scale,
            64, // Anzahl der horizontalen Segmente der Kugel
            64 // Anzahl der vertikalen Segmente der Kugel
        );
    
        let material = new MeshStandardMaterial({
            color: this.color
        });
    
        this.mesh = new Mesh(geometry, material);
        this.updatePosition();
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
        let scaled = this.position.multScalar(scale);
        this.mesh.position.set(scaled.x, scaled.y, scaled.z);
    }

    setPosition(position: Vector) {
        this.position = position;
        this.updatePosition();
    }

}

/**
 * Erstellt einen Kreis, der die Umlaufbahn simuliert.
 * TODO realistische Daten anwenden! -> Eckpunkte aus Daten berechnen.
 */
export function getOrbitLineLoop(body: Body): LineLoop<CircleGeometry, LineBasicMaterial> {
    let circleGeometry = new CircleGeometry(
        body.position.length() * scale,
        128 // Anzahl der Kreissegmente
    );
    circleGeometry.vertices.shift(); // Den ersten Eckpunkt entfernen, da es keine Linie zum Zentrum geben soll.

    let circleMaterial = new LineBasicMaterial({
        color: body.color
    });

    let orbit = new LineLoop(circleGeometry, circleMaterial); // LineLoop, damit der Kreis geschlossen ist.
    orbit.rotation.x = Math.PI / 2;

    return orbit;
}
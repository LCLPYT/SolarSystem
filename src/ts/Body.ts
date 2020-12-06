import { CircleGeometry, LineBasicMaterial, LineLoop, Mesh, MeshStandardMaterial, Scene, SphereGeometry } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { AU_FACTOR } from "./Constants";
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
    /** Der Radius des Körpers. In km */
    readonly radius: number;
    /** Die Position des Körpers, relativ zur Sonne. In AE  */
    position: Vector;
    /** Die Geschwindigkeit des Körpers. In AE/d */
    velocity: Vector;
    mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
    label: CSS2DObject;

    constructor(name: string, color: number, position: Vector, velocity: Vector, mass: number, radius: number) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
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
            this.radius * 1E+3 * scale,
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
        let scaled = this.position.multScalar(AU_FACTOR).multScalar(scale);
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
import { BufferAttribute, BufferGeometry, Geometry, Line, LineBasicMaterial, LineLoop, Scene } from "three";
import { sun } from "./Bodies";
import { Body } from "./Body";
import { Vector } from "./Vector";

export const ORBIT_MAX_VERTICES = 500;

export class OrbitBody extends Body {

    orbit: Line<BufferGeometry, LineBasicMaterial>;
    orbitVertexNumber: number = 0;
    shownVertices: number = 0;
    /** Die zukünftige Position des Planeten an der neuesten Stelle der Umlaufbahn, relativ zur Sonne. In m */
    orbitLatestPosition: Vector;
    /** Die zukünftige Geschwindigkeit des Planeten an der neuesten Stelle der Umlaufbahn. In m/s */
    orbitLatestVelocity: Vector;

    init(): void {
        super.init();
        this.initOrbit();
    }

    addToScene(scene: Scene) {
        super.addToScene(scene);
        scene.add(this.orbit);
    }

    protected initOrbit() {
        const geometry = new BufferGeometry();
        const positions = new Float32Array(ORBIT_MAX_VERTICES * 3);
        geometry.setAttribute('position', new BufferAttribute(positions, 3));

        geometry.setDrawRange(0, this.shownVertices);
    
        let material = new LineBasicMaterial({
            color: this.color
        });

        this.orbit = new Line(geometry, material); // LineLoop, damit der Kreis geschlossen ist.
    }

}
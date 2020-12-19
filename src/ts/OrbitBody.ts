import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, Scene, Vector3 } from "three";
import { Body } from "./Body";
import { Vector } from "./Vector";

export const ORBIT_MAX_VERTICES = 250;
const ORBIT_MAX_IDX = ORBIT_MAX_VERTICES - 1;

export class OrbitBody extends Body {
    
    orbit: Line<BufferGeometry, LineBasicMaterial>[] = [];
    vertexIndex: number = 0;
    secondOrbitUsed: boolean = false;
    orbitCounter: number = 0;
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
        this.orbit.forEach(part => scene.add(part));
    }
    
    protected initOrbit() {
        for (let i = 0; i < 2; i++) {
            const geometry = new BufferGeometry();
            const positions = new Float32Array(ORBIT_MAX_VERTICES * 3);
            geometry.setAttribute('position', new BufferAttribute(positions, 3));
            geometry.setDrawRange(0, 0);
            
            let material = new LineBasicMaterial({
                color: this.color
            });
            
            this.orbit[i] = new Line(geometry, material);
        }
    }
    
    feedOrbitPosition(position: Vector3) {
        if(this.orbitCounter-- > 0) return;
        this.orbitCounter = 5;

        let i = this.vertexIndex++;
        if(this.vertexIndex >= ORBIT_MAX_VERTICES * 2) this.vertexIndex = 0;

        let part: number;
        let other: number;
        if(i < ORBIT_MAX_VERTICES) {
            part = 0;
            other = 1;
        } else {
            part = 1;
            other = 0;
        }

        const currentGeometry = <BufferGeometry> this.orbit[part].geometry;
        const otherGeometry = <BufferGeometry> this.orbit[other].geometry;
        const currentPositionAttribute = <BufferAttribute> currentGeometry.attributes.position;
        const otherPositionAttribute = <BufferAttribute> otherGeometry.attributes.position;

        if(part === 1) {
            this.secondOrbitUsed = true;
            i -= ORBIT_MAX_VERTICES;
        }

        let secondOrSecondUsed = part === 1 || this.secondOrbitUsed;
        if(i === 0 && secondOrSecondUsed) {
            i += 1;
            currentPositionAttribute.setXYZ(0, otherPositionAttribute.getX(ORBIT_MAX_IDX), otherPositionAttribute.getY(ORBIT_MAX_IDX), otherPositionAttribute.getZ(ORBIT_MAX_IDX));
        }

        currentPositionAttribute.setXYZ(i, position.x, position.y, position.z);
        currentPositionAttribute.needsUpdate = true;
        currentGeometry.setDrawRange(0, i + 1);

        if(secondOrSecondUsed) 
            otherGeometry.setDrawRange(i + 1, ORBIT_MAX_VERTICES - i - 1);
    }
    
}
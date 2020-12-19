import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, Scene, Vector3 } from "three";
import { Body } from "./Body";
import { Vector } from "./Vector";

export const ORBIT_MAX_VERTICES = 250;
const ORBIT_MAX_IDX = ORBIT_MAX_VERTICES - 1;

export class OrbitBody extends Body {
    
    orbit: Line<BufferGeometry, LineBasicMaterial>[] = [];
    vertexIndex: number = 0;
    secondOrbitUsed: boolean = false;
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
        let i = this.vertexIndex++;
        if(this.vertexIndex >= ORBIT_MAX_VERTICES * 2) this.vertexIndex = 0;
        
        const geometry1 = <BufferGeometry> this.orbit[0].geometry;
        const geometry2 = <BufferGeometry> this.orbit[1].geometry;
        const positionAttribute1 = <BufferAttribute> geometry1.attributes.position;
        const positionAttribute2 = <BufferAttribute> geometry2.attributes.position;
        
        if(i < ORBIT_MAX_VERTICES) {
            if(this.secondOrbitUsed) {
                if (i === 0) {
                    i += 1;
                    positionAttribute1.setXYZ(0, positionAttribute2.getX(ORBIT_MAX_IDX), positionAttribute2.getY(ORBIT_MAX_IDX), positionAttribute2.getZ(ORBIT_MAX_IDX));
                }
                geometry2.setDrawRange(i + 1, ORBIT_MAX_VERTICES - i - 1);
            }
            
            positionAttribute1.setXYZ(i, position.x, position.y, position.z);
            geometry1.setDrawRange(0, i + 1);
            positionAttribute1.needsUpdate = true;
        } else {
            this.secondOrbitUsed = true;
            i -= ORBIT_MAX_VERTICES;
            if(i === 0) {
                i += 1;
                positionAttribute2.setXYZ(0, positionAttribute1.getX(ORBIT_MAX_IDX), positionAttribute1.getY(ORBIT_MAX_IDX), positionAttribute1.getZ(ORBIT_MAX_IDX));
            }
            positionAttribute2.setXYZ(i, position.x, position.y, position.z);
            geometry2.setDrawRange(0, i + 1);
            positionAttribute2.needsUpdate = true;
            
            geometry1.setDrawRange(i + 1, ORBIT_MAX_VERTICES - i - 1);
        }
    }
    
}
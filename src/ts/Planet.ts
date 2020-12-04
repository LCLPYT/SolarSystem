import { CircleGeometry, LineBasicMaterial, LineLoop, Scene } from "three";
import { Body, getOrbitLineLoop } from "./Body";

export class Planet extends Body {

    orbit: LineLoop<CircleGeometry, LineBasicMaterial>;

    init(): void {
        super.init();
        this.orbit = getOrbitLineLoop(this);
    }

    addToScene(scene: Scene) {
        super.addToScene(scene);
        scene.add(this.orbit);
    }
    
}
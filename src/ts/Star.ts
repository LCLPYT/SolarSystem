import { Mesh, PointLight, Scene } from "three";
import { Body } from "./Body";

export class Star extends Body {

    lightSource: PointLight;

    init(): void {
        super.init();
        this.initLightSource();
    }

    addToScene(scene: Scene) {
        super.addToScene(scene);
        scene.add(this.lightSource);
    }

    protected initLightSource() {
        this.lightSource = new PointLight(0xffffff, 2);
        this.lightSource.position.set(0, 0, 0);
        this.mesh.add(this.lightSource); // Die Lichtquelle als Kind von dem Stern 3D-Objekt hinzufügen.
    }

}
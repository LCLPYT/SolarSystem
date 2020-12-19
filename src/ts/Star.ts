import { Mesh, MeshStandardMaterial, PointLight, Scene, SphereGeometry } from "three";
import { Body } from "./Body";
import { scale } from "./Values";

export class Star extends Body {

    lightSource: PointLight;

    init(): void {
        super.init();
        this.initLightSource();
    }

    protected initMesh() {
        let geometry = new SphereGeometry(
            this.radius * scale,
            64, // Anzahl der horizontalen Segmente der Kugel
            64 // Anzahl der vertikalen Segmente der Kugel
        );
    
        let material = new MeshStandardMaterial({
            color: this.color,
            emissive: this.color
        });
    
        this.mesh = new Mesh(geometry, material);
        this.updatePosition();
    }

    protected initLightSource() {
        this.lightSource = new PointLight(0xffffff, 2);
        this.lightSource.position.set(0, 0, 0);
        this.mesh.add(this.lightSource); // Die Lichtquelle als Kind von dem Stern 3D-Objekt hinzufügen.
    }

}
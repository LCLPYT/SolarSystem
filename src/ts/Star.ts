/*
Dieses Modul definiert die Star-Klasse.
*/

import { Material, MeshStandardMaterial, PointLight } from "three";
import { Body } from "./Body";

/**
 * Repräsentation eines Sternes. Ein Stern wird nicht beleuchtet, sondern leuchtet selbst, weswegen dieser eine Lichtquelle bei sich trägt und ein anderes Mesh-Material besitzt.
 */
export class Star extends Body {

    /** Die Lichtquelle des Sterns */
    lightSource: PointLight;

    /**
     * Erweiterung der init()-Funktion der Body-Klasse
     */
    init(): void {
        super.init();
        this.initLightSource();
    }

    /**
     * Überschreiben der Helferfunktion zum Material erstellen, da ein Stern von selbst leuchten soll.
     */
    protected getMeshMaterial(): Material {
        // MeshStandardMaterial stellt keinen Schatten dar, was den Eindruck erweckt, der Stern würde leuchten.
        return new MeshStandardMaterial({
            color: this.color,
            emissive: this.color
        });
    }

    /**
     * Helferfunktion, um die Lichtquelle zu erstellen.
     */
    protected initLightSource() {
        this.lightSource = new PointLight(0xffffff, 2);
        this.lightSource.position.set(0, 0, 0);
        this.mesh.add(this.lightSource); // Die Lichtquelle als Kind von dem Stern 3D-Objekt hinzufügen, damit diese immer mit diesem mit bewegt wird.
    }

}
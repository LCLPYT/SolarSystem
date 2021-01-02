/*
Dieses Modul definiert die OrbitBody-Klasse, welche für die Planetenspuren verantwortlich ist.
*/

import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, Scene, Vector3 } from "three";
import { Body } from "./Body";

/* Konstanten */
/** Die Maximale Anzahl an Eckpunkten pro Spurlinie. */
const ORBIT_MAX_VERTICES = 1250;
/** Maximaler Index der Eckpunkte */
const ORBIT_MAX_IDX = ORBIT_MAX_VERTICES - 1;

enum Part {
    FIRST = 0,
    SECOND = 1
}

/**
 * Jeder Himmelskörper, der diese Klasse erweitert, hinterlässt eine Spur in der Szene.
 */
export class OrbitBody extends Body {
    
    /** Linien-Feld, in welchem zwei Linien abgespeichert sind, welche die Spur ergeben. */
    public orbit: Line<BufferGeometry, LineBasicMaterial>[] = [];
    /** Der Index des momentanen Eckpunktes im Eckpunktfeld der momentanen Linie. */
    protected vertexIndex: number = 0;
    /** Gibt Aussage darüber, ob die zweite Linie schon zu Darstellung des Feldes benötigt wurde. */
    protected secondOrbitUsed: boolean = false;
    
    /**
     * Erweiterung der init()-Funktion der Body-Klasse.
     */
    init(): void {
        super.init();
        this.initOrbit();
    }
    
    /**
     * Erweiterung der addToScene()-Funktion der Body-Klasse.
     * @param scene Die involvierte Szene
     */
    addToScene(scene: Scene) {
        super.addToScene(scene);
        this.orbit.forEach(part => scene.add(part));
    }
    
    /**
     * Helfermethode um die Linien der Umlaufbahn zu initialisieren.
     */
    protected initOrbit() {
        for (let i = 0; i < 2; i++) { // Es werden zwei Linien benötigt.
            // Eine dynamisch anpassbare Geometrie erstellen.
            const geometry = new BufferGeometry();
            const positions = new Float32Array(ORBIT_MAX_VERTICES * 3); // Die Eckpunkte haben drei Koordinaten.
            geometry.setAttribute('position', new BufferAttribute(positions, 3));
            geometry.setDrawRange(0, 0); // Anfangs gibt es keine Eckpunkte, weswegen auch keine gezeichnet werden sollen.
            
            // Material erstellen
            let material = new LineBasicMaterial({ color: this.color });

            // Linie zum Linienfeld hinzufügen
            this.orbit[i] = new Line(geometry, material);
        }
    }
    
    /**
     * Fügt eine neue Position zur Spurlinie hinzu.
     * Um dynamisch Eckpunkte hinzuzufügen, siehe: https://threejs.org/docs/#manual/en/introduction/How-to-update-things
     * @param position Die Position, die an vorderster Stelle an die Linie angefügt werden soll.
     */
    feedOrbitPosition(position: Vector3) {
        let i = this.vertexIndex++; // Inkrementieren des Index.
        if(this.vertexIndex >= ORBIT_MAX_VERTICES * 2) this.vertexIndex = 0; // Zurücksetzen des Index

        /*
        Hier wird der Index der Linie ermittelt, an welche die neue Position angefügt werden soll.

        Dies ist von nöten, da eine Linie nur beschränkt viele Eckpunkte haben kann.
        Wenn man die Linie wieder von Vorne aktualisieren würde, würde der Anfang der Linie mit dem Ende der Linie verbunden sein.
        Um dieses Problem zu lösen, habe ich zwei Linien erstellt, welche zusammen die ganze Linie bilden.
        Der folgende Quelltext ist stark gerefactort und daher vielleicht etwas schwer zu verstehen.
        */
        let part: number; // Der Index der Linie, an der die neue Position angefügt werden soll.
        let other: number; // Der Index der Linie, von der der erste Eckpunkt gelöscht werden soll (das Ende der Linie bewegt sich).
        if(i < ORBIT_MAX_VERTICES) {
            part = Part.FIRST;
            other = Part.SECOND;
        } else {
            part = Part.SECOND;
            other = Part.FIRST;
        }

        // Referenzieren der Buffer-Geometrien und der Positionsattribute.
        const currentGeometry = <BufferGeometry> this.orbit[part].geometry;
        const otherGeometry = <BufferGeometry> this.orbit[other].geometry;
        const currentPositionAttribute = <BufferAttribute> currentGeometry.attributes.position;
        const otherPositionAttribute = <BufferAttribute> otherGeometry.attributes.position;

        // Wenn die zweite Linie momentan befüllt wird, muss der Index verschoben werden.
        if(part === Part.SECOND) {
            this.secondOrbitUsed = true;
            i -= ORBIT_MAX_VERTICES;
        }

        let secondOrSecondUsed = part === Part.SECOND || this.secondOrbitUsed;
        // Beim ersten Aufruf muss der erste Eckpunkt gleich dem letzten der anderen Linie gesetzt werden, damit beide Linien miteinander verbunden sind.
        if(i === 0 && secondOrSecondUsed) {
            i += 1;
            currentPositionAttribute.setXYZ(0, otherPositionAttribute.getX(ORBIT_MAX_IDX), otherPositionAttribute.getY(ORBIT_MAX_IDX), otherPositionAttribute.getZ(ORBIT_MAX_IDX));
        }

        // Hier wird die neue Position an die momentane Linie angefügt.
        currentPositionAttribute.setXYZ(i, position.x, position.y, position.z);
        currentPositionAttribute.needsUpdate = true;
        currentGeometry.setDrawRange(0, i + 1); // Nur die ersten i + 1 Elemente der Liste der Eckpunkte sind valide, daher werden auch nur diese gezeichnet.

        // Parallel zum Hinzufügen neuer Eckpunkte müssen die Eckpunkte von Beginn der anderen Linie entfernt werden. (eigentlich werden sie nur nicht angezeigt)
        if(secondOrSecondUsed) 
            otherGeometry.setDrawRange(i + 1, ORBIT_MAX_VERTICES - i - 1);
    }
    
}
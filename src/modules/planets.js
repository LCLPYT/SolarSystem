import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
    scale, canvas, camera
} from './../index.js';

// Dieses Feld enthält alle Planeten, welche in die Szene hinzugefügt wurden.
let planetsInScene = [];

/**
 * Repräsentation eines Planeten.
 */
export class Planet {

    /**
     * @param {string} name Der Name des Planeten.
     * @param {number} color Die Farbe des Planeten.
     * @param {number} radius Der Radius des Planeten, in km.
     * @param {number} distanceToStar Die Distanz zum Stern, in km.
     */
    constructor(name, color, radius, distanceToStar) {
        this.name = name;
        this.color = color;
        this.radius = radius;
        this.distanceToStar = distanceToStar;
    }

    /**
     * Initialisiert das Mesh-Objekt des Planeten.
     */
    init() {
        this.initMesh(); // Hinzufügen der Mesh.
        this.initOrbit(); // Hinzufügen der Umlaufbahn.
        this.initLabel(); // Hinzufügen der Beschriftung.
    }

    /**
     * Fügt die Three.js Komponente hinzu.
     */
    initMesh() {
        // Erstellen der Kugel (dem Planeten)
        let geometry = new THREE.SphereGeometry(
            this.radius * scale, // Radius
            64, // widthSegments - Anzahl der horizontalen Segmente der Kugel
            64 // heightSegments - Anzahl der vertikalen Segmente der Kugel
        );
        let material = new THREE.MeshBasicMaterial({
            color: this.color, // Farbe des Planetens
            emissive: this.color, // Sonne soll als Lichtquelle agieren, deshalb emmitiert sie Licht
            emissiveIntensity: 0.1 // Stärke der Emmitierung (TODO test)
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.distanceToStar * scale, 0, 0);
    }

    /**
     * Fügt die Umlaufbahn hinzu.
     * TODO realistische Daten anwenden! -> Ellipse, geneigt.
     */
    initOrbit() {
        let circleGeometry = new THREE.CircleGeometry(
            this.distanceToStar * scale, // Radius
            128 // Anzahl der Kreissegmente
        );
        circleGeometry.vertices.shift(); // Den ersten Eckpunkt entfernen, da es keine Linie zum Zentrum geben soll.
        let circleMaterial = new THREE.LineBasicMaterial({
            color: this.color
        });
        this.orbit = new THREE.LineLoop(circleGeometry, circleMaterial); // LineLoop, damit der Kreis geschlossen ist.
        this.orbit.rotation.x = Math.PI / 2;
    }

    /**
     * Fügt die Beschriftung des Planeten ein.
     */
    initLabel() {
        let div = document.createElement("div");
        div.classList.add("label");
        let text = document.createTextNode(this.name);
        div.appendChild(text);
        this.label = new CSS2DObject(div);
        this.label.position.set(0, this.radius * scale, 0); // Relative Position zum Planeten setzen.
        this.mesh.add(this.label);
    }

    isInitialized() {
        return this.mesh !== undefined && this.orbit !== undefined && this.label !== undefined;
    }

    /**
     * Fügt den Planeten zur Szene hinzu.
     * 
     * @param {THREE.Scene} scene Die Szene, zu der das Mesh-Objekt des Planetens hinzugefügt werden soll.
     * @returns Das selbe Planet-Objekt.
     */
    addToScene(scene) {
        if (!this.isInitialized()) this.init();

        if(this.orbit !== undefined) scene.add(this.orbit);
        scene.add(this.mesh);

        // Hinzufügen des Planeten in das Feld der Planeten, welche momentan in der Szene sind.
        if (!planetsInScene.includes(this)) planetsInScene.push(this);

        return this;
    }

    /**
     * Bewegt den Planeten auf die gegebene Position.
     * 
     * @param {number} x x-Koordinate
     * @param {number} y y-Koordinate
     * @param {number} z z-Koordinate
     * @returns Das selbe Planet-Objekt.
     */
    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
        return this;
    }
}

/**
 * Repräsentation eines Sternes. Sterne fügen außer ihres Meshes auch noch eine Lichtquelle hinzu.
 */
export class Star extends Planet {

    // Überschreiben der init() Funktion.
    init() {
        super.init(); // init() Funktion der Elternklasse aufrufen.

        // Zusätzliche Aufrufe.

        // Hinzufügen von einer Lichtquelle
        this.lightSource = new THREE.PointLight(0xffffff, 2);
        this.lightSource.position.set(this.distanceToStar, 0, 0);
    }

    // Übeschreiben der isInitialized() Funktion, mit der zusätzlichen Kondition, dass die lightSource definiert ist.
    isInitialized() {
        return super.isInitialized() && this.lightSource !== undefined;
    }

    // Überschreiben der addToScene() Funktion.
    addToScene(scene) {
        super.addToScene(scene);

        // Lichtquelle zur Szene hinzufügen.
        scene.add(this.lightSource);
    }

    // Überschreiben der initOrbit() Funktion.
    initOrbit() {
        // Keine Umlaufbahn hinzufügen.
    }

}

/**
 * Repräsentation eines Mondes. Ein Mond unterscheidet sich von Planeten in diesem Programm insofern, dass sie keine Beschriftungen haben.
 */
export class Moon extends Planet {

    /**
     * @param {string} name Der Name des Planeten.
     * @param {number} color Die Farbe des Planeten.
     * @param {number} radius Der Radius des Planeten, in km.
     * @param {Planet} planet Der Planet, zu dem der Mond gehört.
     * @param {number} distanceToPlanet Die Distanz zum Planeten, in km.
     */
    constructor(name, color, radius, planet, distanceToPlanet) {
        super(name, color, radius, planet.distanceToStar + distanceToPlanet);
        this.planet = planet;
        this.distanceToPlanet = distanceToPlanet;
    }

    // Überschreiben der initLabel() Funktion.
    initLabel() {
        // Keine Beschriftung hinzufügen.
    }

    // Überschreiben der initOrbit() Funktion.
    initOrbit() {
        let circleGeometry = new THREE.CircleGeometry(
            this.distanceToPlanet * scale, // Radius
            64 // Anzahl der Kreissegmente
        );
        circleGeometry.vertices.shift(); // Den ersten Eckpunkt entfernen, da es keine Linie zum Zentrum geben soll.
        let circleMaterial = new THREE.LineBasicMaterial({
            color: this.color
        });
        this.orbit = new THREE.LineLoop(circleGeometry, circleMaterial); // LineLoop, damit der Kreis geschlossen ist.
        this.orbit.rotation.x = Math.PI / 2;
        this.orbit.position.copy(this.planet.mesh.position);
        this.planet.mesh.add(this.orbit);
    }

    // Überschreiben von isInitialized(), hier wird die Kondition, dass label definiert sein muss, ausgelassen.
    isInitialized() {
        return this.mesh !== undefined && this.orbit !== undefined;
    }

}

/* Definition der Planeten, der Sonne und des Mondes, Pysikalische Daten von Wikipedia */
export const
    SUN = new Star("Sonne", 0xfdb813, 696342, 0),
    MERCURY = new Planet("Merkur", 0xadadad, 2439, 57900000),
    VENUS = new Planet("Venus", 0xbda275, 6051, 108200000),
    EARTH = new Planet("Erde", 0x0061b5, 6371, 149600000),
    MOON = new Moon("Mond", 0xd3d7de, 1737, EARTH, 384400),
    MARS = new Planet("Mars", 0xb54f38, 3389, 227900000),
    JUPITER = new Planet("Jupiter", 0xb3a568, 69911, 778300000),
    SATURN = new Planet("Saturn", 0xcfc572, 58232, 1427000000),
    URANUS = new Planet("Uranus", 0x87f5e8, 25362, 2870000000),
    NEPTUNE = new Planet("Neptun", 0x5665a6, 24622, 4496000000),
    PLUTO = new Planet("Pluto", 0x736750, 1188, 5900000000);
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {scale, timePerSecond} from './values.js';

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
     * @param {number} orbitTime Die Zeit, die der Planet benötigt, um einmal um die Sonne zu reisen. In Tagen
     */
    constructor(name, color, radius, distanceToStar, orbitTime) {
        this.name = name;
        this.color = color;
        this.radius = radius;
        this.distanceToStar = distanceToStar;
        this.orbitTime = orbitTime;
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
        let material = new THREE.MeshStandardMaterial({
            color: this.color // Farbe des Planetens
        });
        this.mesh = new THREE.Mesh(geometry, material);
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
        SUN.mesh.add(this.orbit); // Umlaufbahn als Kind des Sonnen-3D-Objektes hinzufügen, damit diese sich mit dieser bewegen (falls sie bewegt wird).
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

    /**
     * Fügt den Planeten zur Szene hinzu.
     * 
     * @param {THREE.Scene} scene Die Szene, zu der das Mesh-Objekt des Planetens hinzugefügt werden soll.
     * @returns Das selbe Planet-Objekt.
     */
    addToScene(scene) {
        if (this.mesh === undefined) this.init();

        scene.add(this.mesh);

        this.registerPlanet();

        return this;
    }

    /**
     * Registriert den Planeten in einem Feld, damit über diesen später iteriert werden kann.
     */
    registerPlanet() {
        if (!planetsInScene.includes(this)) planetsInScene.push(this);
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

    tick(deltaTime) {
        if(this.angularSpeed === undefined) {
            if(this.orbitTime === 0) this.angularSpeed = 0;
            else this.angularSpeed = (Math.PI * 2) / ((this.orbitTime * 60 * 60 * 24) / timePerSecond);
        }

        if(this.angularSpeed === 0) return;

        if(this.rot === undefined) this.rot = 0;
        this.rot += this.angularSpeed * deltaTime;
        if(this.rot >= Math.PI * 2) this.rot -= Math.PI * 2;

        this.moveTo(Math.sin(this.rot) * this.distanceToStar * scale, 0, Math.cos(this.rot) * this.distanceToStar * scale);
    }
}

/**
 * Repräsentation eines Sternes. Sterne fügen außer ihres Meshes auch noch eine Lichtquelle hinzu.
 */
export class Star extends Planet {

    // Überschreiben der init() Funktion.
    init() {
        this.initMesh();
        super.initLabel();
        this.initLightSource();

        super.registerPlanet();
    }

    // Überschreiben der initMesh() Funktion
    initMesh() {
        // Erstellen der Kugel (des Sternes)
        let geometry = new THREE.SphereGeometry(
            this.radius * scale, // Radius
            64, // widthSegments - Anzahl der horizontalen Segmente der Kugel
            64 // heightSegments - Anzahl der vertikalen Segmente der Kugel
        );
        let material = new THREE.MeshStandardMaterial({
            color: this.color, // Farbe des Sternes,
            emissive: this.color // Lichtquelle des Sternes steckt in diesem, deswegen wird ein Licht "emittiert". Aißerdem beleuchtet die Lichtquelle die falsche Seite der Eckpunkte.
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    /**
     * Fügt eine Lichtquelle hinzu.
     */
    initLightSource(scene) {
        this.lightSource = new THREE.PointLight(0xffffff, 2); // (Lichtfarbe (Spektrum), Intensität)
        this.lightSource.position.set(this.distanceToStar, 0, 0); // Zum Stern bewegen.
        this.mesh.add(this.lightSource); // Die Lichtquelle als Kind von dem Stern 3D-Objekt hinzufügen.
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
     * @param {number} orbitTime Die Zeit, in der der Mond einmal um seinen Planeten kreist. In Tagen.
     */
    constructor(name, color, radius, planet, distanceToPlanet, orbitTime) {
        super(name, color, radius, planet.distanceToStar + distanceToPlanet, orbitTime);
        this.planet = planet;
        this.distanceToPlanet = distanceToPlanet;
    }

    // Überschreiben der initMesh() Funktion.
    initMesh() {
        super.initMesh();
        this.planet.mesh.add(this.mesh);
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
        this.planet.mesh.add(this.orbit); // Die Umlaufbahn als Kind des Planeten-3D-Objektes hinzufügen.
    }

    // Überschreiben der init() Funktion.
    init() {
        this.initMesh();
        this.initOrbit();
        this.initLabel();

        super.registerPlanet();
    }

    // Überschreiben von addToScene(scene)
    addToScene(scene) {
        if (this.mesh === undefined) this.init();

        this.registerPlanet();

        return this;
    }

    // Überschreiben von tick(deltaTime)
    tick(deltaTime) {
        if(this.angularSpeed === undefined) {
            if(this.orbitTime === 0) this.angularSpeed = 0;
            else this.angularSpeed = (Math.PI * 2) / ((this.orbitTime * 60 * 60 * 24) / timePerSecond);
        }

        if(this.angularSpeed === 0) return;

        if(this.rot === undefined) this.rot = 0;
        this.rot += this.angularSpeed * deltaTime;
        if(this.rot >= Math.PI * 2) this.rot -= Math.PI * 2;

        this.moveTo(Math.sin(this.rot) * this.distanceToPlanet * scale, 0, Math.cos(this.rot) * this.distanceToPlanet * scale);
    }

}

/* Definition der Planeten, der Sonne und des Mondes, Pysikalische Daten von Wikipedia */
export const
    SUN = new Star("Sonne", 0xfdb813, 696342, 0, 0),
    MERCURY = new Planet("Merkur", 0xadadad, 2439, 57900000, 87.97),
    VENUS = new Planet("Venus", 0xbda275, 6051, 108200000, 224.7),
    EARTH = new Planet("Erde", 0x0061b5, 6371, 149600000, 365.26),
    MOON = new Moon("Mond", 0xd3d7de, 1737, EARTH, 384400, 27.3217),
    MARS = new Planet("Mars", 0xb54f38, 3389, 227900000, 686.98),
    JUPITER = new Planet("Jupiter", 0xb3a568, 69911, 778300000, 4332.82),
    SATURN = new Planet("Saturn", 0xcfc572, 58232, 1427000000, 10755.7),
    URANUS = new Planet("Uranus", 0x87f5e8, 25362, 2870000000, 30687.15),
    NEPTUNE = new Planet("Neptun", 0x5665a6, 24622, 4496000000, 60190.03),
    PLUTO = new Planet("Pluto", 0x736750, 1188, 5900000000, 90553);


/**
 * Diese Funktion wird aus der animate() Schleife aufgerufen.
 * In ihr wird alles, was mit den Planeten zu tun hat, pro Bild verarbeitet.
 * 
 * @param {number} deltaTime Vergangene Zeit seit dem letzten Aufruf.
 */
export function tick(deltaTime) {
    planetsInScene.forEach(planet => planet.tick(deltaTime));
}
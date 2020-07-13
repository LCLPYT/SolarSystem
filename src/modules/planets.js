import * as THREE from 'three';
import {
    scale, canvas, camera
} from './../index.js'

// Dieses Feld enthält alle Planeten, welche in die Szene hinzugefügt wurden.
let planetsInScene = [];

/**
 * Repräsentation eines Planeten (oder der Sonne oder Monden). Speichert alle relevanten Daten zum Himmelskörper.
 */
export class Planet {

    /**
     * @param {string} name Der Name des Planeten.
     * @param {number} color Die Farbe des Planeten.
     * @param {number} radius Der Radius des Planeten, in km.
     */
    constructor(name, color, radius, distanceToSun) {
        this.name = name;
        this.color = color;
        this.radius = radius;
        this.distanceToSun = distanceToSun;
    }

    /**
     * Initialisiert das Mesh-Objekt des Planeten.
     */
    init() {
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
        this.mesh.position.set(this.distanceToSun * scale, 0, 0);

        // Erstellen der Umlaufbahn (TODO realistische Daten anwenden)
        let circleGeometry = new THREE.CircleGeometry(
            this.distanceToSun * scale, // Radius
            128 // Anzahl der Kreissegmente
        );
        circleGeometry.vertices.shift(); // Den ersten Eckpunkt entfernen, da es keine Linie zum Zentrum geben soll.
        let circleMaterial = new THREE.LineBasicMaterial({
            color: this.color
        });
        this.orbit = new THREE.LineLoop(circleGeometry, circleMaterial); // LineLoop, damit der Kreis geschlossen ist.

        this.label = document.createElement("div");
        this.label.classList.add("label");
        let text = document.createTextNode(this.name);
        this.label.appendChild(text);
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

        scene.add(this.orbit);
        scene.add(this.mesh);

        document.body.insertBefore(this.label, canvas);

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

/* Definition der Planeten, der Sonne und des Mondes, Pysikalische Daten von Wikipedia */
export const
    SUN = new Planet("Sonne", 0xfdb813, 696342, 0),
    MERCURY = new Planet("Merkur", 0xadadad, 2439, 57900000),
    VENUS = new Planet("Venus", 0xbda275, 6051, 108200000),
    EARTH = new Planet("Erde", 0x0061b5, 6371, 149600000),
    MOON = new Planet("Mond", 0xd3d7de, 1737, EARTH.distanceToSun + 384400),
    MARS = new Planet("Mars", 0xb54f38, 3389, 227900000),
    JUPITER = new Planet("Jupiter", 0xb3a568, 69911, 778300000),
    SATURN = new Planet("Saturn", 0xcfc572, 58232, 1427000000),
    URANUS = new Planet("Uranus", 0x87f5e8, 25362, 2870000000),
    NEPTUNE = new Planet("Neptun", 0x5665a6, 24622, 4496000000),
    PLUTO = new Planet("Pluto", 0x736750, 1188, 5900000000);

/**
 * Diese Funktion zeichnet die Planetenbeschriftungen, welche man immer sehen kann, egal wie weit die Planeten entfernt sind.
 */
export function drawPlanetLabels() {
    planetsInScene.forEach(planet => {
        let vector = planet.mesh.position.clone(); // Duplizieren der Koordinaten des Planeten.
        vector.project(camera); // 3D Koordinaten in 2D-Koordinaten (NDC) umwandeln.

        // Umwandeln in Bildschirm Koordinaten
        vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

        let label = planet.label;
        label.style.left = `${vector.x}px`;
        label.style.top = `${vector.y}px`;
    });
}
/**
 * Repräsentation eines Planeten (oder der Sonne oder Monden). Speichert alle relevanten Daten zum Himmelskörper.
 */
export class Planet {

    /**
     * @param {string} name Der Name des Planeten.
     * @param {number} color Die Farbe des Planeten.
     * @param {number} radius Der Radius des Planeten, in km.
     */
    constructor(name, color, radius) {
        this.name = name;
        this.color = color;
        this.radius = radius;
    }
}

/* Definition der Planeten, der Sonne und des Mondes, Pysikalische Daten von Wikipedia */
export const
    SUN     = new Planet("Sonne",   0xfdb813, 696342),
    MERCURY = new Planet("Merkur",  0xadadad, 2439),
    VENUS   = new Planet("Venus",   0xbda275, 6051),
    EARTH   = new Planet("Erde",    0x0061b5, 6371),
    MOON    = new Planet("Mond",    0xd3d7de, 1737),
    MARS    = new Planet("Mars",    0xb54f38, 3389),
    JUPITER = new Planet("Jupiter", 0xb3a568, 69911),
    SATURN  = new Planet("Saturn",  0xcfc572, 58232),
    URANUS  = new Planet("Uranus",  0x87f5e8, 25362),
    NEPTUNE = new Planet("Neptun",  0x5665a6, 24622),
    PLUTO   = new Planet("Pluto",   0x736750, 1188);
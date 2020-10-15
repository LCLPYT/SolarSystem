class Vector {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    multScalar(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    divScalar(s) {
        return this.multScalar(1 / s);
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    cross(vec) {
        return new Vector(
            this.y * vec.z - this.z * vec.y, 
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
            );
    }

    normalize() {
        return this.divScalar(this.length());
    }

}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.getBoundingClientRect().width, height = canvas.getBoundingClientRect().height;
const auPerPixel = 4 / 500; // 2 AU pro 500 pixel
const grav = 6.67430E-11; // m^3*km^-2*s^-1

class Planet {

    /**
     * @param {Vector} pos Positionsvektor, in AE, vom Mittelpunkt der Sonne
     * @param {Vector} vel Geschwindigkeitsvektor, in AE/d
     * @param {*} mass Masse in kg
     * @param {*} color CSS style, z.B. 'blue'
     */
    constructor(pos, vel, mass, color, size) {
        this.pos = pos;
        this.vel = vel;
        this.mass = mass;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(x(auToPixel(this.pos.x)), y(auToPixel(this.pos.y)), this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

}

function auToPixel(au) {
    return au / auPerPixel
}

function x(x) {
    return width / 2 + x; 
}

function y(y) {
    return height / 2 + y;
}

let sun = new Planet(
    new Vector(0, 0, 0), 
    new Vector(0, 0, 0), 
    1988500E+24,
    "yellow",
    10);
let mars = new Planet(
    new Vector(1.379746518610276E+00, -1.393478644068468E-01, -3.676720275690865E-02), 
    new Vector(1.942629911583868E-03,  1.511819668505303E-02,  2.691519759640370E-04), 
    6.4171E+23,
    "red",
    4);

/**
 * @param {Planet} p1 Planet 1
 * @param {Planet} p2 Planet 2
 * @returns {Vector} Die Kraft, die ausgehend von p1 auf p2 wirkt. In N
 */
function attract(p1, p2) {
    let vec = p1.pos.sub(p2.pos); // Verschiebungsvektor in AE
    vec = vec.multScalar(149597870700); // AE zu m
    let dis = vec.length(); // in m

    let scalar = -grav * p1.mass * p2.mass / (dis * dis);
    return vec.normalize().multScalar(scalar);
}

/**
 * @param {Vector} p1 Anziehender Planet
 * @param {Vector} p2 Angezogener Planet
 * @returns {Vector} Die Beschleunigung, die der angezogene Planet erfährt. In m/s^2
 */
function accel(p1, p2) {
    let vec = p2.pos.sub(p1.pos); // Verschiebungsvektor in AE
    vec = vec.multScalar(149597870700); // AE zu m
    let dis = vec.length(); // in m

    let scalar = -grav * p1.mass / (dis * dis);
    return vec.normalize().multScalar(scalar);
}

let planets = [sun, mars];

let lastRender = undefined;
function render(timestamp) {
    requestAnimationFrame(render);

    if(lastRender === undefined) {
        lastRender = timestamp;
        return;
    }
    const dt = timestamp - lastRender; // Zeitdifferenz zwischen diesem und dem letzten Aufruf von 'render()'
    lastRender = timestamp;

    ctx.clearRect(0, 0, width, height);
    planets.forEach(planet => {
        if(planet === sun) {
            planet.draw();
            return;
        }

        let acceleration = accel(sun, planet);

        let scaledDt = dt * 6000; // 1 s Echtzeit = 6000 s Simulationszeit

        // v = a * t
        // v [AE/d] = a [m/s^2] / 149597870700 * dt [s] * 86400
        let vel = acceleration.divScalar(149597870700).multScalar(scaledDt).multScalar(86400);

        planet.vel = planet.vel.add(vel);
        planet.pos = planet.pos.add(planet.vel.multScalar(scaledDt / 86400));
        
        planet.draw()
    });
}

requestAnimationFrame(render);

/*
- https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
- https://en.wikipedia.org/wiki/Gravitational_acceleration
 */
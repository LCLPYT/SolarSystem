import { ctx } from './constants.js';
import { x, y, auToPixel } from './utils.js';
import { Vector } from './vector.js';

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

let sun = new Planet(
    new Vector(0, 0, 0), 
    new Vector(0, 0, 0), 
    1988500E+24,
    "#fdb813",
    10
);
let mercury = new Planet(
    new Vector(-3.849096490671530E-01, -1.727167687035238E-01,  2.119488489075276E-02),
    new Vector( 5.707076535910035E-03, -2.444751825212506E-02, -2.521259375003117E-03),
    3.302E+23,
    '#adadad',
    2
);
let venus = new Planet(
    new Vector( 5.929507263938252E-01,  4.142447546237756E-01, -2.853231017609731E-02),
    new Vector(-1.164585903937774E-02,  1.649357784216506E-02,  8.983807711490797E-04),
    48.685E+23,
    '#bda275',
    3
);
let earth = new Planet(
    new Vector( 9.405202447096387E-01, -3.659048753960829E-01,  1.678360477496726E-05),
    new Vector( 5.953675405988818E-03,  1.596352471711937E-02, -4.253361160181482E-07),
    5.97219E+24,
    '#0061b5',
    3
);
let mars = new Planet(
    new Vector( 1.379746518610276E+00, -1.393478644068468E-01, -3.676720275690865E-02), 
    new Vector( 1.942629911583868E-03,  1.511819668505303E-02,  2.691519759640370E-04), 
    6.4171E+23,
    "#b54f38",
    3
);
let jupiter = new Planet(
    new Vector( 2.267052243772341E+00, -4.611135325231719E+00, -3.156992060275853E-02),
    new Vector( 6.687296946970338E-03,  3.689702495373126E-03, -1.649545276123529E-04),
    1898.13E+24,
    '#b3a568',
    8
);
let saturn = new Planet(
    new Vector( 4.947047772596200E+00, -8.696377648050891E+00, -4.570242574722980E-02),
    new Vector( 4.546001216885249E-03,  2.747593599568196E-03, -2.285594888814691E-04),
    5.6834E+26,
    '#cfc572',
    7
);
let uranus = new Planet(
    new Vector( 1.565087933482673E+01,  1.210740534917054E+01, -1.577712457355347E-01),
    new Vector(-2.429163550828162E-03,  2.931228936745626E-03,  4.224140465209752E-05),
    86.813E+24,
    '#87f5e8',
    6
);
let neptune = new Planet(
    new Vector( 2.939286024126157E+01, -5.611379991044951E+00, -5.619153838534842E-01),
    new Vector( 5.750997301405872E-04,  3.107307942517102E-03, -7.697032441333081E-05),
    102.4126E+24,
    '#5665a6',
    6
);
let pluto = new Planet(
    new Vector( 1.370090018265341E+01, -3.123258476248061E+01, -6.201482188620383E-01),
    new Vector( 2.963155638535829E-03,  6.048350923146346E-04, -9.122831231979893E-04),
    1.307E+22,
    '#736750',
    2
);

let list = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];

export { sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto, list };
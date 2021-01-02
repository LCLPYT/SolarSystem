import { Moon } from "./Moon";
import { Planet } from "./Planet";
import { Star } from "./Star";
import { Vector } from "./Vector";

const sun = new Star(
    "Sonne",
    0xfdb813,
    new Vector(0, 0, 0), 
    new Vector(0, 0, 0), 
    1988500E+24,
    695700
);
const mercury = new Planet(
    "Merkur",
    0xadadad,
    new Vector(-3.849096490671530E-01, -1.727167687035238E-01,  2.119488489075276E-02),
    new Vector( 5.707076535910035E-03, -2.444751825212506E-02, -2.521259375003117E-03),
    3.302E+23,
    2440
);
const venus = new Planet(
    "Venus",
    0xbda275,
    new Vector( 5.929507263938252E-01,  4.142447546237756E-01, -2.853231017609731E-02),
    new Vector(-1.164585903937774E-02,  1.649357784216506E-02,  8.983807711490797E-04),
    48.685E+23,
    6051.84
);
const earth = new Planet(
    "Erde",
    0x0061b5,
    new Vector( 9.405202447096387E-01, -3.659048753960829E-01,  1.678360477496726E-05),
    new Vector( 5.953675405988818E-03,  1.596352471711937E-02, -4.253361160181482E-07),
    5.97219E+24,
    6378.137
);
const moon = new Moon(
    "Mond",
    0xd3d7de,
    new Vector( 9.426732587300775E-01, -3.674274985472571E-01, -1.808644230580496E-04),
    new Vector( 6.301406059689874E-03,  1.642253737496254E-02, -2.822062559898485E-05),
    7.349E+22,
    1737.53
);
const mars = new Planet(
    "Mars",
    0xb54f38,
    new Vector( 1.379746518610276E+00, -1.393478644068468E-01, -3.676720275690865E-02), 
    new Vector( 1.942629911583868E-03,  1.511819668505303E-02,  2.691519759640370E-04), 
    6.4171E+23,
    3389.92
);
const jupiter = new Planet(
    "Jupiter",
    0xb3a568,
    new Vector( 2.267052243772341E+00, -4.611135325231719E+00, -3.156992060275853E-02),
    new Vector( 6.687296946970338E-03,  3.689702495373126E-03, -1.649545276123529E-04),
    1898.13E+24,
    69911
);
const saturn = new Planet(
    "Saturn",
    0xcfc572,
    new Vector( 4.947047772596200E+00, -8.696377648050891E+00, -4.570242574722980E-02),
    new Vector( 4.546001216885249E-03,  2.747593599568196E-03, -2.285594888814691E-04),
    5.6834E+26,
    58232
);
const uranus = new Planet(
    "Uranus",
    0x87f5e8,
    new Vector( 1.565087933482673E+01,  1.210740534917054E+01, -1.577712457355347E-01),
    new Vector(-2.429163550828162E-03,  2.931228936745626E-03,  4.224140465209752E-05),
    86.813E+24,
    25362
);
const neptune = new Planet(
    "Neptun",
    0x5665a6,
    new Vector( 2.939286024126157E+01, -5.611379991044951E+00, -5.619153838534842E-01),
    new Vector( 5.750997301405872E-04,  3.107307942517102E-03, -7.697032441333081E-05),
    102.4126E+24,
    24624
);
const pluto = new Planet(
    "Pluto",
    0x736750,
    new Vector( 1.370090018265341E+01, -3.123258476248061E+01, -6.201482188620383E-01),
    new Vector( 2.963155638535829E-03,  6.048350923146346E-04, -9.122831231979893E-04),
    1.307E+22,
    1188.3
);

const bodies = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto];

export { sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, pluto, bodies };
import { canvas, grav, auPerPixel } from './constants.js';

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

/**
 * Konvertiert eine Raumkoordinate zu einer Leinwandkoordinate.
 * @param {Number} x Die Raumkoordinate.
 * @returns {Number} Die Leinwandkoordinate.
 */
function x(x) {
    return canvas.getBoundingClientRect().width / 2 + x; 
}

function y(y) {
    return canvas.getBoundingClientRect().height / 2 + y;
}

function auToPixel(au) {
    return au / auPerPixel;
}

export { accel, x, y, auToPixel }
/*
Dieses Modul beinhaltet zusätzliche mathematische Funktionen.
*/

/**
 * Beschränkt eine Zahl zwischen einem Minimum und einem Maximum.
 * @param x Zu beschränkende Zahl.
 * @param min Minimum.
 * @param max Maximum.
 */
export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}

/**
 * Interpoliert einen Wert linear.
 * @param start Anfangswert
 * @param target Zielwert
 * @param amount Fortschritt
 */
export function lerp(start: number, target: number, amount: number) {
    amount = clamp(amount, 0, 1);
    return start + amount * (target - start);
}
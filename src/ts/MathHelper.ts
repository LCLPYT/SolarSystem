export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}

export function lerp(start: number, target: number, amount: number) {
    amount = clamp(amount, 0, 1);
    return start + amount * (target - start);
}
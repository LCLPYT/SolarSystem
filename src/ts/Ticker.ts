export function tick(now: number) {
    tickSecond(now);
}

let lastSecond = undefined;

function tickSecond(now: number) {
    if(lastSecond !== undefined && now - lastSecond < 1000) return;
    lastSecond = now;

    
}
/** AU in m */
export const AU_FACTOR = 149597870700;

export function au_to_m(au: number): number {
    return au * AU_FACTOR;
}

export function m_to_au(m: number): number {
    return m / AU_FACTOR;
}
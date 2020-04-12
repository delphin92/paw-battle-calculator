export interface Army {
    name: string;

    units: Unit[];
}

export interface Unit {
    name: string;
    commanderName?: string;

    subunits?: Unit[];
}
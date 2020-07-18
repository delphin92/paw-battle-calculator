import { isNull } from "lodash";

export const removeFromArray = <T>(array: T[], index: number): T[] =>
    [...array.slice(0, index), ...array.slice(index + 1)];

export const mn = (num: any) => !isNull(num) ? num : 0;
import {Army} from "model/army";
import rovania from "./rovania";
import brander from "./brander";

export interface Armies {
    rovania: Army;
    brander: Army;
}

export const armies: Armies = {
    rovania,
    brander
}
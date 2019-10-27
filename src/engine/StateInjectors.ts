import {State} from "./SculpturalHypertextEngine";

/**
 * The aim of this project is to be, as far as possible, a functionally pure implementation of
 * Sculptural Hypertext.
 *
 * In other words, functions and conditions should depend only on their "state" parameter - there should be no
 * reason for them to return another value, other than the "state" parameter changing.
 *
 * However, there's good reasons for needing side-effects, such as time and location.
 *
 * Rather than conditions directly querying the time, or location (which would mean that, for the same State,
 * they might return different values), instead we inject that information into the State object.
 *
 * This is the role of StateInjectors - they inject information from other sources, into the State object.
 *
 */

export type StateInjector = (state: State) => State;

export let InjectTime: StateInjector = (state: State) => {
    state["time"] = Date.now() / 1000;
    return state;
};

export interface GeolocationInjector {
    position: Position | null;
    locationWatcher: number;
    injectLocation: StateInjector;
}

export let CreateGeolocationInjector: (() => GeolocationInjector) = () => {
    let injectorInfo = {
        position: null,
        locationWatcher: -1,
        injectLocation: (state: State) => {
            state["geolocationEnabled"] = !!(navigator && navigator.geolocation);
            state["location"] = injectorInfo.position;
            return state;
        }
    };

    if(navigator && navigator.geolocation) {
        injectorInfo.locationWatcher = navigator.geolocation.watchPosition(
            (pos: Position) => {
                injectorInfo.position = pos;
            },
            (error: PositionError) => {
                injectorInfo.position = null;
            });
    };

    return injectorInfo;
};
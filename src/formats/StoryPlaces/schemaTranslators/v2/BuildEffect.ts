import {Effect, State} from "../../../../engine/SculpturalHypertextEngine";
import BuildCondition from "./BuildCondition";

let identityEffect: Effect = (state: State) => state;

export default function BuildEffect(storyData, functionReference): Effect {
    let func = storyData.functions.find((func) => func.id == functionReference);

    if(!func) {
        console.error("[Storyplaces Translator V2] Warning: Function not found: " + functionReference);
        return identityEffect;
    }

    //Functions have their own conditions, which must be satisfied in order to fire.
    let conditions = func.conditions.map(conditionReference => BuildCondition(storyData, conditionReference));

    let stateChangeFunction = BuildStateChangeFunction(storyData, func);

    //If we've got no conditions, just return the state change function itself. No need for overhead.
    if(conditions.length == 0) {
        return stateChangeFunction;
    }

    //Return a wrapper for the state change function, that only calls it if all conditions are satisfied.
    return (state: State) => {
        if (conditions.every(cond => cond(state))) {
            return stateChangeFunction(state);
        }
        return state;
    }
}

function BuildStateChangeFunction(storyData, funcData): (state: State) => State {
    switch(funcData.type) {
        //Need to add support for funcDatation-specific conditions and functions?
        case "set": {
            return (state: State) => {
                state[funcData.variable] = funcData.value;
                return state;
            }
        }
        case "settimestamp": {
            return (state: State) => {
                state[funcData.variable] = state["time"] || 0;
                return state;
            }
        }
        case "increment": {
            return (state: State) => {
                let currentValue = state[funcData.variable];
                if (typeof currentValue != "number") {
                    currentValue = parseInt(currentValue, 10);
                }
                let incrementBy = parseInt(funcData.value);
                state[funcData.variable] = (currentValue + incrementBy).toString();
                return state;
            }
        }
        case "chain": {
            return (state: State) => {
                let chainedFunctions = funcData.functions.map(funcRef => BuildEffect(storyData, funcRef));
                return chainedFunctions.reduce((state, funcToApply) => funcToApply(state), state);
            }
        }
    }
    console.error("[Storyplaces Translator V2] Function not recognised: " + funcData.type);
    console.error("This WILL cause errors in your story.");
    //Return the identity funcDatation (no change) if function type not found.
    return identityEffect;
}

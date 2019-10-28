import {Effect, State} from "../../../../engine/SculpturalHypertextEngine";

export default function BuildEffect(storyData, functionReference): Effect {
    let func = storyData.functions.find((func) => func.id == functionReference);
    switch(func.type) {
        //Need to add support for function-specific conditions and functions?
        case "set": {
            return (state: State) => {
                state[func.variable] = func.value;
                return state;
            }
        }
        case "settimestamp": {
            return (state: State) => {
                state[func.variable] = state["time"] || 0;
                return state;
            }
        }
        case "increment": {
            return (state: State) => {
                let currentValue = state[func.variable];
                if(typeof currentValue != "number") {
                    currentValue = parseInt(currentValue, 10);
                }
                let incrementBy = parseInt(func.value);
                state[func.variable] = (currentValue + incrementBy).toString();
                return state;
            }
        }
    }
}

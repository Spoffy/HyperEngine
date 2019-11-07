import {Condition, State} from "../../../../engine/SculpturalHypertextEngine";

export default function BuildCondition(storyData, conditionReference): Condition {
    let condition = storyData.conditions.find((condition) => condition.id == conditionReference);
    switch(condition.type) {
        case "check": {
            let varRef = condition.variable;
            return (state: State) => condition[varRef] === undefined;
        }
        case "logical": {
            let conditions = condition.conditions.map(BuildCondition.bind(this, storyData));
            switch (condition.operand) {
                case "AND":
                    return (state: State) => conditions.every(condition => condition(state));
                case "OR":
                    return (state: State) => conditions.some(condition => condition(state));
            }
            throw new Error("Undefined logical condition.");
        }
        case "comparison": {
            return (state: State) => {
                let valueA = condition.aType == "Variable"? state[condition.a] : condition.a;
                let valueB = condition.bType == "Variable"? state[condition.b] : condition.b;
                switch(condition.operand) {
                    case "==": {
                        return valueA == valueB;
                    }
                    case "!=": {
                        return valueA != valueB;
                    }
                    case "<=": {
                        return valueA <= valueB;
                    }
                    case ">=": {
                        return valueA >= valueB;
                    }
                    case "<": {
                        return valueA < valueB;
                    }
                    case ">": {
                        return valueA > valueB;
                    }
                }
            }
        }
        case "location": {
            let latLongDistanceMetres = (lat1, lon1, lat2, lon2) => {
                const R = 6378.137; // Radius of earth in KM
                let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
                let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
                let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                let d = R * c;
                return d * 1000; // meters
            };


            return (state: State) => {
                let mustBeAtLocation = condition.bool;
                if(state["location"]) {
                    let location: Position = state["location"];
                    if (condition.location.type == "circle") {
                        //This will error if there's errors in the base data.
                        let targetLat = parseFloat(condition.location.lat);
                        let targetLon = parseFloat(condition.location.lon);
                        let currentLat = location.coords.latitude;
                        let currentLon = location.coords.longitude;
                        let radius = condition.location.radius;

                        if(latLongDistanceMetres(currentLat, currentLon, targetLat, targetLon) < radius) {
                            return mustBeAtLocation;
                        } else {
                            return !mustBeAtLocation;
                        }

                    }
                } else {
                    //No access to location API
                    return true;
                }
                return !mustBeAtLocation;
            }
        }
        case "timepassed": {
            let durationMinutes = condition.minutes;

            return (state: State) => {
                let timeRecorded = state[condition.variable];
                return (state["time"] - timeRecorded) > durationMinutes * 60;
            }
        }
        case "timerange": {
            let startTimeStrings = condition.first.split(":");
            let endTimeStrings = condition.last.split(":");
            let startHour = parseInt(startTimeStrings[0]);
            let startMinute = parseInt(startTimeStrings[1]);
            let endHour = parseInt(endTimeStrings[0]);
            let endMinute = parseInt(endTimeStrings[1]);

            return (state: State) => {
                let currentTime = new Date(state["time"] * 1000);
                let startTime = new Date();
                startTime.setHours(startHour);
                startTime.setMinutes(startMinute);
                let endTime = new Date();
                endTime.setHours(endHour);
                endTime.setMinutes(endMinute);

                return startTime <= currentTime &&
                    currentTime <= endTime;
            }
        }
    }
}
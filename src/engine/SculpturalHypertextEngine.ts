//Type that represents the state of the hypertext.
export type State = object;

//Checks if something is true, given a state.
//This should be a *pure* function, i.e, its result should depend solely on the 'state' argument passed in.
export type Condition = (state: State) => boolean;

//Applies changes to a state, and returns a new state.
export type Effect = (state: State) => State;

export interface Choice<T extends Page> {
  //The page that the reader can choose to visit.
  page: T;
  //A function called to choose to visit that page. Returns a new SculpturalHypertext with a modified state.
  choose: () => SculpturalHypertext<T>;
}

//The minimum requirements for a page, is that it has a set of conditions and a set of effects.
//Anything else is fair game - generally an object implementing 'Page' would also have some data associated with it.
export interface Page {
  conditions: Condition[];
  effects: Effect[];
}

//The current state of a sculptural hypertext.
export interface SculpturalHypertext<T extends Page> {
  //The set of all pages contained within the hypertext.
  pages: T[],
  //The current state of the hypertext.
  state: State
}

export type FilterFunction<T extends Page> = (pages: T[], state: State) => T[];
export type ApplyFunction<T extends Page> = (page: T, state: State) => State;
export type ChoiceFunction<T extends Page> = (hypertext: SculpturalHypertext<T>) => Choice<T>[];

//Returns a new State, with all of a Page's effects applied to it in order.
export function ApplyPageToState<T extends Page>(page: T, currentState: State): State {
  let newState = {...currentState};
  return page.effects.reduce((lastState, effect) => effect(lastState), currentState);
};


export function FilterPagesByAllConditionSatisfied<T extends Page>(pages: T[], state: State): T[] {
  return pages.filter(page => page.conditions.every(condition => condition(state)));
}

//Builds a basic choice function.
//Applies the filter to all of the pages, to find out which pages are available.
//Then builds a set of Choices for the available pages,
export function BuildChoiceFunction<T extends Page>(
    filterFunction: FilterFunction<T>,
    applyFunction: ApplyFunction<T>
    ): ChoiceFunction<T>
{
    return (hypertext: SculpturalHypertext<T>) => {
        let nextPages = filterFunction(hypertext.pages, hypertext.state);

        return nextPages.map(page => {
            return {
                page: page,
                choose: () => {
                    return {
                        pages: hypertext.pages,
                        state: applyFunction(page, hypertext.state)
                    }
                }
            };
        });
    }
}

export let ListChoices = BuildChoiceFunction(FilterPagesByAllConditionSatisfied, ApplyPageToState);

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

//Returns a new State, with all of a Page's effects applied to it in order.
export function ApplyPageToState<T extends Page>(page: T, currentState: State): State {
  let newState = {...currentState};
  return page.effects.reduce((lastState, effect) => effect(lastState), currentState);
};

//Given a hypertext, returns an array of possible choices that can be made next.
export function NextChoices<T extends Page>(hypertext: SculpturalHypertext<T>): Choice<T>[]  {
  //Find pages that have all of their conditions met.
  let nextPages = hypertext.pages.filter(page => page.conditions.every(condition => condition(hypertext.state)));

  return nextPages.map(page => {
    return {
      page: page,
      choose: () => {
        //Constructs a new SculpturalHypertext, with the state modified according to the page chosen.
        return {
          pages: hypertext.pages,
          state: ApplyPageToState(page, hypertext.state)
        };
      }
    };
  });
};

import {Page, SculpturalHypertext, State} from "../engine/SculpturalHypertextEngine";
import {BasicPage} from "../engine/BasicStory";

let page1: BasicPage = {
    description: () => "Page 1",
    content: () => "This is the content of page 1",
    conditions: [() => true],
    effects: [(state: State) => {  state["p1visited"] = true; return state}]
};

let page2: BasicPage = {
    description: () => "Page 2",
    content: () => "This is the content of page 2",
    conditions: [(state: State) => state["p1visited"]],
    effects: []
};

function BuildStory(): SculpturalHypertext<BasicPage> {
    return {
        pages: [page1, page2],
        state: {}
    }
}

export default BuildStory;

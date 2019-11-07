import {BasicPage} from "../../../../engine/BasicStory";
import {StoryPlacesPage} from "../../StoryPlaces";
import BuildCondition from "./BuildCondition";
import BuildEffect from "./BuildEffect";

let defaultBasicPage: BasicPage = {
    description: function() {return `${this.name} - ${this.hint}`},
    content: function() { return this.pageContent },
    conditions: [],
    effects: []
};


export default function BuildPage(storyData, pageData): StoryPlacesPage {
    let page: StoryPlacesPage = {
        ...defaultBasicPage,
        name: pageData.name,
        pageContent: pageData.content,
        pageTransition: pageData.pageTransition,
        hint: pageData.hint.direction
    };

    page.conditions = pageData.conditions.map(cond => BuildCondition(storyData, cond));
    page.effects = pageData.functions.map(effect => BuildEffect(storyData, effect));

    return page;
}
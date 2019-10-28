import {StoryPlacesPage} from "../../StoryPlaces";
import {SculpturalHypertext} from "../../../../engine/SculpturalHypertextEngine";
import BuildPage from "./BuildPage";

export default function Build(storyData: object): SculpturalHypertext<StoryPlacesPage> {
    //Now we know it's an object, forget about the type. We get errors otherwise.
    let story = <any>storyData;

    let pageBuilder = BuildPage.bind(this, story);

    let pages: StoryPlacesPage[] = story.pages.map(pageBuilder);

    return {
        pages: pages,
        state: {}
    }
}
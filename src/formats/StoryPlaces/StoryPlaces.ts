import {BasicPage} from "../../engine/BasicStory";
import {SculpturalHypertext} from "../../engine/SculpturalHypertextEngine";
import BuildV2 from "./schemaTranslators/v2/Build";
import * as Ajv from "ajv";
import * as metaschema from "ajv/lib/refs/json-schema-draft-06.json";
import * as schema02 from "./schemas/story.schema.02.json";
import * as schema03Draft from "./schemas/story.schema.03.draft.json";
import * as schema02Multi from "./schemas/story.schema.multi.02.json";

export interface StoryPlacesPage extends BasicPage {
    name: string,
    pageContent: string,
    pageTransition: string
    hint: string
}

export interface StoryPlacesSchemaTranslator {
    (storyData: string): SculpturalHypertext<StoryPlacesPage>;
}

let ajv = new Ajv();
ajv.addMetaSchema(metaschema);
ajv.addSchema(schema02, '02');
ajv.addSchema(schema03Draft, '03.draft');
ajv.addSchema(schema02Multi, '02.multi');

export default function Build(storyJSON: any): SculpturalHypertext<StoryPlacesPage> {
    let storyData = null;
    if (typeof(storyJSON) == "object") {
        storyData = storyJSON;
    } else {
        storyData = JSON.parse(storyJSON);
    }

    let validStory = ajv.validate('02', storyJSON);
    if(!validStory) {
        console.error("JSON doesn't match a valid schema");
        //return null;
    }

    return BuildV2(storyData);
}



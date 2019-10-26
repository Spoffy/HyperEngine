import {Page} from "./SculpturalHypertextEngine";

export interface BasicPage extends Page {
    description: () => string,
    content: () => string
}
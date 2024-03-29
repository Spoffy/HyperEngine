import * as readline from "readline";
import {Choice, ListChoices, SculpturalHypertext} from "../engine/SculpturalHypertextEngine";
import {BasicPage} from "../engine/BasicStory";
import Build from "../formats/StoryPlaces/StoryPlaces";
import * as fs from "fs";

let commandline = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        commandline.question(question + "\n", (answer) => {
            resolve(answer);
        });
    });
}

async function main(story: SculpturalHypertext<BasicPage>) {

    let choices: Choice<BasicPage>[] = ListChoices(story);

    commandline.write("Welcome to the command line hypertext client.\n");
    commandline.prompt();

    while (choices.length > 0) {
        let descriptions = choices.map((choice, index) =>
            `[${index}]: ${choice.page.description()}`
        );

        let question = `Please choose a page: \n${descriptions.join("\n")}`;

        let answer = await askQuestion(question);

        let choiceNumber = parseInt(answer, 10);

        if (isNaN(choiceNumber) || choiceNumber < 0 || choiceNumber > (choices.length - 1)) {
            commandline.write("Error: That is not a valid option\n");
            continue;
        }

        let choice = choices[choiceNumber];

        commandline.write(`\n${choice.page.content()}\n\n`);

        let newHypertext = choice.choose();

        choices = ListChoices(newHypertext);
    }

    console.log("Story finished!");
}

let file = process.argv[2];

let storyData = JSON.parse(fs.readFileSync(file, {encoding: "UTF-8"}));

main(Build(storyData));



import * as readline from "readline";
import {default as BuildStory} from "../formats/BasicTestStory";
import {Choice, ListChoices, SculpturalHypertext} from "../engine/SculpturalHypertextEngine";
import {BasicPage} from "../engine/BasicStory";

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

async function main() {
    let testStory: SculpturalHypertext<BasicPage> = BuildStory();

    let choices: Choice<BasicPage>[] = ListChoices(testStory);

    commandline.write("Welcome to the command line hypertext client.\n");
    commandline.prompt();

    while (choices.length > 0) {
        let descriptions = choices.map((choice, index) =>
            `[${index}]: ${choice.page.description}`
        );

        let question = `Please choose a page: \n${descriptions.join("\n")}`;

        let answer = await askQuestion(question);

        let choiceNumber = parseInt(answer, 10);

        if (isNaN(choiceNumber) || choiceNumber < 0 || choiceNumber > (choices.length - 1)) {
            commandline.write("Error: That is not a valid option\n");
            continue;
        }

        let choice = choices[choiceNumber];

        commandline.write(`\n${choice.page.content}\n\n`);

        let newHypertext = choice.choose();

        choices = ListChoices(newHypertext);
    }
}

main();

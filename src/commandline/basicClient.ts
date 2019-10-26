import * as readline from "readline";

let commandline = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

commandline.write("Welcome to the command line hypertext client.");

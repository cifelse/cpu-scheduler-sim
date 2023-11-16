import { cli } from "../utils/cli.js";
import { getInputFiles, read } from "../utils/io.js";

// Name of the Algorithm
export const name = `Round Robin`;

/**
 * First Come First Serve Algorithm
 * @module models/rr
 * @async
 * @method
 */
export const execute = async () => {
    let choice, valid = true, reset = false, exit = false;

    // Retrieve Inputs
    const inputList = await getInputFiles();

    // Choose Input File
    do {
        cli.info(`You have chosen ${name}!`, true);

        cli.table(inputList);
        
        const { answer, error } = await cli.ask(`Using the index, choose which input file to use: `, !valid);

        if (error) return cli.error(error);

        if (answer.toLowerCase() === 'exit') {
            reset = false;
            exit = true;
        }
        else {
            choice = (answer === '0') ? 0 : (parseInt(answer) || answer);

            valid = ((typeof choice) === 'number') && (choice >= 0) && (choice < (inputList.length));

            reset = (!valid);
        }
    }
    while (reset && !exit);

    // If the user wants to exit
    if (exit) return;

    // Algorithm Proper
    const contents = await read(`././inputs/${inputList[choice].files}`);

    const results = contents;

    // Ask User if they want to try another algorithm
    do {
        cli.info(results.toString(), true);

        const { answer, error } = await cli.ask(`Try another algorithm? (Y/n) `, !valid);

        if (error) return cli.error(error);

        if (answer.toLowerCase() === 'exit') {
            reset = choice = false;
            exit = true;
        }
        else if (answer.toLowerCase() === 'y') {
            choice = true;
            reset = false;
        }
        else if (answer.toLowerCase() === 'n') {
            reset = choice = false;
        }
        else {
            reset = true;
            valid = false;
        }
    } while (reset && !exit);

    return choice;
}
import { cli } from "./cli.js";
import readline from "readline";
import fs from "fs";

/**
 * Gets the inputs from the inputs folder
 * @async
 * @method
 * @returns {Array} - The inputs
 */
export const getInputFiles = async () =>{
    const inputList = [];

    for (const file of fs.readdirSync('././inputs').filter(file => file.endsWith('.txt'))) {
        inputList.push({ files: file });
    }

    return inputList;
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 */
export const read = async (filePath) => {
    const contents = [], stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        const [process, arrival, burst] = line.split(' ');
        contents.push({ process, arrival, burst });
    }

    return contents;
}


/**
 * Gets the processes from the user
 * @async
 * @method
 * @param {Number} limit - Number of Processes
 * @returns {Array} - Array of Processes
 */
export const getProcesses = async (limit) => {
    const processes = [];

    // Get the processes from the user
    for (let i = 0; i < limit; i++) {
        const { answer, error } = await cli.ask(`Enter Process ${i + 1}: `);

        if (error) return cli.error(error);

        const [id, arrival, burst] = answer.split(' ').map(v => { return parseInt(v) });

        // Check if the values are valid
        if (isNaN(id) || (id <= 0)) i--;

        else processes.push({ id, arrival, burst });
    }

    return processes;
}

/**
 * Display Results and Ask the user if they want to try another algorithm
 * @async
 * @method
 * @param {Array<String>} results - Results of the test
 * @returns {Boolean} - If the user wants to reset
 */
export const display = async (results) => {
    let reset = false;

    do {
        cli.info(`Results of the Process:`, { clear: 'true', color: 'yellow' });

        cli.info(`${results.join('\n')}\n`);

        const { answer, error } = await cli.ask(`Try another algorithm? (Y/n) `, reset);

        if (error) return cli.error(error);

        if (answer.toLowerCase() === 'exit' || answer.toLowerCase() === 'n') {
            return false;
        }
        else if (answer.toLowerCase() === 'y') {
            return true;
        }
        else {
            reset = true;
        }
    } while (reset);
}
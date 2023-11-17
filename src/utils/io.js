import { cli } from "./cli.js";
import readline from "readline";
import fs from "fs";

/**
 * Gets the inputs from the inputs folder
 * @async
 * @method
 * @param {String} dir - The path to the inputs folder
 * @returns {Array} - The inputs
 */
export const getTestFiles = async (dir) =>{
    const inputList = [];

    for (const file of fs.readdirSync(dir).filter(file => file.endsWith('.txt'))) {
        inputList.push(file);
    }

    return inputList;
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 * @return {Array<Object>} - The contents of the file
 */
export const readInput = async (filePath) => {
    const contents = [], stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        const [A, B, C] = line.split(' ');
        if (A != 0) contents.push({ id: parseInt(A), arrival: parseInt(B), burst: parseInt(C) });
    }

    return contents;
}

/**
 * Reads the file line by line
 * @async
 * @method
 * @param {String} filePath - The path to the file to process
 * @return {Array<Object>} - The contents of the file
 */
export const readOutput = async (filePath) => {
    const contents = [], stream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of reader) {
        contents.push(line);
    }

    return contents;
}


/**
 * Gets the processes from the user
 * @async
 * @method
 * @param {Number} limit - Number of Processes
 * @param {Bool} complete - If the user wants to read from a file
 * @returns {Array} - Array of Processes
 */
export const getProcesses = async (limit, complete) => {
    let valid = true, processes = [];

    if (complete) {
        const { answer, error } = await cli.ask(`Enter Input Filename [input.txt]: `);

        if (error) return cli.error(error);

        return await readInput('./' + (answer.lenght > 0 ? answer : 'input.txt'));
    }

    // Get the processes from the user
    for (let i = 0; i < limit; i++) {
        const { answer, error } = await cli.ask(`Enter Process ${i + 1}: `, !valid);

        if (error) return cli.error(error);

        const [id, arrival, burst] = answer.split(' ').map(v => { return parseInt(v) });

        // Check if the values are valid
        if (isNaN(arrival) || isNaN(id) || (id <= 0)) {
            valid = false;
            i--;
        }
        else {
            valid = true;
            processes.push({ id, arrival, burst });
        }
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
        cli.info(`Results of the Process:`, { clear: true, color: 'yellow' });

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